import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import dbRepository from "../repository/db.repository"
import Guild from "../model/guild.model";

export const data = new SlashCommandBuilder()
    .setName("changeprefix")
    .setDescription("Changes the command prefix for the guild")
    .addStringOption(option => 
        option
            .setName("prefix")
            .setDescription("The command prefix")
            .addChoices(
                { name: "!", value: "!" },
                { name: "?", value: "?" },
                { name: "-", value: "-" },
                { name: "~", value: "~"}
            )
            .setRequired(true)
    )

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const commandPrefix = interaction.options.get("prefix")?.value;
    const guild =  {
        guild_id: interaction.guildId!,
        guild_name: interaction.guild?.name,
        command_prefix: commandPrefix as string
    }
    dbRepository.updateGuild(guild as Guild);
    await interaction.editReply(`Updated Guild Command Prefix to - ${commandPrefix}`);
}