import { CommandInteraction, SlashCommandBuilder, User } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("sends the user's avatar")
    .addUserOption(option => option.setName("user").setDescription("The user you want to get the avatar of").setRequired(false))
    .setDMPermission(false);

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const user = interaction.options.get('user')?.user || interaction.user;
    if (user.avatar === null || undefined) {
        await interaction.editReply("This user has no avatar!");
        return;
    } else {
        await interaction.editReply(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096`);
    }
}