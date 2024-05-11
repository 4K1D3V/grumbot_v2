import { CommandInteraction, SlashCommandBuilder, User } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("sends the user's avatar")
    .addUserOption(option => option.setName("user").setDescription("The user you want to get the avatar of").setRequired(false))

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const user: any = interaction.options.get('user') || interaction.user;
    if (user.user.avatar === null) {
        await interaction.editReply("This user has no avatar!");
        return;
    }
    await interaction.editReply(`https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.png?size=2048`);
}