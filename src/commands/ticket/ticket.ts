import { ChannelSelectMenuBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuInteraction, ChannelType, ChatInputCommandInteraction, ModalBuilder, ModalSubmitInteraction, RoleSelectMenuBuilder, RoleSelectMenuInteraction, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

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
                console.log(ticketRoles);
                await interaction.editReply({ content: "Success. Proceeding ...", components: [] });
            }
        } catch (err: any) {
            await interaction.editReply({
                content: "Roles choice not recieved in 60 seconds. Please re-run the command!",
                components: []
            });
            return;
        }
        await interaction.editReply({ content: `Ticket Channel set to - ${ticketChannel} and Ticket Category set to - ${ticketCategory} successfully!`, components: [] });
    } else if (subcommand === "set") {
        // #4 - MESSAGE TO BE SEND IN THE TICKETS CHANNEL
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
        const ticketButtonEmoji = new TextInputBuilder()
            .setCustomId("ticketButtonEmoji")
            .setLabel("Enter the emoji for the button")
            .setRequired(true)
            .setPlaceholder(":envelope_with_arrow:")
            .setStyle(TextInputStyle.Short)
        const messageInputRow = new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput);
        const buttonTextRow = new ActionRowBuilder<TextInputBuilder>().addComponents(ticketButtonText);
        const emojiRow = new ActionRowBuilder<TextInputBuilder>().addComponents(ticketButtonEmoji);
        messageModal.addComponents(messageInputRow, buttonTextRow, emojiRow);
        await interaction.showModal(messageModal);

        interaction.client.on("modalSubmit", async (modalInteration: ModalSubmitInteraction) => {
            if (modalInteration.customId === "messageModal") {
                const message = modalInteration.fields.getTextInputValue("ticketMessage");
                const buttonText = modalInteration.fields.getTextInputValue("ticketButtonText");
                const emoji = modalInteration.fields.getTextInputValue("ticketButtonEmoji");
                const ticketButton = new ButtonBuilder()
                    .setCustomId("ticketButton")
                    .setLabel(buttonText)
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(emoji)
                const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(ticketButton)
                await interaction.editReply({ content: message, components: [buttonRow] })
            }
        })
    }
}