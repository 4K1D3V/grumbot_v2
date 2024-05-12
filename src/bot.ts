import { Client, Guild, TextChannel } from 'discord.js';
import { deployCommands } from './deploy-commands';
import { commands } from './commands';
import { config } from './config';
import express from 'express';
import events from "./events/index"
import dbRepository from './repository/db.repository';
import CurrentGuild from './model/currentGuild.model';

const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});

// Event fired once, when the client is ready
client.once("ready", async () => {
    console.log("Discord bot is ready! 🤖");
});

// Event fired each time the bot is added to a guild
client.on("guildCreate", async (guild: Guild) => {
    await deployCommands();
    var isGuildInSQL;
    dbRepository.getGuildById(guild.id)
        .then((result: CurrentGuild) => {
            isGuildInSQL = result[0].guild_id ? true : false;
        });
    if (!isGuildInSQL) {
        const guildToSave = {
            guild_id: guild.id,
            guild_name: guild.name,
            command_prefix: "!"
        }
        dbRepository.save(guildToSave as CurrentGuild)
            .then((response) => {
                (client.channels.cache.get("1239268841201078363") as TextChannel).send(`Grumbot has been added to a new Guild!\nGuild Name - ${response.guild_name}\nGuild Id - ${response.guild_id}`)
            })
    }

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