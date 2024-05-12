import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import dbRepository from "../../repository/db.repository"
import { config } from "../../config";

export const data = new SlashCommandBuilder()
    .setName("guildinfo")
    .setDescription("Sends the current guild information");

export async function execute(interaction: CommandInteraction) {
    if (!config.STAFF_USER_ID.includes(interaction.user.id)) {
        await interaction.reply({content: "You don't have permission to run this command!", ephemeral:true });
        return;
    }
    const result = await dbRepository.getGuildById(interaction.guildId as string);
    console.log(result);
    await interaction.reply(`Guild Info - ${result[0].guild_name}\nCommand Prefix - ${result[0].command_prefix}`);
}