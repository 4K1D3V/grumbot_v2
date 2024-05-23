import { ChannelType, ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import allGuildsMap, { updateGuildMaps } from "../../bot";
import dbRepository from "../../repository/db.repository";

export const data = new SlashCommandBuilder()
    .setName("logs")
    .setDescription("Toggle logs for the current server")
    .addSubcommand((subcommand) => subcommand.setName("disable").setDescription("Disable logs for the current server"))
    .addSubcommand((subcommand) => subcommand.setName("enable").setDescription("Enable logs for the current server"))
    .addSubcommandGroup((subcommandGroup) =>
        subcommandGroup
            .setName("channel")
            .setDescription("View / Set the current logs channel")
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("set")
                    .setDescription("Set the current logs channel")
                    .addChannelOption((channel) =>
                        channel
                            .setName("channel")
                            .setDescription("The channel to set as the logs channel")
                            .addChannelTypes(ChannelType.GuildText)
                            .setRequired(true)
                    )
            )
            .addSubcommand((subcommand) => subcommand.setName("view").setDescription("View the current logs channel"))
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false)

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const subcommand = interaction.options.getSubcommand();
    const logsChannel = allGuildsMap.guildLogsChannelMap.get(interaction.guildId!)
    if (logsChannel === undefined || logsChannel === null) {
        interaction.editReply({ content: "Logs channel not set! Please set a logs channel with `/setlogschannel` first!" });
        return;
    } else {
        if (subcommand === "disable") {
            if (allGuildsMap.guildIsLogsEnabledMap.get(interaction.guildId!) === 1) {
                dbRepository.toggleLogs(interaction.guildId!, 0);
                interaction.editReply({ content: "Logs disabled" });
            } else {
                interaction.editReply({ content: "Logs are already disabled" });
            }
        } else if (subcommand === "enable") {
            if (allGuildsMap.guildIsLogsEnabledMap.get(interaction.guildId!) === 0) {
                dbRepository.toggleLogs(interaction.guildId!, 1);
                interaction.editReply({ content: `Logs enabled. Logs channel is currently set as - <#${logsChannel}>` });
            } else {
                interaction.editReply({ content: `Logs are already enabled. Logs channel is currently set as - <#${logsChannel}>` });
            }
        } else if (subcommand === "view") {
            interaction.editReply({ content: `Logs channel is currently set as - <#${logsChannel}>` });
        } else if (subcommand === "set") {
            const channel = interaction.options.getChannel("channel") as TextChannel;
            if (!channel) await interaction.editReply({ content: "Please provide a valid channel." });
            if (!channel.permissionsFor(interaction.client.user!)?.has(PermissionsBitField.Flags.SendMessages))
                await interaction.editReply({ content: "I do not have the permissions to send messages to this channel." });
            else {
                await dbRepository.updateGuildLogsChannel(channel.id, interaction.guildId!);
                await interaction.editReply({ content: `The channel for the server logs has been set to <#${channel.id}>.` });
            }
        }
        await updateGuildMaps();
    }
}

