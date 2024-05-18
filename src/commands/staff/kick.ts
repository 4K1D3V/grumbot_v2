import { CommandInteraction, EmbedBuilder, GuildMember, GuildMemberRoleManager, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import allGuildsMap from "../../bot";

export const data = new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the server")
    .addUserOption((user) => user.setName("user").setDescription("The user to kick").setRequired(true))
    .addStringOption((reason) => reason.setName("reason").setDescription("The reason to kick the user").setRequired(false))
    .addBooleanOption((silent) => silent.setName("silent").setDescription("Whether to send the kick message in channel").setRequired(false))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers);

export async function execute(interaction: CommandInteraction) {
    const logsChannelId = allGuildsMap.guildLogsChannelMap.get(interaction.guildId!);
    const isLogsChannelSet = logsChannelId !== undefined;
    const logsChannel = isLogsChannelSet ? interaction.client.channels.cache.get(logsChannelId) as TextChannel : undefined;
    const target = interaction.options.get("user")?.member as GuildMember;
    const reason = (interaction.options.get("reason")?.value as string) || "No reason provided!";
    const silent = interaction.options.get("silent")?.value || false;
    var message: string | undefined;
    if (!target) message = `Please provide a valid user to kick!`;
    else if (target.id === interaction.client.user.id) message = `I cannot kick myself DUHH!`;
    else if (target.id === interaction.user.id) message = `You cannot kick yourself!`;
    else if (target.roles.highest.position >= (interaction.member?.roles as GuildMemberRoleManager).highest.position) message = `You cannot kick this user as they are higher than or equal to you in the role hierarchy!`;
    else if (!target.kickable) message = `This user is not kickable!`;
    else if (reason !== undefined) if (reason.length! > 512) message = `Reason cannot be longer than 512 characters!`;
    else {
        try {
            const targetKickDMEmbed = new EmbedBuilder()
                .setTitle(`You have been kicked from the server - ${interaction.guild?.name}`)
                .setDescription(`Reason: ${reason}`)
                .setFooter({ text: `Kicked by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()
                .setThumbnail(target.avatarURL({ size: 64 }))
            await target.send({ embeds: [targetKickDMEmbed] });
        } catch (error: any) {
            if (isLogsChannelSet) {
                await logsChannel?.send({ content: `Failed to send kick DM to ${target.user.tag}. User has their DM's disabled.\nError Info - ${error.message}`});
            }
            console.log(error);
        }
        try {
            await target.kick(reason);
            message = `Kicked ${target.user.tag} for ${reason}`;
            if (isLogsChannelSet) {
                await logsChannel?.send({content: `${message}`})
            }
        } catch (error: any) {
            if (isLogsChannelSet) {
                await logsChannel?.send({content: `Failed to kick ${target.user.tag}.\nError Info = ${error.message}`})
            }
            message = `Failed to kick ${target.user.tag}. Please try again later`;
            console.log(error);
        }
    }
    if (silent) await interaction.reply({ content: message, ephemeral: true });
    else await interaction.reply({ content: message, ephemeral: false });
}

