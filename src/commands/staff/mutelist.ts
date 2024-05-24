import { CommandInteraction, EmbedBuilder, GuildMember, PermissionsBitField, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("mutelist")
    .setDescription("Give a list of members currently muted")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const mutedUsers: Map<GuildMember, Date> = new Map();
    await interaction.guild?.members.fetch()
        .then(members => {
            members.forEach(user => {
                if (user.isCommunicationDisabled()) mutedUsers.set(user, user.communicationDisabledUntil);
            })
        });
    const muteEmbed = new EmbedBuilder()
        .setTitle("Muted Users")
        .setDescription("Muted users in the server -")
        .setFooter({ text: `${mutedUsers.size} muted users on ${interaction.guild?.name}` })
        .setTimestamp(new Date());
    if (mutedUsers.size === 0) {
        muteEmbed.addFields({ name: "No muted users", value: "There are no muted users on this server." });
    } else {
        mutedUsers.forEach(async (date, user) => {
            muteEmbed.addFields({ name: `${user.user.tag}`, value: `<@${user.user.id}>\nMuted till - ${date}`, inline: true });
        });
    }
    await interaction.editReply({ embeds: [muteEmbed] });
}

