import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import allGuildsMap from "../../bot"

export const data = new SlashCommandBuilder()
    .setName("viewprefix")
    .setDescription("Sends the current set Command Prefix for the Guild");

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const commandPrefix = allGuildsMap.guildCommandPrefixMap.get(interaction.guildId!)
    await interaction.editReply(`The command prefix for the guild is set as - \`${commandPrefix}\` \nTo change it, run the command \`/updateprefix\``);
}