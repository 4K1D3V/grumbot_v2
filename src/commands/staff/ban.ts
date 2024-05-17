import { EmbedBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, GuildMemberRoleManager, PermissionsBitField, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban someone from the server.")
    .addUserOption((target) => target.setName("target").setDescription("The user to ban.").setRequired(true))
    .addStringOption((reason) => reason.setName("reason").setDescription("The reason for the ban.").setRequired(false))
    .addBooleanOption((silent) => silent.setName("silent").setDescription("Whether to send a DM to the user.").setRequired(false))
    .addBooleanOption((deleteMessages) => deleteMessages.setName("delete").setDescription("Whether to delete the user's messages.").setRequired(false))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers);

export async function execute(interaction: CommandInteraction) {
    const target = (interaction.options.get("target")?.member as GuildMember)
    const reason = (interaction.options.get("reason")?.value as string)
    const silent = (interaction.options.get("silent")?.value as boolean)
    const deleteMessages = (interaction.options.get("delete")?.value as boolean)
    var message: string;
    if (!target) message = "Please provide a valid user to ban."
    if (target.id === interaction.user.id) message = "You cannot ban yourself."
    if (target.roles.highest.position >= (interaction.member?.roles as GuildMemberRoleManager).highest.position) message = "You cannot ban this user as they are higher than or equal to you in the role hierarchy."
    if (!target.kickable) message = "This user is not kickable."
    if (reason.length > 512) message = "Reason cannot be longer than 512 characters."
    try {
        const targetBanDMEmbed = new EmbedBuilder()
            .setTitle("You have been banned from the server.")
            .setDescription(`Reason: ${reason}`)
            .setFooter({ text: `Banned by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()
            .setThumbnail(interaction.user.displayAvatarURL());
        await target.send({ embeds: [targetBanDMEmbed] });
    } catch (error) {
        // TODO: Add logs if DM Fails
        console.log(error);
    }
    try {
        await target.ban({ reason: reason });
        message = `Banned ${target.user.tag} for ${reason}`;
    } catch (error) {
        // TODO: Add logs if Ban Fails
        message = `Failed to ban ${target.user.tag}. Please try again later`;
        console.log(error);
    }
    if (silent) await interaction.reply({ content: message, ephemeral: true });
    else await interaction.reply({ content: message, ephemeral: false });
}

