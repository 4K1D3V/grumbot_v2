import { ActionRowBuilder, ChatInputCommandInteraction, ComponentType, GuildMember, PermissionsBitField, SlashCommandBuilder, StringSelectMenuBuilder, TextChannel } from "discord.js";
import allGuildsMap from "../../bot";

export const data = new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban someone from the server.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)

export const execute = async (interaction: ChatInputCommandInteraction) => {
    const logsChannelId = allGuildsMap.guildLogsChannelMap.get(interaction.guildId!);
    const isLogsChannelSet = logsChannelId !== undefined;
    const logsChannel = isLogsChannelSet ? interaction.client.channels.cache.get(logsChannelId) as TextChannel : undefined;
    await interaction.deferReply();
    const banlist = await interaction.guild?.bans.fetch();
    if (banlist?.size === 0) {
        await interaction.editReply("There are no banned users in this server.");
        return;
    }
    const dropdown = new StringSelectMenuBuilder()
        .setCustomId("user")
        .setPlaceholder("Select a User to Unban");
    banlist?.forEach((bannedMember) => {
        dropdown.addOptions({
            label: bannedMember.user.tag,
            value: bannedMember.user.id
        });
    });
    try {
        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(dropdown);
        const response = await interaction.editReply({ components: [row] });
        const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 30_000, dispose: true });
        collector.on("collect", async dropdownResponse => {
            const selection = dropdownResponse.values[0];
            await dropdownResponse.update({ content: `Unbanning <@${selection}> from the server.`, components: [] });
            if (selection !== null || selection !== undefined) {
                await interaction.guild?.members.unban(selection);
                await interaction.editReply({ content: `Unbanned <@${selection}> from the server.` });
                if (isLogsChannelSet) logsChannel?.send({ content: `Unbanned <@${selection}> from the server.` });
            }
        })
    } catch (err: any) {
        console.log(err);
        if (isLogsChannelSet) {
            logsChannel?.send({ content: `An error occurred while unbanning the user. Error: ${err.message}` });
        }
        await interaction.editReply({ content: "An error occurred while unbanning the user." });
    }
}

