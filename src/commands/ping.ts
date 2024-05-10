import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Checks if the bot is online!");

export async function execute(interaction: CommandInteraction) {
    return interaction.reply("Beep Boop.... Grumbot runs on Typescript!")
}