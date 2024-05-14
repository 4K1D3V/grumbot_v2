import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import allGuildsMap, { updateGuildMaps } from "../../bot";
import dbRepository from "../../repository/db.repository";
import CurrentGuild from "../../model/currentGuild.model";

export const data = new SlashCommandBuilder()
    .setName("removestaff")
    .setDescription("Removes a user from staff")
    .addUserOption(option =>
        option
            .setName("user")
            .setDescription("User to add to staff")
            .setRequired(true)
    );

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    if (interaction.user.id !== interaction.guild?.ownerId) {
        if (!allGuildsMap.guildStaffUserIdMap.get(interaction.guildId!)?.includes(interaction.user.id)) {
            await interaction.editReply({ content: "You don't have permission to run this command!" });
            return;
        }
    }
    const userToRemove = interaction.options.get("user")?.user;
    const currentStaff = allGuildsMap.guildStaffUserIdMap.get(interaction.guildId as string);
    var staffToUpdate: string[] = [];
    if (currentStaff === undefined) {
        await interaction.editReply(`There are no staff in the Guild Currently! Please run the command /addstaff to add a staff.`)
    } else {
        if (currentStaff.includes(userToRemove?.id!)) {
            const index = currentStaff.indexOf(userToRemove?.id!)
            if (index > -1) {
                currentStaff.splice(index, 1);
                staffToUpdate = currentStaff;
            }
        }
    }
    const guild = {
        guild_id: interaction.guildId!,
        guild_name: interaction.guild?.name!,
        command_prefix: allGuildsMap.guildCommandPrefixMap.get(interaction.guildId!)!,
        staff_user_id: staffToUpdate.toString()
    }
    dbRepository.updateGuildStaff(guild as CurrentGuild);
    await updateGuildMaps();
    interaction.editReply(`Removed <@${userToRemove?.id}> from Staff!`)
}