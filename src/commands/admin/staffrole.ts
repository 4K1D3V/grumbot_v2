import { CommandInteraction, PermissionFlagsBits, PermissionsBitField, SlashCommandBuilder } from "discord.js"
import { updateGuildMaps } from "../../bot";
import dbRepository from "../../repository/db.repository";

export const data = new SlashCommandBuilder()
    .setName("staffrole")
    .setDescription("Set the role for staff.")
    .addRoleOption((role) => role.setName("role").setDescription("The role to set for staff.").setRequired(true))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const role = interaction.options.get("role")?.role;
    dbRepository.updateGuildStaffRole(role?.id!, interaction.guildId!);
    await updateGuildMaps();
    await interaction.editReply({ content: `Staff role updated to <@${role?.id}>` });
}

