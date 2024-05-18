import { CommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import allGuildsMap from "../../bot"

export const data = new SlashCommandBuilder()
    .setName("viewlogschannel")
    .setDescription("View the channel that the server logs are being sent to.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false);

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const guildLogsChannel = allGuildsMap.guildLogsChannelMap.get(interaction.guildId!);
    if (!guildLogsChannel) {
        interaction.editReply("This server does not have a logs channel set.");
        return;
    }
    interaction.editReply(`The logs channel for this server is <#${guildLogsChannel}>`);
}

