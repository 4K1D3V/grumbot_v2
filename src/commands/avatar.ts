import { CommandInteraction, SlashCommandBuilder, User } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("sends the user's avatar")
    .addUserOption(option => option.setName("user").setDescription("The user you want to get the avatar of").setRequired(false))

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const user: string | number | true | User = interaction.options.get('user')?.value || interaction.user;
    const avatar = (user as User).displayAvatarURL({ size: 4096 })
    await interaction.editReply({ content: avatar });
}