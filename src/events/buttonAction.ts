import { ButtonInteraction, ChannelType, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import allGuildsMap from "../bot"
import TicketData from "../model/ticketData.model";

export async function execute(interaction: ButtonInteraction) {
    if (interaction.customId === "ticketButton") {
        const guildTicketData: TicketData = JSON.parse(allGuildsMap.guildTicketsDataMap.get(interaction.guild?.id!)!);
        try {
            const createdTicketChannel = await interaction.guild?.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText
            }).then(channel => {
                channel.setParent(`${guildTicketData.ticketCategory}`);
                channel.permissionOverwrites.create(interaction.guild?.roles.everyone.id as string, { ViewChannel: false, SendMessages: false, });
                channel.permissionOverwrites.create(interaction.user.id, { ViewChannel: true, SendMessages: true, AttachFiles: true, SendVoiceMessages: true, EmbedLinks: true, AddReactions: true, UseExternalEmojis: true, ReadMessageHistory: true });
                guildTicketData.ticketRoles.split(",").forEach(role => {
                    channel.permissionOverwrites.create(role, { ViewChannel: true, UseApplicationCommands: true, ManageChannels: true, ManageMessages: true, ReadMessageHistory: true })
                })
                return channel;
            })
            const ticketEmbed = new EmbedBuilder()
                .setTitle(`${interaction.guild?.name} Support`)
                .setDescription("How can we help you?")
                .setTimestamp(new Date())
                .setFooter({ text: "Grumbot", iconURL: interaction.client.user.displayAvatarURL() });
            await createdTicketChannel?.send({
                embeds: [ticketEmbed]
            })
        } catch (err) {
            interaction.reply({
                content: "Unable to create ticket!",
                ephemeral: true
            });
        }
    }
}