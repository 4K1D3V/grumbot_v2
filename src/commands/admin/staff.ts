import { ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import allGuildsMap, { updateGuildMaps } from "../../bot";
import dbRepository from "../../repository/db.repository";
import CurrentGuild from "../../model/currentGuild.model";

export const data = new SlashCommandBuilder()
    .setName("staff")
    .setDescription("Staff command")
    .addSubcommand(subcommand =>
        subcommand
            .setName("add")
            .setDescription("Adds a user to staff")
            .addUserOption(option =>
                option
                    .setName("user")
                    .setDescription("User to add to staff")
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName("remove")
            .setDescription("Removes a user from staff")
            .addUserOption(option =>
                option
                    .setName("user")
                    .setDescription("User to remove from staff")
                    .setRequired(true)
            )
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const subcommand = interaction.options.getSubcommand();
    const target = interaction.options.getUser("user");
    var staffToUpdate: string[] = [];
    const currentStaff = allGuildsMap.guildStaffUserIdMap.get(interaction.guildId as string);
    if (!target) await interaction.editReply({ content: "Please provide a user to add/remove from staff" });
    if (subcommand === "add") {
        if (currentStaff === undefined) {
            staffToUpdate.push(target?.id!);
            await updateStaff(interaction, staffToUpdate);
            await interaction.editReply(`Added <@${target?.id}> to Staff!`)
        } else {
            staffToUpdate = currentStaff;
            if (staffToUpdate.includes(target?.id!)) {
                await interaction.editReply(`User <@${target?.id}> already exists as staff!`);
                return;
            }
            else {
                staffToUpdate.push(target?.id!);
                await updateStaff(interaction, staffToUpdate);
                await interaction.editReply(`Added <@${target?.id}> to Staff!`)
            }
        }
    } else if (subcommand === "remove") {
        if (currentStaff === undefined) {
            await interaction.editReply(`There are no staff in the Guild Currently! Please run the command \`/addstaff\` to add a staff.`)
        } else {
            if (currentStaff.includes(target?.id!)) {
                if (currentStaff[1] === undefined) {
                    staffToUpdate === null;
                }
                else {
                    const index = currentStaff.indexOf(target?.id!)
                    if (index > -1) {
                        currentStaff.splice(index, 1);
                        staffToUpdate = currentStaff;
                    }
                }
                updateStaff(interaction, staffToUpdate);
                interaction.editReply(`Removed <@${target?.id}> from Staff!`)
            } else {
                await interaction.editReply(`User <@${target?.id}> is not a staff member! Run \`/addstaff\` to add a new staff.`)
            }
        }
    }
}

async function updateStaff(interaction: ChatInputCommandInteraction, staffToAdd: string[]) {
    const guild = {
        guild_id: interaction.guildId!,
        guild_name: interaction.guild?.name!,
        command_prefix: allGuildsMap.guildCommandPrefixMap.get(interaction.guildId!)!,
        staff_user_id: staffToAdd.toString()
    }
    dbRepository.updateGuildStaff(guild as CurrentGuild);
    await updateGuildMaps();

}