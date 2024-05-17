import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import allGuildsMap from "../../bot"
import { EmbedBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
    .setName("viewstaff")
    .setDescription("Sends the current staff members of the Guild")
    .setDMPermission(false);

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const currentGuildStaff = allGuildsMap.guildStaffUserIdMap.get(interaction.guildId!);
    const staffEmbed = new EmbedBuilder()
        .setTitle(`Staff Members for ${interaction.guild?.name}`)
        .setDescription("Current Active Staff Members for the Server - ")
        .setTimestamp()
        .setFooter({ text: `Requested by - ${interaction.user.username}`, iconURL: interaction.user.avatarURL()! })
    currentGuildStaff?.forEach(staff => {
        staffEmbed.addFields(
            { name: `${interaction.client.users.cache.get(staff)?.username}`, value: `<@${staff}>`, inline: true }
        );
    })
    await interaction.editReply({embeds: [staffEmbed]});
}