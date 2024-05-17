import { RowDataPacket } from "mysql2";

export default interface CurrentGuild extends RowDataPacket {
    guild_id?: string,
    guild_name?: string,
    command_prefix?: string,
    staff_user_id?: string,
    staff_role_id?: string,
}