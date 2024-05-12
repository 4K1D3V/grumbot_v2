import { ResultSetHeader } from "mysql2";
import connection from "../db/db"
import Guild from "../model/guild.model"

interface IGuildRepository {
    save(guild: Guild): Promise<Guild>;
    getAllGuilds(): Promise<Guild[]>;
    getGuildById(guildId: string): Promise<Guild>;
    updateGuild(guild: Guild): Promise<Guild>;
    deleteGuild(guildId: string): Promise<void>;
}

class GuildRepository implements IGuildRepository {
    save(guild: Guild): Promise<Guild> {
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
    getAllGuilds(): Promise<Guild[]> {
        return new Promise((resolve,reject) => {
            connection.query<ResultSetHeader>(
                `SELECT * FROM guilds`,
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as unknown as Guild[]);
                }
            )
        })
    }
    getGuildById(guildId: string): Promise<Guild> {
        return new Promise((resolve, reject) => {
            connection.query<ResultSetHeader>(
                `SELECT * FROM guilds WHERE guild_id = ?`,
                [guildId],
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as unknown as Guild);
                }
            )
        })
    }
    updateGuild(guild: Guild): Promise<Guild> {
        throw new Error("Method not implemented.");
    }
    deleteGuild(guildId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}

export default new GuildRepository();