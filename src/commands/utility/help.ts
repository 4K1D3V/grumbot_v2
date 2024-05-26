import { ChatInputCommandInteraction, GuildMember, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Help command")
    .addStringOption(command => command.setName("command")
        .setDescription("The command you need help with")
        .setRequired(false)
    )

export const execute = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const member = interaction.member as GuildMember
    const command = interaction.options.getString("command");
    if (!command) {
        const helpEmbed = new EmbedBuilder()
            .setTitle("Grumbot's Commands List")
            .setDescription("Here is a list of all the commands you can use\n")
            .addFields(
                { name: ":bust_in_silhouette: **Utility Commands** - Can be used by everyone", value: `1. \`/help [command]\` - Shows this menu\n2. \`/info\` - View information about Grumbot\n3. \`/ping\` - Checks if Grumbot is online or not\n` },
                { name: ":video_game: **Fun Commands** - Can be used by everyone", value: `1. \`/avatar [user]\` - Sends the current avatar of you, or the mentioned user\n2. \`/banner [user]\` - Sends the profile banner of you, or the mentioned user.\n3. \`/font <text> <font>\` - Sends a text in the selected fancy font\n4. \`/joke\` - Sends a random joke.\n5. \`lyrics <song> <artist>\` - Sends lyrics of a song.\n6. \`minecraft <subcommands>\` - Minecraft related commands.\n7. \`/translate <text>\` - Sends the translation of a text into English (Powered by Google Translate)\n8. \`/truthdare <type>\` - Sends a Truth or Dare task/question based on type\n` },
                { name: "For more details about a command, and subcommands - ", value: "Use `/help [command_name]`" },
                { name: "Note - ", value: "<> means required argument, [] means optional" }
            )
            .setFooter({text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL()})
            .setThumbnail(interaction.client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor(0x7ec460)
        if (
            member.permissions.has(PermissionFlagsBits.BanMembers) || 
            member.permissions.has(PermissionFlagsBits.MuteMembers) || 
            member.permissions.has(PermissionFlagsBits.KickMembers)
        ) {
            helpEmbed.addFields(
                { name: ":shield: **Staff Commands** - Can be used only by Staff", value: `1. \`/ban <target> [reason] [silent]\` - Bans a user.\n2. \`/banlist \` - Shows the currently banned users.\n3. \`/kick <target> [reason] [silent]\` - Kicks a user.\n4. \`/mute <target> <duration> [reason] [silent]\` - Mutes a user.\n5. \`/mutelist\` - Shows the currently muted users with duration.\n6. \`/unban\` - Unbans a user.\n` },
            )
        }
        if (member.permissions.has(PermissionFlagsBits.Administrator)) {
            helpEmbed.addFields(
                { name: ":nerd: **Admin Commands** - Can be used only by Admins", value: `1. \`/logs <subcommands>\` - Server logging commands.\n2. \`prefix <cubcommands>\` - Chat commands settings\n` },
            )
        }
        await interaction.editReply({ embeds: [helpEmbed] })
    }

}

