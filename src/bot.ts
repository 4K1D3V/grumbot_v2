import { Client, Guild, TextChannel } from 'discord.js';
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
client.on("guildCreate", async (guild: Guild) => {
    events.guildCreate.execute(guild);
});

// Interaction Create Events, redirects slash commands to respective files
client.on("interactionCreate", async (interaction) => {
    events.interactionCreate.execute(interaction);
});

//Message Create Events
client.on('messageCreate', async (message) => {
    events.messageCreate.execute(message)
})

// Login bot to discord
client.login(config.DISCORD_TOKEN);

// Express Stuff
const app = express();
const port = config.PORT;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}!`);
})