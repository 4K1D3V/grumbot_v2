import { Guild, TextChannel } from "discord.js";
import { deployCommands } from "../deploy-commands";
import dbRepository from "../repository/db.repository";
import CurrentGuild from "../model/currentGuild.model";

/**
 * Event fired each time the bot is added to a guild, checks and adds the guild to database if not exists
 * @param guild - The guild to add
 */
export async function execute(guild: Guild) {
    // Deploys the commands globally
    await deployCommands();
    var isGuildInSQL;
    // Check if guild is in SQL or not
    dbRepository.getGuildById(guild.id)
        .then((result: CurrentGuild) => {
            isGuildInSQL = result[0].guild_id ? true : false;
        });
    // Add the guild to SQL if it doesn't not already exist
    if (!isGuildInSQL) {
        const guildToSave = {
            guild_id: guild.id,
            guild_name: guild.name,
            command_prefix: "!"
        }
        dbRepository.save(guildToSave as CurrentGuild)
            .then((response) => {
                (guild.client.channels.cache.get("1239268841201078363") as TextChannel).send(`Grumbot has been added to a new Guild!\nGuild Name - ${response.guild_name}\nGuild Id - ${response.guild_id}`)
            })
    }
}