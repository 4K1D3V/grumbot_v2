import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { config } from "../config";
import allGuildsMap from "../bot";

/**
 * Event fired each time a message is updated
 * @param oldMessage - The old message object
 * @param newMessage - The new message object
 */
export async function execute(oldMessage: Message<boolean>, newMessage: Message<boolean>) {
    const logsChannelId = allGuildsMap.guildLogsChannelMap.get(oldMessage.guildId!);
    const isLogsChannelSet = logsChannelId !== undefined;
    const logsChannel = isLogsChannelSet ? oldMessage.client.channels.cache.get(logsChannelId) as TextChannel : undefined;
    if (!logsChannel && allGuildsMap.guildIsLogsEnabledMap.get(oldMessage.guildId!) === 0) return;
    const messageEmbed = new EmbedBuilder();
    messageEmbed
        .setTitle("Message Edited")
        .setDescription(`Messag edited by <@${oldMessage.author.id}> in <#${oldMessage.channel.id}>`)
        .setTimestamp()
        .setFooter({ text: "Grumbot", iconURL: `${config.BOT_IMAGE}` });
    if (oldMessage.author.bot || newMessage.author.bot) return;
    else {
        messageEmbed.addFields(
            { name: "Message Content", value: `Changed from ${oldMessage.content.substring(0, 450)} to ${newMessage.content.substring(0, 450)}`, inline: false },
            { name: "Edited at", value: `${newMessage.editedAt}`, inline: false }
        )
        await logsChannel?.send({ content: "Message Edit Detected", embeds: [messageEmbed] });
    }
}