import axios, { AxiosRequestConfig } from "axios";
import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("truth-dare")
    .setDescription("Sends a truth or dare")
    .addStringOption(option =>
        option
            .setName("type")
            .setDescription("Enter the type of question")
            .setRequired(true)
            .addChoices(
                { name: 'Truth', value: 'truth' },
                { name: 'Dare', value: 'dare' },
                { name: 'Would You Rather', value: 'wyr' },
                { name: 'Never Have I Ever', value: 'nhie' },
                { name: 'Paranoia', value: 'paranoia' }
            )
    );

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply()
    const choice = interaction.options.get('type')?.value;
    const response = await getQuestion(choice);
    const typeOfQuestion = response.type === "wyr" ? "Would You Rather" : response.type === "nhie" ? "Never Have I Ever" : response.type;
    const questionEmbed = new EmbedBuilder()
        .setTitle("Truth or Dare")
        .setDescription("Here is your question!")
        .addFields(
            { name: "Question -", value: response.question, inline: false },
            { name: "Rating -", value: response.rating, inline: false },
            { name: "Type -", value: typeOfQuestion, inline: false },
        )
        .setTimestamp()
        .setFooter({ text: "Requested by " + interaction.user.username, iconURL: interaction.user.avatarURL()! })
    await interaction.editReply({ embeds: [questionEmbed] });
}

async function getQuestion(choice: string | number | boolean | undefined) {
    const randomNumber = Math.floor(Math.random() * 3) + 1;
    const rating = randomNumber === 1 ? "pg" : randomNumber === 2 ? "pg13" : "r";
    const options: AxiosRequestConfig = {
        method: 'GET',
        url: `https://api.truthordarebot.xyz/v1/${choice}`,
        headers: {
            'Content-Type': 'application/json',
        },
        params: {
            rating: rating
        }
    }
    const response = await axios.request(options);
    return response.data;

}