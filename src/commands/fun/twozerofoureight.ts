import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { TwoZeroFourEight } from "discord-gamecord";

export const data = new SlashCommandBuilder()
    .setName("twozerofoureight")
    .setDescription("Start a 2048 Game!")

export async function execute(interaction: ChatInputCommandInteraction) {
    const Game = new TwoZeroFourEight({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: '2048',
          color: '#5865F2'
        },
        emojis: {
          up: '⬆️',
          down: '⬇️',
          left: '⬅️',
          right: '➡️',
        },
        timeoutTime: 60000,
        buttonStyle: 'PRIMARY',
        playerOnlyMessage: 'Only {player} can use these buttons.'
      });
      
      Game.startGame();
      Game.on('gameOver', result => {
        console.log(result);
      });
}