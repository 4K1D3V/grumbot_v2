import { EmbedBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, GuildMemberRoleManager, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import allGuildsMap from "../../bot";

export const data = new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban someone from the server.")
    .addUserOption((target) => target.setName("target").setDescription("The user to ban.").setRequired(true))
    .addStringOption((reason) => reason.setName("reason").setDescription("The reason for the ban.").setRequired(false))
    .addBooleanOption((silent) => silent.setName("silent").setDescription("Whether to send the kick message in channel.").setRequired(false))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers);

export async function execute(interaction: CommandInteraction) {
    const logsChannelId = allGuildsMap.guildLogsChannelMap.get(interaction.guildId!);
    const isLogsChannelSet = logsChannelId !== undefined;
    const logsChannel = isLogsChannelSet ? interaction.client.channels.cache.get(logsChannelId) as TextChannel : undefined;
    const target = (interaction.options.get("target")?.member as GuildMember)
    const reason = (interaction.options.get("reason")?.value as string)
    const silent = (interaction.options.get("silent")?.value as boolean)
    var message: string | undefined;
    if (!target) message = "Please provide a valid user to ban."
    else if (target.id === interaction.client.user.id) message = "https://imgflip.com/i/8qvfkk";
    else if (target.id === interaction.user.id) message = "https://imgflip.com/gif/8qvfzq"
    else if (target.roles.highest.position >= (interaction.member?.roles as GuildMemberRoleManager).highest.position) message = "https://imgflip.com/i/8qvgbf"
    else if (!target.bannable) message = "This user is not banable."
    else if (reason !== undefined) if (reason.length! > 512) message = "Reason cannot be longer than 512 characters."
    else {
        try {
            const targetBanDMEmbed = new EmbedBuilder()
                .setTitle("You have been banned from the server.")
                .setDescription(`Reason: ${reason}`)
                .setFooter({ text: `Banned by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()
                .setThumbnail(interaction.user.displayAvatarURL());
            await target.send({ embeds: [targetBanDMEmbed] });
        } catch (error: any) {
            if (isLogsChannelSet) {
                await logsChannel?.send({ content: `Failed to send ban DM to ${target.user.tag}. User has their DM's disabled.\nError Info - ${error.message}`});
            }
            console.log(error);
        }
        try {
            await target.ban({ reason: reason });
            message = `Banned ${target.user.tag} for ${reason}`;
            if (isLogsChannelSet) {
                await logsChannel?.send({content: `${message}`})
            }
        } catch (error: any) {
            if (isLogsChannelSet) {
                await logsChannel?.send({content: `Failed to kick ${target.user.tag}.\nError Info = ${error.message}`})
            }
            message = `Failed to ban ${target.user.tag}. Please try again later`;
            console.log(error);
        }
    }
    if (silent) await interaction.reply({ content: message, ephemeral: true });
    else await interaction.reply({ content: message, ephemeral: false });
}

