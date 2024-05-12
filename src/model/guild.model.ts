import { RowDataPacket } from "mysql2";

export default interface Guild extends RowDataPacket {
    guild_id?: string,
    guild_name?: string,
    command_prefix?: string & { lenght: 1 },
}