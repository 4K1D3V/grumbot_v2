import { ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import dbRepository from "../../repository/db.repository";
import CurrentGuild from "../../model/currentGuild.model";
import allGuildsMap, { updateGuildMaps } from "../../bot";

export const data = new SlashCommandBuilder()
    .setName("prefix")
    .setDescription("Change the command prefix for the guild")
    .addSubcommand(subcommand =>
        subcommand
            .setName("set")
            .setDescription("Set the command prefix")
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
    ))
    .addSubcommand(subcommand =>
        subcommand
            .setName("view")
            .setDescription("View the current command prefix")
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "set") {
        const commandPrefix = interaction.options.getString("prefix");
        const guild = {
            guild_id: interaction.guildId!,
            guild_name: interaction.guild?.name,
            command_prefix: commandPrefix as string
        }
        dbRepository.updateGuildCommandPrefix(guild as CurrentGuild);
        await updateGuildMaps();
        await interaction.editReply(`Updated Guild Command Prefix to - ${commandPrefix}`);
    } else if (subcommand === "view") {
        const commandPrefix = allGuildsMap.guildCommandPrefixMap.get(interaction.guildId!)
        await interaction.editReply(`The command prefix for the guild is set as - \`${commandPrefix}\` \nTo change it, run the command \`/updateprefix\``);
    }
}

