import { CacheType, CommandInteraction, CommandInteractionOption, SlashCommandBuilder, User } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("banner")
    .setDescription("sends the user's banner")
    .addUserOption(option => option.setName("user").setDescription("The user you want to get the avatar of").setRequired(false))

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const user: any = interaction.options.get('user') || interaction.user;
    if (user.user.banner === null || undefined) {
        await interaction.editReply("This user has no banner!");
        return;
    }
    await interaction.editReply(`https://cdn.discordapp.com/banners/${user.user.id}/${user.user.banner}.png?size=2048`);
}