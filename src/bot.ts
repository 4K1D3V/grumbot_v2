import { Client } from 'discord.js';
import { deployCommands } from './deploy-commands';
import { commands } from './commands';
import { config } from './config';
import express from 'express';
import events from "./events/index"

const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});

// Event fired once, when the client is ready
client.once("ready", async () => {
    console.log("Discord bot is ready! 🤖");
});

// Event fired each time the bot is added to a guild
client.on("guildCreate", async () => {
    await deployCommands();
});

// Interaction Create Events, redirects slash commands to respective files
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

// Login bot to discord
client.login(config.DISCORD_TOKEN);

// Express Stuff
const app = express();
const port = config.PORT;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}!`);
})

//Message Create Events
client.on('messageCreate', async (message) => {
    events.messageCreate;
})