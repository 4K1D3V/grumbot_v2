import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
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
    const command = interaction.options.getString("command");
    if (!command) {
        const helpEmbed = new EmbedBuilder()
            .setTitle("Grumbot's Commands List")
            .setDescription("Here is a list of all the commands you can use\n")
            .addFields(
                { name: ":bust_in_silhouette: **Utility Commands** - Can be used by everyone", value: `1. \`/help [command]\` - Shows this menu\n2. \`/info\` - View information about Grumbot\n3. \`/ping\` - Checks if Grumbot is online or not\n` },
                { name: ":video_game: **Fun Commands** - Can be used by everyone", value: `1. \`/avatar [user]\` - Sends the current avatar of you, or the mentioned user\n2. \`/banner [user]\` - Sends the profile banner of you, or the mentioned user. \`/font <text> <font>\` - Sends a text in the selected fancy font\n` },
                { name: ":shield: **Staff Commands** - Can be used only by Staff", value: `\u200b\n` },
                { name: ":nerd: **Admin Commands** - Can be used only by Admins", value: `\u200b\n` },
                { name: "Note - ", value: "<> means required argument, [] means optional" }
            )
            .setFooter({text: `Requested By - ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL()})
            .setThumbnail(interaction.client.user?.displayAvatarURL())
            .setTimestamp(new Date())
            .setColor(0x7ec460)
        await interaction.editReply({ embeds: [helpEmbed] })
    }

}

