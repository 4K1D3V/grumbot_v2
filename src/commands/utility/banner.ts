import { CommandInteraction, SlashCommandBuilder, User } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("banner")
    .setDescription("sends the user's banner")
    .addUserOption(option => option.setName("user").setDescription("The user you want to get the avatar of").setRequired(false))
    .setDMPermission(false);

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    var banner;
    const user = interaction.options.get('user')?.user || interaction.user;
    await user.fetch().then(user => {
        banner = user.bannerURL({size: 4096});
    })
    if (banner === null || banner === undefined) {
        await interaction.editReply("This user has no banner!");
        return;
    } else {
        await interaction.editReply(`${banner}`);
    }
}