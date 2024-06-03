import { ButtonInteraction, ChannelType, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import allGuildsMap from "../bot"
import TicketData from "../model/ticketData.model";

export async function execute(interaction: ButtonInteraction) {
    if (interaction.customId === "ticketButton") {
        const guildTicketData: TicketData = JSON.parse(allGuildsMap.guildTicketsDataMap.get(interaction.guild?.id!)!);
        try {
            const createdTicketChannel = await interaction.guild?.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: guildTicketData.ticketCategory,
                permissionOverwrites: [
                    {
                        id: interaction.guildId as string,
                        deny: ['ViewChannel']
                    } , 
                    {
                        id: interaction.user.id,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.EmbedLinks,
                            PermissionsBitField.Flags.AddReactions,
                            PermissionsBitField.Flags.ReadMessageHistory
                        ]
                    }
                ]
            }).then(channel => {
                guildTicketData.ticketRoles.split(",").forEach(role => {
                    channel.permissionOverwrites.set([{id: role}]);
                });
                return channel;
            })
            const ticketEmbed = new EmbedBuilder()
                .setTitle(`${interaction.guild?.name} Support`)
                .setDescription("How can we help you?")
                .setTimestamp(new Date())
                .setFooter({ text: "Grumbot", iconURL: interaction.client.user.displayAvatarURL() });
            await createdTicketChannel?.send({
                embeds: [ticketEmbed]
            });
            await interaction.reply({
                content: `Ticket Created Successfully <#${createdTicketChannel?.id}>`,
                ephemeral: true,
                components: []
            });
        } catch (err) {
            interaction.reply({
                content: "Unable to create ticket!",
                ephemeral: true
            });
        }
    }
}