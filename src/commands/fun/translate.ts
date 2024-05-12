import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { config } from "../../config";

export const data = new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Send the translation to English for the input text")
    .addStringOption(option =>
        option
            .setName("text")
            .setDescription("Enter the text to be translated")
            .setRequired(true)
    );

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const options: AxiosRequestConfig = {
        method: 'POST',
        url: `https://google-translate124.p.rapidapi.com/google-translation/`,
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': config.X_RapidAPI_Key,
            'X-RapidAPI-Host': 'google-translate124.p.rapidapi.com'
        },
        data: {
            from_lang: 'auto',
            to_lang: 'english',
            text: `${interaction.options.get('text')?.value}`
        }
    };
    try {
        const response: AxiosResponse = await axios.request(options);
        await interaction.editReply(`Translation of '${interaction.options.get('text')?.value}' is - '${response.data.Response}'`);
    } catch (err) {
        console.log(err);
    }
}