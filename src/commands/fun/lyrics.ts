import axios, { AxiosRequestConfig } from "axios";
import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { config } from "../../config";

export const data = new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Sends the lyrics of the song")
    .addStringOption(option =>
        option
            .setName("song")
            .setDescription("Enter the song name")
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName("artist")
            .setDescription("The name of the artist")
            .setRequired(true)
    );

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const songName = interaction.options.get('song')?.value;
    const artistName = interaction.options.get('artist')?.value;
    const lyrics = await getLyrics(songName, artistName);
    const songDetails = await getSongDetails(songName, artistName);
    if (songDetails === undefined || songDetails === null) {
        interaction.editReply(`Grumbot could not find the song ${songName} by ${artistName} :(`);
    }
    else {
        const songEmbed = new EmbedBuilder()
            .setTitle("Requested Song Details")
            .setURL(songDetails.track_share_url)
            .setAuthor({ name: songDetails.artist_name })
            .setDescription(`Album Name - ${songDetails.album_name}`)
            .addFields(
                { name: "Song Name", value: songDetails.track_name, inline: false },
                { name: "Track URL", value: songDetails.track_share_url, inline: false },
                { name: "Artist Name", value: songDetails.artist_name, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: "Requested by " + interaction.user.username, iconURL: interaction.user.avatarURL()! })
        await interaction.editReply({ embeds: [songEmbed] });
        if (lyrics.includes("I couldn't find the lyrics")) {
            await interaction.followUp(lyrics);
        } else {
            await interaction.followUp("Getting Lyrics...")
                .then(async msg => {
                    setTimeout(async () => {
                        await msg.edit(`${lyrics}`)
                    }, 2000);
                })
        }
    }
}

async function getLyrics(songName: string | number | boolean | undefined, artistName: string | number | boolean | undefined) {
    const lyricsOptions: AxiosRequestConfig = {
        method: 'GET',
        url: `https://api.lyrics.ovh/v1/${artistName}/${songName}`,
        headers: {
            'content-type': 'application/json',
        }
    };
    try {
        const response = await axios.request(lyricsOptions);
        var lyrics = response.data.lyrics;
        var lines = lyrics.split('\n');
        lines.splice(0, 1);
        var newLyrics = lines.join('\n');
        return newLyrics;
    } catch (err) {
        console.log(err);
        return `I couldn't find the lyrics for ${songName} by ${artistName} :(`
    }
}

async function getSongDetails(songName: string | number | boolean | undefined, artistName: string | number | boolean | undefined) {
    const API_URL = `http://api.musixmatch.com/ws/1.1/track.search?q_track=${songName}&q_artist=${artistName}&page_size=1&page=1&apikey=${config.MUSIXMATCH_API_KEY}`;
    try {
        const response = await axios.get(API_URL);
        return response.data.message.body.track_list[0].track;
    } catch (err: any) {
        console.log(err);
        return `I couldn't find the song details for ${songName} by ${artistName} :( \nDebugging info: ${err.message}`
    }
}