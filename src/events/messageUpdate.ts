import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { config } from "../config";

export async function execute(oldMessage: Message<boolean>, newMessage: Message<boolean>) {
    if (oldMessage.author.bot || newMessage.author.bot) return;
    else {
        if (oldMessage.content.length >= 1024 || newMessage.content.length >= 1024) {

        }
        else {
            const messageEmbed = new EmbedBuilder();
            messageEmbed
                .setTitle("Message Edited")
                .setDescription(`Messag edited by <@${oldMessage.author.id}> in <#${oldMessage.channel.id}>`)
                .addFields(
                    { name: "Message Content", value: `Changed from ${oldMessage.content} to ${newMessage.content}`, inline: false },
                    { name: "Edited at", value: `${newMessage.editedAt}`, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: "Grumbot", iconURL: `${config.BOT_IMAGE}` });
            const channel: TextChannel = oldMessage.client.channels.cache.get("1239268841201078363") as TextChannel
            await channel.send({ content: "Message Edit Detected", embeds: [messageEmbed]}); 
        }
    }
}