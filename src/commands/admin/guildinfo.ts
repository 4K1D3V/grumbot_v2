import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import dbRepository from "../../repository/db.repository"

export const data = new SlashCommandBuilder()
    .setName("guildinfo")
    .setDescription("Sends the current guild information");

export async function execute(interaction: CommandInteraction) {
    const result = await dbRepository.getGuildById(interaction.guildId as string);
    console.log(result);
    await interaction.reply(`Guild Info - ${result[0].guild_name}\nCommand Prefix - ${result[0].command_prefix}`);
}