import { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("banlist")
    .setDescription("List all the banned users on the server.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers);

export async function execute(interaction: ChatInputCommandInteraction) {
    const banlist = await interaction.guild?.bans.fetch();
    const banEmbed = new EmbedBuilder()
        .setTitle("Banned Users")
        .setDescription("Banned users in the server -")
        .setFooter({ text: `${banlist?.size} banned users on ${interaction.guild?.name}` })
        .setTimestamp(new Date());
    if (banlist?.size === 0) {
        banEmbed.addFields({ name: "No banned users", value: "There are no banned users on this server. GG's" });
    } else {
        banlist?.forEach((user) => {
            banEmbed.addFields({ name: `${user.user.tag}`, value: `${user.reason ? user.reason : "No reason provided."}` });
        });
    }
    await interaction.reply({ embeds: [banEmbed] });
}

