import { GenerativeModel, GoogleGenerativeAI, GoogleGenerativeAIResponseError } from "@google/generative-ai";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { config } from "../../config";

export const data = new SlashCommandBuilder()
    .setName("gemini")
    .setDescription("Ask Gemini Anything!")
    .addSubcommand(subcommand =>
        subcommand.setName("ask")
            .setDescription("Ask Gemini Anything!")
            .addStringOption(prompt =>
                prompt.setName("prompt")
                    .setDescription("Enter any prompt! (Maximum 128 characters)")
                    .setRequired(true)
                    .setMaxLength(128)
            )
    )
    .setDMPermission(false);

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const subcommand = interaction.options.getSubcommand();
    const prompt = interaction.options.getString("prompt")
    if (subcommand === "ask") {
        try {
            const genAI = new GoogleGenerativeAI(config.GEMINI_API!);
            const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const result = await model.generateContent(prompt!);
            const response = result.response
            const text = response.text()
            var splitText: string[] = []
            for (var i = 0, length = text.length; i < length; i += 1900) {
                splitText.push(text.substring(i, i + 1900));
            }
            await interaction.editReply(`${splitText[0]}`);
            for (var i = 1; i < splitText.length; i++) await interaction.channel?.send(`${splitText[i]}`);
        } catch (err: any) {
            interaction.editReply({ content: `Something went wrong in getting the response from AI! Error - ${err.message}` });
        }
    }
}