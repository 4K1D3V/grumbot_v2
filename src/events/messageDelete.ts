import { AuditLogEvent, EmbedBuilder, Message, TextChannel } from "discord.js";
import allGuildsMap from "../bot";

export async function execute(deletedMessage: Message) {
    const logsChannelId = allGuildsMap.guildLogsChannelMap.get(deletedMessage.guildId!);
    const isLogsChannelSet = logsChannelId !== undefined;
    const isLogsEnabled = allGuildsMap.guildIsLogsEnabledMap.get(deletedMessage.guildId!);
    const logsChannel = isLogsChannelSet ? deletedMessage.client.channels.cache.get(logsChannelId) as TextChannel : undefined;
    if (isLogsEnabled === 0) return;
    else if (logsChannel === undefined) return;
    else {
        const deleteEmbed = new EmbedBuilder()
        deleteEmbed
            .setTitle("Message Deleted")
            .setDescription(`Message sent by <@${deletedMessage.author.id}> was deleted in <#${deletedMessage.channel.id}>`)
            .setTimestamp(deletedMessage.createdAt)
            .setColor(0xED4245)
            .setFooter({ text: "Message deleted" })
            .setAuthor({ name: `${deletedMessage.author.username}`, iconURL: deletedMessage.author.displayAvatarURL() });
        const auditLog = await deletedMessage.guild?.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MessageDelete });
        const messageDeleteLog = auditLog?.entries.first();
        if (!messageDeleteLog) {
            deleteEmbed
                .addFields(
                    { name: "Message Deleted By - ", value: 'Unknown. No audit logs found!' },
                    { name: "Message Content", value: deletedMessage.content }
                )
        } else {
            deleteEmbed
                .addFields(
                    { name: "Message Deleted By - ", value: `<@${messageDeleteLog.executor?.id}>` },
                    { name: "Message Content", value: deletedMessage.content }
                )
        }
        logsChannel.send({ embeds: [deleteEmbed] });
    }
}

