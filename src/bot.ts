import { ActivitiesOptions, ActivityType, Client, Guild, Message } from 'discord.js';
import { config } from './config';
import express from 'express';
import events from "./events/index"
import dbRepository from './repository/db.repository';
import CurrentGuild from './model/currentGuild.model';

const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent", "GuildMembers", "GuildBans", "GuildModeration"],
});

/**
 * Event fired once, when the client is ready
 */
client.once("ready", async () => {
    console.log("Core Bot Is Ready!! 🤖");
    await updateGuildMaps();
    const guildCount = getTotalGuilds();
    const memberCount = getTotalUsers();
    const activities: ActivitiesOptions[] = [
            { name: `${guildCount} Guilds!`, type: ActivityType.Watching },
            { name: `${memberCount} Members!`, type: ActivityType.Watching }
    ]
    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * activities.length);
        const newActivity = activities[randomIndex];
        client.user?.setPresence({
            status: "online",
            activities: [
                I am Bot.
            ]
        })

    }, 300_000);
});

/**
 * Event fired each time the bot is added to a guild
 */
client.on("guildCreate", async (guild: Guild) => {
    await updateGuildMaps();
    events.guildCreate.execute(guild);
});

/**
 * Event fired each time an interaction is created
 */
client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) events.interactionCreate.execute(interaction);
});

/**
 * Event fired each time a message is sent
 */
client.on('messageCreate', async (message) => {
    events.messageCreate.execute(message)
})

/**
 * Event fired each time a message is updated
 */
client.on('messageUpdate', async (oldMessage, newMessage) => {
    events.messageUpdate.execute(oldMessage as Message<boolean>, newMessage as Message<boolean>);
})

client.on("messageDelete", async (message) => {
    events.messageDelete.execute(message as Message<boolean>);
})

// Login bot to discord
client.login(config.DISCORD_TOKEN);

// Express Stuff
const app = express();
const port = config.PORT;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}!`);
})

/**
 * Gets the total number of guilds
 * @returns The total number of guilds
 */
function getTotalGuilds() {
    var guildCount: number = 0;
    client.guilds.cache.map(guild => guildCount++);
    return guildCount;
}

/**
 * Gets the total number of users
 * @returns The total number of users
 */
function getTotalUsers() {
    var memberCount: number = 0;
    client.guilds.cache.map(guild => memberCount += guild.memberCount)
    return memberCount;
}

var guildCommandPrefixMap: Map<string, string> = new Map();
var guildLogsChannelMap: Map<string, string> = new Map();
var guildIsLogsEnabledMap: Map<string, number> = new Map();
var guildIsTicketsEnabledMap: Map<string, number> = new Map();
var guildTicketsDataMap: Map<string, string> = new Map();

/**
 * Updates the guild maps in memory
 */
export async function updateGuildMaps() {
    console.log("Started updating All Guild Maps")
    const allGuildsId: string[] = client.guilds.cache.map(guild => guild.id);
    var allGuildsInSQL: CurrentGuild[];
    await dbRepository.getAllGuilds().then(guilds => {
        allGuildsInSQL = guilds;
    });
    allGuildsId.forEach(guildid => {
        allGuildsInSQL.find(guild => {
            if (guild.guild_id === guildid) {
                guildCommandPrefixMap.set(guildid, guild.command_prefix!);
                guildLogsChannelMap.set(guildid, guild.logs_channel_id!);
                guildIsLogsEnabledMap.set(guildid, guild.is_logs_enabled!);
                guildIsTicketsEnabledMap.set(guildid, guild.is_tickets_enabled!);
                guildTicketsDataMap.set(guildid, guild.tickets_data!);
            }
        })
    })
    console.log("Finished updating All Guild Maps");
}

export default {
    guildCommandPrefixMap, guildLogsChannelMap, guildIsLogsEnabledMap,guildIsTicketsEnabledMap,guildTicketsDataMap
}

