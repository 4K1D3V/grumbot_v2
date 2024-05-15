import { CacheType, CommandInteraction, CommandInteractionOption, SlashCommandBuilder, User } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("banner")
    .setDescription("sends the user's banner")
    .addUserOption(option => option.setName("user").setDescription("The user you want to get the avatar of").setRequired(false))

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const user = interaction.options.get('user')?.value || interaction.user;
    if ((user as User).banner === null || undefined) {
        await interaction.editReply("This user has no banner!");
        return;
    }
    await interaction.editReply(`https://cdn.discordapp.com/banners/${(user as User).id}/${(user as User).banner}.png?size=2048`);
}