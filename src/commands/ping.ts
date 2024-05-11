import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Checks if the bot is online!");

export async function execute(interaction: CommandInteraction) {
    return interaction.reply("Beep Boop .... Beep Beep, I am Grumbot. I am created by <@1216042650096898189>. I am still in development!")
}