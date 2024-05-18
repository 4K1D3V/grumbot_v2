import { CommandInteraction, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import dbRepository from "../../repository/db.repository";
import { updateGuildMaps } from "../../bot";

export const data = new SlashCommandBuilder()
    .setName("setlogschannel")
    .setDescription("Set the channel for the server logs.")
    .addChannelOption((channel) => channel.setName("channel").setDescription("The channel to send the logs to.").setRequired(true))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const channel = interaction.options.get("channel")?.channel as TextChannel;
    if (!channel) await interaction.editReply({ content: "Please provide a valid channel."});
    else await interaction.editReply({ content: `The channel for the server logs has been set to <#${channel.id}>.`});
    await dbRepository.updateGuildLogsChannel(channel.id, interaction.guildId!);
    await updateGuildMaps();
}

