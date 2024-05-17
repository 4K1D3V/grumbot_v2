import { CommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import dbRepository from "../../repository/db.repository";
import CurrentGuild from "../../model/currentGuild.model";
import { updateGuildMaps } from "../../bot";
import allGuildsMap from "../../bot";

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
                { name: "~", value: "~" }
            )
            .setRequired(true)
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const commandPrefix = interaction.options.get("prefix")?.value;
    const guild = {
        guild_id: interaction.guildId!,
        guild_name: interaction.guild?.name,
        command_prefix: commandPrefix as string
    }
    dbRepository.updateGuildCommandPrefix(guild as CurrentGuild);
    await updateGuildMaps();
    await interaction.editReply(`Updated Guild Command Prefix to - ${commandPrefix}`);
}

