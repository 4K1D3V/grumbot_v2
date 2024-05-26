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
                { name: "𝘽𝙤𝙡𝙙 𝙄𝙩𝙖𝙡𝙞𝙘", value: "bold-italic" },
                { name: "𝐁𝐨𝐥𝐝", value: "bold" },
                { name: "ℭ𝔩𝔞𝔰𝔰𝔦𝔠", value: "classic" },
                { name: "𝓒𝓾𝓻𝓼𝓲𝓿𝓮", value: "cursive" },
                { name: "𝔻𝕠𝕦𝕓𝕝𝕖 𝕊𝕥𝕣𝕦𝕔𝕜", value: "double-struck" },
                { name: "𝘐𝘵𝘢𝘭𝘪𝘤𝘴", value: "italic" },
                { name: "𝚖𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎", value: "monospace" },
                { name: "𝖲𝖺𝗇𝗌", value: "sans" },
                { name: "ꜱᴍᴀʟʟ ᴄᴀᴩɪᴛᴀʟ", value: "small-capital" },
                { name: "Ｗｉｄｅ", value: "wide" },
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