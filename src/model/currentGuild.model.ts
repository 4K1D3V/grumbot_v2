import { RowDataPacket } from "mysql2";

export default interface CurrentGuild extends RowDataPacket {
    guild_id?: string,
    guild_name?: string,
    command_prefix?: string,
    logs_channel_id?: string,
    is_logs_enabled?: number,
    is_tickets_enabled?: number,
    tickets_data?: string
}