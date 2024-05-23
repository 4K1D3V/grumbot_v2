import { ActionRowBuilder, ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder, StringSelectMenuBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban someone from the server.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)

export const execute = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const dropdown = new StringSelectMenuBuilder()
        .setCustomId("user")
        .setPlaceholder("Select a User to Unban");
    const banlist = await interaction.guild?.bans.fetch();
    if (banlist?.size === 0) {
        await interaction.editReply("There are no banned users in this server.");
        return;
    }
    banlist?.forEach((bannedMember) => {
        dropdown.addOptions({
            label: bannedMember.user.tag,
            value: bannedMember.user.id
        });
    });
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(dropdown);
    const response = await interaction.editReply({ content: "Select a user to unban.", components: [row] });

    try {
        const userToUnban = await response.awaitMessageComponent({ filter: (i: any) => i.user.id === interaction.user.id, time: 30_000 });
        console.log(userToUnban);
    } catch (error) {
        console.log(error);
    }
    await interaction.editReply("Testing");
}

