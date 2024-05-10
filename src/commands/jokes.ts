import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { config } from "../config"
const memeAPI = require('random-jokes-api')

export const data = new SlashCommandBuilder()
    .setName("jokes")
    .setDescription("Sends a random joke");

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    var joke: String = '';
    const randomNumber: number = Math.floor(Math.random() * 6);
    if (randomNumber === 0) joke = memeAPI.joke();
    else if (randomNumber === 1) joke = memeAPI.pun();
    else if (randomNumber === 2) joke = memeAPI.roast();
    else if (randomNumber === 3) joke = memeAPI.showerThought();
    else if (randomNumber === 4) joke = memeAPI.meme().url;
    else if (randomNumber === 5) {
        const options: AxiosRequestConfig = {
            method: 'GET',
            url: 'https://programming-memes-images.p.rapidapi.com/v1/memes',
            headers: {
                'X-RapidAPI-Key': config.X_RapidAPI_Key,
                'X-RapidAPI-Host': 'programming-memes-images.p.rapidapi.com'
            }
        };
        try {
            const response = await axios.request(options);
            joke = response.data[0].image;
        } catch (err) {
            console.log(err);
        }
    } else joke = "Something went wrong";
    await interaction.editReply(`${joke}`);
}
