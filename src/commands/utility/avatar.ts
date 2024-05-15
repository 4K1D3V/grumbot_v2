import { CommandInteraction, SlashCommandBuilder, User } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("sends the user's avatar")
    .addUserOption(option => option.setName("user").setDescription("The user you want to get the avatar of").setRequired(false))

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const user = interaction.options.get('user')?.value || interaction.user;
    if ((user as User).avatar === null || undefined) {
        await interaction.editReply("This user has no avatar!");
        return;
    }
    await interaction.editReply(`https://cdn.discordapp.com/avatars/${(user as User).id}/${(user as User).avatar}.png?size=2048`);
}