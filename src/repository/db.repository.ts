import { ResultSetHeader } from "mysql2";
import connection from "../db/db"
import CurrentGuild from "../model/currentGuild.model"

interface IGuildRepository {
    save(guild: CurrentGuild): Promise<CurrentGuild>;
    getAllGuilds(): Promise<CurrentGuild[]>;
    getGuildById(guildId: string): Promise<CurrentGuild>;
    updateGuildCommandPrefix(guild: CurrentGuild): Promise<CurrentGuild>;
    updateGuildStaff(guild: CurrentGuild): Promise<CurrentGuild>;
    updateGuildStaffRole(guildStaffRoleId: string, guildId: string): Promise<string>;
    updateGuildLogsChannel(guildLogsChannelId: string, guildId: string): Promise<string>;
    updateGuildTicketsData(guildTicketData: string, guildId: string): Promise<CurrentGuild>;
    toggleLogs(guildId: string, value: number): Promise<string>;
}

class GuildRepository implements IGuildRepository {
    /**
     * Saves the guild in SQL Databasee
     * @param guild - The guild to save
     * @returns The saved guild
     */
    save(guild: CurrentGuild): Promise<CurrentGuild> {
        return new Promise((resolve, reject) => {
            connection.query<ResultSetHeader>(
                `INSERT INTO guilds (guild_id, guild_name, command_prefix) VALUES (?,?,?)`,
                [guild.guild_id, guild.guild_name, guild.command_prefix],
                (error, result) => {
                    if (error) reject(error);
                    else this.getGuildById(result.insertId as unknown as string).then((guild) => resolve(guild)).catch(reject);
                    
                }
            );
        });
    }

    /**
     * Gets all the guilds from the SQL Database
     * @returns All the guilds
     */
    getAllGuilds(): Promise<CurrentGuild[]> {
        return new Promise((resolve,reject) => {
            connection.query<ResultSetHeader>(
                `SELECT * FROM guilds`,
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as unknown as CurrentGuild[]);
                }
            )
        })
    }

    /**
     * Gets the guild by its ID
     * @param guildId - The ID of the guild
     * @returns The guild
     */
    getGuildById(guildId: string): Promise<CurrentGuild> {
        return new Promise((resolve, reject) => {
            connection.query<ResultSetHeader>(
                `SELECT * FROM guilds WHERE guild_id = ?`,
                [guildId],
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as unknown as CurrentGuild);
                }
            )
        })
    }

    /**
     * Updates the command prefix of the guild
     * @param guild - The guild to update
     * @returns The updated guild
     */
    updateGuildCommandPrefix(guild: CurrentGuild): Promise<CurrentGuild> {
        return new Promise((resolve, reject) => {
            connection.query<ResultSetHeader>(
                `UPDATE guilds SET command_prefix = ? WHERE guild_id = ?`,
                [guild.command_prefix, guild.guild_id],
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as unknown as CurrentGuild);
                }
            )
        })
    }

    /**
     * Updates the staff user of the guild
     * @param guild - The guild to update
     * @returns The updated guild
     */
    updateGuildStaff(guild: CurrentGuild): Promise<CurrentGuild> {
        return new Promise((resolve, reject) => {
            connection.query<ResultSetHeader>(
                `UPDATE guilds SET staff_user_id = ? WHERE guild_id = ?`,
                [guild.staff_user_id, guild.guild_id],
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as unknown as CurrentGuild);
                }
            )
        })
    }

    /**
     * Updates the staff role of the guild
     * @param guildStaffRoleId - The ID of the staff role
     * @param guildId - The ID of the guild
     * @returns The updated guild
     */
    updateGuildStaffRole(guildStaffRoleId: string, guildId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            connection.query<ResultSetHeader>(
                `UPDATE guilds SET staff_role_id = ? WHERE guild_id = ?`,
                [guildStaffRoleId, guildId],
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as unknown as string);
                }
            )
        })
    }

    updateGuildLogsChannel(guildLogsChannelId: string, guildId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            connection.query<ResultSetHeader>(
                `UPDATE guilds SET logs_channel_id = ? WHERE guild_id = ?`,
                [guildLogsChannelId, guildId],
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as unknown as string);
                }
            )
        })
    }

    toggleLogs(guildId: string, value: number): Promise<string> {
        return new Promise((resolve, reject) => {
            connection.query<ResultSetHeader>(
                `UPDATE guilds SET is_logs_enabled = ? WHERE guild_id = ?`,
                [value, guildId],
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as unknown as string);
                }
            )
        })
    }

    updateGuildTicketsData(guildTicketData: string, guildId: string): Promise<CurrentGuild> {
        return new Promise((resolve, reject) => {
            connection.query<ResultSetHeader>(
                `UPDATE guilds SET is_tickets_enabled = '1', tickets_data = ? WHERE guild_id = ?`,
                [guildTicketData, guildId],
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as unknown as CurrentGuild);
                }
            )
        })   
    }

}

export default new GuildRepository();