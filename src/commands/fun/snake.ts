import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Snake } from "discord-gamecord";

export const data = new SlashCommandBuilder()
    .setName("snake")
    .setDescription("Start a Snake Game!")

export async function execute(interaction: ChatInputCommandInteraction) {
    const Game = new Snake({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: 'Snake Game',
          overTitle: 'Game Over',
          color: '#5865F2'
        },
        emojis: {
          board: '⬛',
          food: '🍎',
          up: '⬆️', 
          down: '⬇️',
          left: '⬅️',
          right: '➡️',
        },
        snake: { head: '🟢', body: '🟩', tail: '🟢', skull: '💀' },
        foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
        stopButton: 'Stop',
        timeoutTime: 60000,
        playerOnlyMessage: 'Only {player} can use these buttons.'
      });
      
      Game.startGame();
      Game.on('gameOver', result => {
        console.log(result);
      });
}