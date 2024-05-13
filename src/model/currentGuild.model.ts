import { RowDataPacket } from "mysql2";

export default interface CurrentGuild extends RowDataPacket {
    guild_id?: string,
    guild_name?: string,
    command_prefix?: string,
}