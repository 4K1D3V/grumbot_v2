import { ButtonInteraction, ChannelType, PermissionFlagsBits } from "discord.js";
import allGuildsMap from "../bot"

export async function execute(interaction: ButtonInteraction) {
    if (interaction.customId === "ticketButton") {
        const ticketCategory = allGuildsMap.guildTicketsDataMap.get(interaction.guild?.id!);
        try {
            await interaction.guild?.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
            }).then(channel => {
                channel.setParent(`${ticketCategory}`);
                channel.permissionOverwrites.set([
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.AddReactions, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                    },
                    {
                        id: interaction.guild?.roles.everyone.id as string,
                        deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                    },
                ])
            })
        } catch (err) {
            interaction.reply({
                content: "Unable to create ticket!",
                ephemeral: true
            });
        }
    }
}