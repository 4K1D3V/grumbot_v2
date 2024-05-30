import { ChannelSelectMenuBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, ChannelSelectMenuInteraction, ChannelType, ChatInputCommandInteraction, Emoji, ModalBuilder, ModalSubmitInteraction, RoleSelectMenuBuilder, RoleSelectMenuInteraction, SlashCommandBuilder, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js";
import dbRepository from "../../repository/db.repository";
import allGuildsMap, { updateGuildMaps } from "../../bot";
import TicketData from "../../model/ticketData.model";

export const data = new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Grumbot's ticket module commands")
    .addSubcommand(subcommand =>
        subcommand.setName("enable")
            .setDescription("Enable and setup tickets module for the server, through an interactive popup")
    )
    .addSubcommand(subcommand =>
        subcommand.setName("disable")
            .setDescription("Disabled the ticket module")
    )
    .addSubcommandGroup(group =>
        group.setName("message")
            .setDescription("Ticket channel message command")
            .addSubcommand(subcommand =>
                subcommand.setName("set")
                    .setDescription("Sets the message for the ticket channel and button")
            )
    )
    .setDMPermission(false)

export async function execute(interaction: ChatInputCommandInteraction) {
    var ticketChannel;
    var ticketCategory;
    var ticketRoles;
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "enable") {
        await interaction.deferReply();
        // #1 - SELECT TICKET CHANNEL FOR SENDING THE TICKET MESSAGE
        const ticketChannelSelect = new ChannelSelectMenuBuilder()
            .setCustomId("ticketChannel")
            .setPlaceholder("Select the channel you want for tickets")
            .setChannelTypes(ChannelType.GuildText);
        const channelSelectRow = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(ticketChannelSelect);
        const channelResponse = await interaction.editReply({
            content: "Select the Channel you want to set for Tickets System. Note - Make sure everyone has access to the mentioned channel!",
            components: [channelSelectRow]
        });
        try {
            const channel = await channelResponse.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id, time: 60_000 }) as ChannelSelectMenuInteraction;
            if (channel.customId === "ticketChannel") {
                ticketChannel = channel.values[0];
                await interaction.editReply({ content: "Success. Proceeding ...", components: [] });
            }
        } catch (err: any) {
            await interaction.editReply({ content: "Channel choice not recieved in 60 seconds. Please re-run the command!", components: [] });
            return;
        }

        // #2 - SELECT CATEGORY UNDER WHICH THE TICKETS WILL BE MADE
        const ticketCategorySelect = new ChannelSelectMenuBuilder()
            .setCustomId("ticketCategory")
            .setChannelTypes(ChannelType.GuildCategory)
            .setPlaceholder("Select the Category under which the tickets would be made by users");
        const categorySelectRow = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(ticketCategorySelect);
        const categoryResponse = await interaction.editReply({
            content: "Select the category under which you want the tickets to be made. Note - Make sure the category has necessary permissions for everyone!",
            components: [categorySelectRow]
        });
        try {
            const category = await categoryResponse.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id, time: 60_000 }) as ChannelSelectMenuInteraction;
            if (category.customId === "ticketCategory") {
                ticketCategory = category.values[0];
                await interaction.editReply({ content: "Success. Proceeding ...", components: [] });
            }
        } catch (err: any) {
            await interaction.editReply({
                content: "Category choice not recieved in 60 seconds. Please re-run the command!",
                components: []
            });
            return;
        }

        // #3 - SELECT ROLES TO BE INCLUDED IN TICKETS (MULTI SELECT)
        const roles = interaction.guild?.roles.cache.size as number
        const ticketRolesSelect = new RoleSelectMenuBuilder()
            .setCustomId("ticketRoles")
            .setPlaceholder("Select all roles (Multi Select)")
            .setMinValues(1)
            .setMaxValues(roles)
        const rolesSelectRow = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(ticketRolesSelect);
        const rolesResponse = await interaction.editReply({
            content: "Select all the roles you want to add to all user-made tickets (Multi select)",
            components: [rolesSelectRow]
        });
        try {
            const roles = await rolesResponse.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id, time: 60_000 }) as RoleSelectMenuInteraction;
            if (roles.customId === "ticketRoles") {
                ticketRoles = roles.values.toString();
                await interaction.editReply({ content: "Success. Proceeding ...", components: [] });
            }
        } catch (err: any) {
            await interaction.editReply({
                content: "Roles choice not recieved in 60 seconds. Please re-run the command!",
                components: []
            });
            return;
        }

        // #4 - SEND DATA TO DATABASE
        const guildTicketData: TicketData = {
            ticketChannel: ticketChannel!,
            ticketCategory: ticketCategory!,
            ticketRoles: ticketRoles!
        }
        dbRepository.updateGuildTicketsData(JSON.stringify(guildTicketData), interaction.guildId!);
        await interaction.editReply({ content: `Ticket Channel set to - <#${ticketChannel}> and Ticket Category set to - **${(interaction.client.channels.cache.get(ticketCategory!) as CategoryChannel).name}** successfully!`, components: [] });
        updateGuildMaps();
    } else if (subcommand === "set") {
        // #5 - MESSAGE TO BE SEND IN THE TICKETS CHANNEL
        const messageModal = new ModalBuilder()
            .setCustomId("messageModal")
            .setTitle("Enter the ticket channel details")
        const messageInput = new TextInputBuilder()
            .setCustomId("ticketMessage")
            .setLabel("Enter the message for the ticket")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(2000)
            .setPlaceholder("Message")
        const ticketButtonText = new TextInputBuilder()
            .setCustomId("ticketButtonText")
            .setLabel("Enter the Create Ticket Button text")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(25)
            .setPlaceholder("Create Ticket")
        const messageInputRow = new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput);
        const buttonTextRow = new ActionRowBuilder<TextInputBuilder>().addComponents(ticketButtonText);
        messageModal.addComponents(messageInputRow, buttonTextRow);
        await interaction.showModal(messageModal);
    }
}

export async function handleModal(interaction: ModalSubmitInteraction) {
    if (interaction.customId === "messageModal") {
        const ticketData: TicketData = JSON.parse(allGuildsMap.guildTicketsDataMap.get(interaction.guildId!)!);
        const ticketChannel = ticketData.ticketChannel;
        const message = interaction.fields.getTextInputValue("ticketMessage");
        const buttonText = interaction.fields.getTextInputValue("ticketButtonText");
        const ticketButton = new ButtonBuilder()
            .setCustomId("ticketButton")
            .setLabel(buttonText)
            .setStyle(ButtonStyle.Success);
        const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(ticketButton)
        await (interaction.client.channels.cache.get(ticketChannel) as TextChannel).send({
            content: message,
            components: [buttonRow]
        });
    }
}