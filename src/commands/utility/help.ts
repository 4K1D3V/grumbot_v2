import { ChatInputCommandInteraction, GuildMember, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Help command")
    .addStringOption(command => command.setName("command")
        .setDescription("The command you need help with")
        .addChoices(
            { name: "/info", value: "info" },
            { name: "/ping", value: "ping" },
            { name: "/avatar", value: "avatar" },
            { name: "/banner", value: "banner" },
            { name: "/font", value: "font" },
            { name: "/jokes", value: "jokes" },
            { name: "/lyrics", value: "lyrics" },
            { name: "/minecraft", value: "minecraft" },
            { name: "/translate", value: "translate" },
            { name: "/truthdare", value: "truthdare" },
            { name: "/ban (Staff Only)", value: "ban" },
            { name: "/banlist (Staff Only)", value: "banlist" },
            { name: "/kick (Staff Only)", value: "kick" },
            { name: "/mute (Staff Only)", value: "mute" },
            { name: "/mutelist (Staff Only)", value: "mutelist" },
            { name: "/unban (Staff Only)", value: "unban" },
            { name: "/logs (Admin Only)", value: "logs" },
            { name: "/prefix (Admin Only)", value: "prefix" },
        )
        .setRequired(false)
    )

export const execute = async (interaction: ChatInputCommandInteraction) => {
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
            .setFooter({ text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
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
        await interaction.reply({ embeds: [helpEmbed] })
    } else if (command === "info") {
        const infoEmbed = new EmbedBuilder()
            .setTitle("/info")
            .setDescription("This comand shows information and under the hood details of Grumbot")
            .addFields(
                { name: "Command Usage - ", value: "`/info`" },
                { name: "Category - ", value: "Utility" },
                { name: "Note - ", value: "<> means required argument, [] means optional" }
            )
            .setFooter({ text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor(0x7ec460)
        await interaction.reply({ embeds: [infoEmbed] })
    } else if (command === "ping") {
        const pingEmbed = new EmbedBuilder()
            .setTitle("/ping")
            .setDescription("This command shows the current ping of Grumbot")
            .addFields(
                { name: "Command Usage - ", value: "`/ping`" },
                { name: "Category - ", value: "Utility" },
                { name: "Note - ", value: "<> means required argument, [] means optional" }
            )
            .setFooter({ text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor(0x7ec460)
        await interaction.reply({ embeds: [pingEmbed] })
    } else if (command === "avatar") {
        const avatarEmbed = new EmbedBuilder()
            .setTitle("/avatar")
            .setDescription("This command shows the current avatar of you, or the mentioned user")
            .addFields(
                { name: "Command Usage - ", value: "`/avatar [user]`" },
                { name: "Arguments - ", value: "`[user]` - The user you want to see the avatar of" },
                { name: "Category - ", value: "Fun" },
                { name: "Note - ", value: "<> means required argument, [] means optional" }
            )
            .setFooter({ text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor(0x7ec460)
        await interaction.reply({ embeds: [avatarEmbed] })
    } else if (command === "banner") {
        const bannerEmbed = new EmbedBuilder()
            .setTitle("/banner")
            .setDescription("This command shows the current banner of you, or the mentioned user")
            .addFields(
                { name: "Command Usage - ", value: "`/banner [user]`" },
                { name: "Arguments - ", value: "`[user]` - The user you want to see the banner of" },
                { name: "Category - ", value: "Fun" },
                { name: "Note - ", value: "<> means required argument, [] means optional" }
            )
            .setFooter({ text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor(0x7ec460)
        await interaction.reply({ embeds: [bannerEmbed] })
    } else if (command === "font") {
        const fontEmbed = new EmbedBuilder()
            .setTitle("/font")
            .setDescription("This command sends the text in the selected fancy font")
            .addFields(
                { name: "Command Usage - ", value: "`/font <text> <font>`" },
                { name: "Arguments - ", value: "`<text>` - The text you want to send in the fancy font\n`<font>` - The font you want to use" },
                { name: "Category - ", value: "Fun" },
                { name: "Note - ", value: "<> means required argument, [] means optional" }
            )
            .setFooter({ text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor(0x7ec460)
        await interaction.reply({ embeds: [fontEmbed] })
    } else if (command === "jokes") {
        const jokesEmbed = new EmbedBuilder()
            .setTitle("/jokes")
            .setDescription("This command sends a random joke")
            .addFields(
                { name: "Command Usage - ", value: "`/jokes`" },
                { name: "Category - ", value: "Fun" },
                { name: "Note - ", value: "<> means required argument, [] means optional" }
            )
            .setFooter({ text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor(0x7ec460)
        await interaction.reply({ embeds: [jokesEmbed] })
    } else if (command === "lyrics") {
        const lyricsEmbed = new EmbedBuilder()
            .setTitle("/lyrics")
            .setDescription("This command sends the lyrics of the mentioned song")
            .addFields(
                { name: "Command Usage - ", value: "`/lyrics <song> <artist>`" },
                { name: "Arguments - ", value: "`<song>` - The name of the song\n`<artist>` - The name of the artist" },
                { name: "Category - ", value: "Fun" },
                { name: "Note - ", value: "<> means required argument, [] means optional" }
            )
            .setFooter({ text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor(0x7ec460)
        await interaction.reply({ embeds: [lyricsEmbed] })
    } else if (command === "minecraft") {
        const minecraftEmbed = new EmbedBuilder()
            .setTitle("/minecraft")
            .setDescription("This command sends the lyrics of the mentioned song")
            .addFields(
                { name: "Command Usage - ", value: "`/minecraft <avatar/ping/profile>`" },
                { name: "Subcommand Usage - ", value: "`1. /minecraft avatar <username> <type>` - Sends the current minecraft avatar of the mentioned username. Type can be either \"Head\" or \"Body\"\n2. /minecraft ping <ip> - Sends the details of the mentioned minecraft server ip address\n3. /minecraft profile <username> - Sends the minecraft profile profile details of the mentioned username\n" },
                { name: "Category - ", value: "Fun" },
                { name: "Note - ", value: "<> means required argument, [] means optional" }
            )
            .setFooter({ text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor(0x7ec460)
        await interaction.reply({ embeds: [minecraftEmbed] })
    } else if (command === "translate") {
        const translateEmbed = new EmbedBuilder()
            .setTitle("/translate")
            .setDescription("This command sends the translation of the mentioned text into English")
            .addFields(
                { name: "Command Usage - ", value: "`/translate <text>`" },
                { name: "Arguments - ", value: "`<text>` - The text you want to translate" },
                { name: "Category - ", value: "Fun" },
                { name: "Note - ", value: "<> means required argument, [] means optional" }
            )
            .setFooter({ text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor(0x7ec460)
        await interaction.reply({ embeds: [translateEmbed] })
    } else if (command === "truthdare") {
        const truthdareEmbed = new EmbedBuilder()
            .setTitle("/truthdare")
            .setDescription("This command sends a truth or dare task/question based on the type")
            .addFields(
                { name: "Command Usage - ", value: "`/truthdare <type>`" },
                { name: "Arguments - ", value: "`<type>` - The type of the truth or dare or any other task/question" },
                { name: "Category - ", value: "Fun" },
                { name: "Note - ", value: "<> means required argument, [] means optional" }
            )
            .setFooter({ text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor(0x7ec460)
        await interaction.reply({ embeds: [truthdareEmbed] })
    } else if (command === "ban") {
        const banEmbed = new EmbedBuilder()
            .setFooter({ text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor(0x7ec460)
        if (member.permissions.has(PermissionFlagsBits.BanMembers)) {
            banEmbed
                .setTitle("/ban")
                .setDescription("This command bans a user")
                .addFields(
                    { name: "Command Usage - ", value: "`/ban <target> [reason] [silent]`" },
                    { name: "Arguments - ", value: "`<target>` - The user you want to ban\n`<reason>` - The reason why you are banning the user\n`<silent>` - Whether you want to ban the user silently or not" },
                    { name: "Category - ", value: "Staff" },
                    { name: "Note - ", value: "<> means required argument, [] means optional" }
                );
            await interaction.reply({ embeds: [banEmbed] })
        } else {
            banEmbed
                .setTitle("No Access!")
                .setDescription("It seems that you don't have permission to run this command. Only server staff can use this command.")
                .addFields(
                    { name: "No Permission", value: "It seems that you don't have permission to run this command. Only server staff can use this command." }
                )
            await interaction.reply({ embeds: [banEmbed], ephemeral: true })
        }
    } else if (command === "banlist") {
        const banlistEmbed = new EmbedBuilder()
            .setFooter({ text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor(0x7ec460)
        if (member.permissions.has(PermissionFlagsBits.BanMembers)) {
            banlistEmbed.setTitle("/banlist")
                .setDescription("This command shows the currently banned users")
                .addFields(
                    { name: "Command Usage - ", value: "`/banlist`" },
                    { name: "Category - ", value: "Staff" },
                    { name: "Note - ", value: "<> means required argument, [] means optional" }
                )
            await interaction.reply({ embeds: [banlistEmbed] })
        } else {
            banlistEmbed
                .setTitle("No Access!")
                .setDescription("It seems that you don't have permission to run this command. Only server staff can use this command.")
                .addFields(
                    { name: "No Permission", value: "It seems that you don't have permission to run this command. Only server staff can use this command." }
                )
            await interaction.reply({ embeds: [banlistEmbed], ephemeral: true })
        }
    } else if (command === "kick") {
        const kickEmbed = new EmbedBuilder()
            .setFooter({ text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor(0x7ec460);
        if (member.permissions.has(PermissionFlagsBits.KickMembers)) {
            kickEmbed.setTitle("/kick")
                .setDescription("This command kicks a user")
                .addFields(
                    { name: "Command Usage - ", value: "`/kick <target> [reason] [silent]`" },
                    { name: "Arguments - ", value: "`<target>` - The user you want to kick\n`<reason>` - The reason why you are kicking the user\n`<silent>` - Whether you want to kick the user silently or not" },
                    { name: "Category - ", value: "Staff" },
                    { name: "Note - ", value: "<> means required argument, [] means optional" }
                )
            await interaction.reply({ embeds: [kickEmbed] })
        } else {
            kickEmbed
                .setTitle("No Access!")
                .setDescription("It seems that you don't have permission to run this command. Only server staff can use this command.")
                .addFields(
                    { name: "No Permission", value: "It seems that you don't have permission to run this command. Only server staff can use this command." }
                )
            await interaction.reply({ embeds: [kickEmbed], ephemeral: true })
        }
    } else if (command === "mute") {
        const muteEmbed = new EmbedBuilder()
            .setFooter({ text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor(0x7ec460);
        if (member.permissions.has(PermissionFlagsBits.MuteMembers)) {
            muteEmbed.setTitle("/mute")
                .setDescription("This command mutes a user")
                .addFields(
                    { name: "Command Usage - ", value: "`/mute <target> <duration> [reason] [silent]`" },
                    { name: "Arguments - ", value: "`<target>` - The user you want to mute\n`<duration>` - The duration of the mute\n`<reason>` - The reason why you are muting the user\n`<silent>` - Whether you want to mute the user silently or not" },
                    { name: "Category - ", value: "Staff" },
                    { name: "Note - ", value: "<> means required argument, [] means optional" }
                )
            await interaction.reply({ embeds: [muteEmbed] })
        } else {
            muteEmbed
                .setTitle("No Access!")
                .setDescription("It seems that you don't have permission to run this command. Only server staff can use this command.")
                .addFields(
                    { name: "No Permission", value: "It seems that you don't have permission to run this command. Only server staff can use this command." }
                )
            await interaction.reply({ embeds: [muteEmbed], ephemeral: true })
        }
    } else if (command === "unban") {
        const unbanEmbed = new EmbedBuilder()
            .setFooter({ text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor(0x7ec460);
        if (member.permissions.has(PermissionFlagsBits.BanMembers)) {
            unbanEmbed.setTitle("/unban")
                .setDescription("This command unbans a user")
                .addFields(
                    { name: "Command Usage - ", value: "`/unban <target>`" },
                    { name: "Arguments - ", value: "`<target>` - The user you want to unban" },
                    { name: "Category - ", value: "Staff" },
                    { name: "Note - ", value: "<> means required argument, [] means optional" }
                )
            await interaction.reply({ embeds: [unbanEmbed] })
        } else {
            unbanEmbed
                .setTitle("No Access!")
                .setDescription("It seems that you don't have permission to run this command. Only server staff can use this command.")
                .addFields(
                    { name: "No Permission", value: "It seems that you don't have permission to run this command. Only server staff can use this command." }
                )
            await interaction.reply({ embeds: [unbanEmbed], ephemeral: true })
        }
    } else if (command === "logs") {
        const logsEmbed = new EmbedBuilder()
            .setFooter({ text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor(0x7ec460);
        if (member.permissions.has(PermissionFlagsBits.Administrator)) {
            logsEmbed.setTitle("/logs")
                .setDescription("This command sends the logs of the mentioned channel")
                .addFields(
                    { name: "Command Usage - ", value: "`/logs <subcommands>`" },
                    { name: "Subcommand Usage - ", value: "1. `/logs channel set <channel>` - Sets the logs channel to the mentioned channel.\n2. `/logs channel view` - View the current set logs channel.\n3. `/logs enable` - Enabled server logs.\n4. `/logs disable` - Disables the logs." },
                    { name: "Category - ", value: "Staff" },
                    { name: "Note - ", value: "<> means required argument, [] means optional" }
                )
            await interaction.reply({ embeds: [logsEmbed] })
        } else {
            logsEmbed
                .setTitle("No Access!")
                .setDescription("It seems that you don't have permission to run this command. Only server admins can use this command.")
                .addFields(
                    { name: "No Permission", value: "It seems that you don't have permission to run this command. Only server admins can use this command." }
                )
            await interaction.reply({ embeds: [logsEmbed], ephemeral: true })
        }
    } else if (command === "prefix") {
        const prefixEmbed = new EmbedBuilder()
            .setFooter({ text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor(0x7ec460);
        if (member.permissions.has(PermissionFlagsBits.Administrator)) {
            prefixEmbed.setTitle("/prefix")
                .setDescription("This command sets the prefix of the server")
                .addFields(
                    { name: "Command Usage - ", value: "`/prefix <subcommands>`" },
                    { name: "Subcommand Usage - ", value: "1. `/prefix set <prefix>` - Sets the prefix of the server's message commands.\n2. `/prefix view` - View the current set prefix." },
                    { name: "Category - ", value: "Admin" },
                    { name: "Note - ", value: "<> means required argument, [] means optional" }
                )
        }
    }
}
