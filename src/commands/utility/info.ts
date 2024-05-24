import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
const servius = require('servius');

export const data = new SlashCommandBuilder()
    .setName("info")
    .setDescription("Sends the status of Grumbot and the hosting server");

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const botImage = "https://cdn.discordapp.com/avatars/1225394097280253982/d5326ca03c8b52f441173368b7e4e0ed?size=1024"
    const uptime = servius.uptime();
    const os = servius.getOS();
    const memory = servius.VirtualMemory(false);
    const disk = servius.VirtualDisk(false);
    const cpu = servius.cpuTimes();
    const cpuCount = servius.cpuCount();
    const cpuInfo = servius.cpu();
    let botUptime = (interaction.client.uptime / 1000);
    let days = Math.floor(botUptime / 86400);
    botUptime %= 86400;
    let hours = Math.floor(botUptime / 3600);
    botUptime %= 3600;
    let minutes = Math.floor(botUptime / 60);
    let seconds = Math.floor(botUptime % 60);
    const statusEmbed = new EmbedBuilder()
        .setTitle("My Current Server Status")
        .setAuthor({ name: 'Grumbot', iconURL: botImage })
        .setDescription('My details under the hood!')
        .addFields(
            { name: "Server Uptime -", value: uptime, inline: false },
            { name: "My Uptime -", value: `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`, inline: false },
            { name: "Operating System I am running on -", value: os.name, inline: false },
            { name: "My CPU Info I am running on -", value: cpuInfo.name },
            { name: "CPU Status -", value: `System - ${cpu.system}% / Idle - ${cpu.idle}%`, inline: false },
            { name: "Number of CPU's handling me -", value: cpuCount, inline: false },
            { name: "Total Memory I have -", value: `Free - ${memory.free} of ${memory.total}`, inline: false },
            { name: "Total Disk Space I have -", value: `Free - ${disk.available} of ${disk.total}`, inline: false },
            { name: "My Ping -", value: `${interaction.client.ws.ping} ms`, inline: false },
            { name: "I am coded on -", value: "NodeJS v20.12.x, DiscordJS v14.15.2 and Typescript v5.4.5", inline: false },
            { name: "I am hosted on -", value: "Amazon AWS EC2", inline: false }
        )
        .setTimestamp()
        .setFooter({ text: "Requested by " + interaction.user.username, iconURL: interaction.user.avatarURL()! })
    await interaction.editReply({ embeds: [statusEmbed] });
}