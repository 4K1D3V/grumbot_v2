import { ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import allGuildsMap, { updateGuildMaps } from "../../bot";
import dbRepository from "../../repository/db.repository";

export const data = new SlashCommandBuilder()
    .setName("togglelogs")
    .setDescription("Disable logs for the current server")
    .addSubcommand((query) => query.setName("disable").setDescription("Disable logs for the current server"))
    .addSubcommand((query) => query.setName("enable").setDescription("Enable logs for the current server"))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false)

export async function execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const logsChannel = allGuildsMap.guildLogsChannelMap.get(interaction.guildId!)
    if (logsChannel === undefined || logsChannel === null) {
        interaction.reply({ content: "Logs channel not set! Please set a logs channel with `/setlogschannel` first!" });
        return;
    } else {
        if (subcommand === "disable") {
            if (allGuildsMap.guildIsLogsEnabledMap.get(interaction.guildId!) === 1) {
                dbRepository.toggleLogs(interaction.guildId!, 0);
                interaction.reply({ content: "Logs disabled" });
            } else {
                interaction.reply({ content: "Logs are already disabled" });
            }
        } else if (subcommand === "enable") {
            if (allGuildsMap.guildIsLogsEnabledMap.get(interaction.guildId!) === 0) {
                dbRepository.toggleLogs(interaction.guildId!, 1);
                interaction.reply({ content: "Logs enabled" });
            } else {
                interaction.reply({ content: "Logs are already enabled" });
            }
        }
        await updateGuildMaps();
    }
}

