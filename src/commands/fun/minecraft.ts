import axios, { AxiosRequestConfig } from "axios";
import { AttachmentBuilder, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("minecraft")
    .setDescription("Minecraft related command")
    .addSubcommand(subcommand => 
        subcommand.setName("ping")
        .setDescription("Check the status of the minecraft server")
        .addStringOption((ip) => ip.setName("ip").setDescription("The ip of the minecraft server").setRequired(true))
    )
    .addSubcommand(subcommand => subcommand.setName("avatar")
        .setDescription("Show an isometric avatar of a minecraft player's skin")
        .addStringOption((username) => username.setName("username")
            .setDescription("The username of the minecraft profile").setRequired(true)
        )
        .addStringOption(type => type.setName("type").setDescription("The type of the skin").setRequired(true).setChoices(
            { name: "Head", value: "head" },
            { name: "Body", value: "body" },
        ))
    )

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "ping") {
        const serverIP = interaction.options.getString("ip");
        const serverOptions: AxiosRequestConfig = {
            url: `https://api.mcsrvstat.us/3/${serverIP}`,
            method: "GET"
        }
        const serverResponse = await axios.request(serverOptions);
        if (serverResponse.data) {
            const { ip, port, motd, players, version, hostname, software } = serverResponse.data;
            const serverEmbed = new EmbedBuilder()
                .setTitle("Minecraft Server Status")
                .setDescription(`${serverIP}`)
                .setThumbnail(`https://api.mcsrvstat.us/icon/${serverIP}`)
                .setColor(0x77dd77)
                .addFields(
                    { name: "IP", value: `${ip}`, inline: false },
                    { name: "Domain", value: `${serverIP}`, inline: false },
                    { name: "Port", value: `${port}`, inline: false },
                    { name: "MOTD", value: `\`\`\`\n${motd.clean[0]}\n${motd.clean[1]}\n\`\`\``, inline: false },
                    { name: "Players", value: `${players.online}/${players.max}`, inline: false },
                    { name: "Version", value: `${software} - ${version}`, inline: false },
                    { name: "Hostname", value: `${hostname}`, inline: false },
                )
                .setTimestamp(new Date())
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
            interaction.editReply({ embeds: [serverEmbed] });
        } else {
            interaction.editReply(`An error occurred`);
        }
    } else if (subcommand === "skin") {
        const username = interaction.options.getString("username");
        const type = interaction.options.getString("type");
        const avatarEmbed = new EmbedBuilder()
            .setTitle("Minecraft Avatar")
            .setDescription(`Avatar of ${username}`)
            .setImage(`https://mc-heads.net/${type}/${username}`)
            .setColor(0x77dd77)
            .setTimestamp(new Date())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.editReply({ embeds: [avatarEmbed] });
    } 
}

