import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import allGuildsMap, { updateGuildMaps } from "../../bot";
import dbRepository from "../../repository/db.repository";
import CurrentGuild from "../../model/currentGuild.model";

export const data = new SlashCommandBuilder()
    .setName("addstaff")
    .setDescription("Adds a user to staff")
    .addUserOption(option =>
        option
            .setName("user")
            .setDescription("User to add to staff")
            .setRequired(true)
    );

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    if (allGuildsMap.guildStaffUserIdMap.get(interaction.guildId!)?.includes(interaction.user.id) || interaction.user.id === interaction.guild?.ownerId) {
        await interaction.reply({ content: "You don't have permission to run this command!", ephemeral: true });
        return;
    }
    const userToAdd = interaction.options.get("user")?.user;
    const currentStaff = allGuildsMap.guildStaffUserIdMap.get(interaction.guildId as string);
    var staffToAdd: string[] = [];
    if (currentStaff === undefined) {
        staffToAdd.push(userToAdd?.id!);
    } else {
        staffToAdd = currentStaff;
        staffToAdd.push(userToAdd?.id!);
    }
    const guild = {
        guild_id: interaction.guildId!,
        guild_name: interaction.guild?.name!,
        command_prefix: allGuildsMap.guildCommandPrefixMap.get(interaction.guildId!)!,
        staff_user_id: staffToAdd.toString()
    }
    dbRepository.updateGuildStaff(guild as CurrentGuild);
    await updateGuildMaps();
    interaction.editReply(`Added <@${interaction.user.id}> to Staff!`)
}