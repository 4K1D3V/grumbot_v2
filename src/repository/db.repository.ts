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
}

class GuildRepository implements IGuildRepository {
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

}

export default new GuildRepository();