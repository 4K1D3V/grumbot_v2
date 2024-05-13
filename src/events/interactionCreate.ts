import { CacheType, Interaction } from "discord.js";
import { commands } from "../commands";

export async function execute(interaction: Interaction<CacheType>) {
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;
    try {
        if (commands[commandName as keyof typeof commands]) commands[commandName as keyof typeof commands].execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "There was an error while executing this command!" });
    }
}