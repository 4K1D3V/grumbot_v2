import { CommandInteraction, SlashCommandBuilder, User } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("banner")
    .setDescription("sends the user's banner")
    .addUserOption(option => option.setName("user").setDescription("The user you want to get the avatar of").setRequired(false))

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const user: string | number | true | User = interaction.options.get('user')?.value || interaction.user;
    const banner = (user as User).bannerURL({ size: 4096 })
    await interaction.editReply({ content: banner });
}