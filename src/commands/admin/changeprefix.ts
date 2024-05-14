import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import dbRepository from "../../repository/db.repository";
import CurrentGuild from "../../model/currentGuild.model";
import { updateGuildMaps } from "../../bot";
import allGuildsMap from "../../bot";

export const data = new SlashCommandBuilder()
    .setName("changeprefix")
    .setDescription("Changes the command prefix for the guild")
    .addStringOption(option => 
        option
            .setName("prefix")
            .setDescription("The command prefix")
            .addChoices(
                { name: "!", value: "!" },
                { name: "?", value: "?" },
                { name: "-", value: "-" },
                { name: "~", value: "~"}
            )
            .setRequired(true)
    )

export async function execute(interaction: CommandInteraction) {
    if (!allGuildsMap.guildStaffUserIdMap.get(interaction.guildId!)?.includes(interaction.user.id) || interaction.user.id === interaction.guild?.ownerId) {
        await interaction.reply({content: "You don't have permission to run this command!", ephemeral:true });
        return;
    }
    await interaction.deferReply();
    const commandPrefix = interaction.options.get("prefix")?.value;
    const guild =  {
        guild_id: interaction.guildId!,
        guild_name: interaction.guild?.name,
        command_prefix: commandPrefix as string
    }
    dbRepository.updateGuildCommandPrefix(guild as CurrentGuild);
    await updateGuildMaps();
    await interaction.editReply(`Updated Guild Command Prefix to - ${commandPrefix}`);
}