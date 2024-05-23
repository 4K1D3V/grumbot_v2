import { EmbedBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, GuildMemberRoleManager, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import allGuildsMap from "../../bot";


export const data = new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a user.")
    .addUserOption((target) => target.setName("target").setDescription("The user to mute.").setRequired(true))
    .addNumberOption((duration) =>
        duration
            .setName("duration")
            .setDescription("The duration to mute the user for in minutes.")
            .setRequired(true)
            .addChoices(
                { name: "5 minutes", value: 5 },
                { name: "10 minutes", value: 10 },
                { name: "30 minutes", value: 30 },
                { name: "1 hour", value: 60 },
                { name: "6 Hours", value: 360 },
                { name: "12 Hours", value: 720 },
                { name: "1 day", value: 1440 },
                { name: "3 days", value: 4320 },
                { name: "1 week", value: 10080 },
                { name: "2 weeks", value: 20160 },
                { name: "1 month", value: 43200 }
            )
    )
    .addStringOption((reason) => reason.setName("reason").setDescription("The reason for the mute.").setRequired(false).setMaxLength(512))
    .addBooleanOption((silent) => silent.setName("silent").setDescription("Whether to send the mute message in channel.").setRequired(false))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)

export async function execute(interaction: CommandInteraction) {
    const logsChannelId = allGuildsMap.guildLogsChannelMap.get(interaction.guildId!);
    const isLogsChannelSet = logsChannelId !== undefined;
    const logsChannel = isLogsChannelSet ? interaction.client.channels.cache.get(logsChannelId) as TextChannel : undefined;
    const target = (interaction.options.get("target")?.member as GuildMember);
    const duration = (interaction.options.get("duration")?.value as number);
    const reason = (interaction.options.get("reason")?.value as string);
    const silent = (interaction.options.get("silent")?.value as boolean);
    var message: string | undefined;
    if (target.id === interaction.client.user.id) message = `I cannot mute myself DUHH!`;
    else if (target.id === interaction.user.id) message = "You cannot mute yourself."
    else if (target.roles.highest.position >= (interaction.member?.roles as GuildMemberRoleManager).highest.position) message = "You cannot mute this user as they are higher than or equal to you in the role hierarchy."
    else {
        try {
            const muteDMEmbed = new EmbedBuilder()
                .setTitle("You have been muted")
                .setDescription(`Reason: ${reason === undefined ? "No Reason Provided" : reason}\nDuration: ${duration} minutes or ${Math.round((duration / 60) * 100) / 100} hours\nStaff: ${interaction.user.tag}`)
                .setTimestamp(new Date(Date.now() + duration * 60000))
                .setFooter({ text: "Ends at" })
            await target.send({ embeds: [muteDMEmbed] })
        } catch (error: any) {
            if (isLogsChannelSet) {
                await logsChannel?.send({ content: `Failed to send mute DM to ${target.user.tag}. User has their DM's disabled.\nError Info - ${error.message}`});
            }
            console.log(error);
        }
        try {
            await target.timeout(duration * 60000, reason);
            message = `Successfully muted ${target.user.tag} for ${duration} minutes or ${Math.round((duration / 60) * 100) / 100} hours for reason - ${reason === undefined ? "No Reason Provided" : reason}`
            if (isLogsChannelSet) {
                await logsChannel?.send({content: `${message}`})
            }
        } catch (error: any) {
            if (isLogsChannelSet) {
                await logsChannel?.send({content: `Failed to mute ${target.user.tag}.\nError Info = ${error.message}`})
            }
            message = `Failed to mute ${target.user.tag}. Please try again later`;
            console.log(error);
        }
    }
    if (silent) await interaction.reply({ content: (message as string), ephemeral: true });
    else await interaction.reply({ content: (message as string), ephemeral: false });
}

