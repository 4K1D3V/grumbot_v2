import { Client } from 'discord.js';
import { deleteCommands, deployCommands } from './deploy-commands';
import { commands } from './commands';
import { config } from './config';
import express from 'express';

const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});

client.once("ready", async () => {
    console.log("Discord bot is ready! 🤖");
});

client.on("guildCreate", async () => {
    await deployCommands();
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName } = interaction;
    try {
        if (commands[commandName as keyof typeof commands]) {
            commands[commandName as keyof typeof commands].execute(interaction);
        }
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "There was an error while executing this command!" });
    }
});

client.login(config.DISCORD_TOKEN);

// Express Stuff
const app = express();
const port = config.PORT;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}!`);
})

//Message Create Events
const ownerUserIds: String[] = ["1216042650096898189"];
client.on('messageCreate', async (message) => {
    // Ignore if message is from a bot
    if (message.author.bot) return;

    // Reply to helo grumbot
    if (message.content.toLowerCase().startsWith("hello grumbot")) {
        message.reply("Beep Boop .... Beep Beep, I am Grumbot. I am created by <@1216042650096898189>. I am still in development.")
    }

    // Reply to !deploy-commands to deploy bot commands to discord
    if (message.content.toLowerCase() === "!reload") {
        if (ownerUserIds.includes(message.author.id)) {
            const numberOfCommands = await deployCommands()
                .catch(error => {
                    console.error(error);
                    message.reply("There was an error while reloading the application (/) commands!");
                });
            message.reply("Reloading application (/) commands...")
                .then(msg => {
                    setTimeout(() => {
                        msg.edit(`Successfully reloaded ${numberOfCommands} application (/) commands.`);
                    }, 2000);
                })
        } else message.reply("You do not have permission to do this!");
    }
})