import { ActivitiesOptions, ActivityType, Client, Guild, Message, TextChannel } from 'discord.js';
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
                newActivity
            ]
        })

    }, 300_000);
});

// Event fired each time the bot is added to a guild
client.on("guildCreate", async (guild: Guild) => {
    await updateGuildMaps();
    events.guildCreate.execute(guild);
});

// Interaction Create Events, redirects slash commands to respective files
client.on("interactionCreate", async (interaction) => {
    events.interactionCreate.execute(interaction);
});

// Message Create Events
client.on('messageCreate', async (message) => {
    events.messageCreate.execute(message)
})

// Message Update Events
client.on('messageUpdate', async (oldMessage, newMessage) => {
    events.messageUpdate.execute(oldMessage as Message<boolean>, newMessage as Message<boolean>);
})

// Login bot to discord
client.login(config.DISCORD_TOKEN);

// Express Stuff
const app = express();
const port = config.PORT;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}!`);
})

function getTotalGuilds() {
    var guildCount: number = 0;
    client.guilds.cache.map(guild => guildCount++);
    return guildCount;
}

function getTotalUsers() {
    var memberCount: number = 0;
    client.guilds.cache.map(guild => memberCount += guild.memberCount)
    return memberCount;
}

var guildCommandPrefixMap: Map<string, string> = new Map();
var guildStaffUserIdMap: Map<string,string[]> = new Map();
var guildStaffRoleIdMap: Map<string, string> = new Map();

export async function updateGuildMaps() {
    const allGuildsId: string[] = client.guilds.cache.map(guild => guild.id);
    var allGuildsInSQL: CurrentGuild[];
    await dbRepository.getAllGuilds().then(guilds => {
        allGuildsInSQL = guilds;
    });
    allGuildsId.forEach(guildid => {
        allGuildsInSQL.find(guild => {
            if (guild.guild_id === guildid) {
                guildCommandPrefixMap.set(guildid, guild.command_prefix!);
                guildStaffUserIdMap.set(guildid, guild.staff_user_id?.split(",")!);
                guildStaffRoleIdMap.set(guildid, guild.staff_role_id!);
            }
        })
    })
}

export default {
    guildCommandPrefixMap, guildStaffUserIdMap, guildStaffRoleIdMap
}