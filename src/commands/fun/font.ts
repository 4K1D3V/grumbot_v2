import { CommandInteraction, SlashCommandBuilder } from "discord.js";
const { Font } = require("convert-font");

export const data = new SlashCommandBuilder()
    .setName("font")
    .setDescription("Converts the text to selected font")
    .addStringOption(option =>
        option
            .setName("text")
            .setDescription("The text you want to convert")
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName("font")
            .setDescription("The font you want to convert the text to")
            .addChoices(
                { name: "bold-italic", value: "bold-italic" },
                { name: "bold", value: "bold" },
                { name: "classic", value: "classic" },
                { name: "cursive", value: "cursive" },
                { name: "double-struck", value: "double-struck" },
                { name: "italics", value: "italic" },
                { name: "monospace", value: "monospace" },
                { name: "sans", value: "sans" },
                { name: "small-capital", value: "small-capital" },
                { name: "wide", value: "wide" },
            )
            .setRequired(true)
    )

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const text = interaction.options.get('text')?.value as string;
    const font = interaction.options.get('font')?.value;
    const convertedText = Font.apply(text, font);
    await interaction.editReply(convertedText);
}