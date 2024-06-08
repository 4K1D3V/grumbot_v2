import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Minesweeper } from "discord-gamecord";

export const data = new SlashCommandBuilder()
    .setName("minesweeper")
    .setDescription("Play a Minesweeper Game")

export async function execute(interaction: ChatInputCommandInteraction) {
    const Game = new Minesweeper({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: 'Minesweeper',
          color: '#5865F2',
          description: 'Click on the buttons to reveal the blocks except mines.'
        },
        emojis: { flag: '🚩', mine: '💣' },
        mines: 5,
        timeoutTime: 60000,
        winMessage: 'You won the Game! You successfully avoided all the mines.',
        loseMessage: 'You lost the Game! Beaware of the mines next time.',
        playerOnlyMessage: 'Only {player} can use these buttons.'
      });
      
      Game.startGame();
      Game.on("gameOver", result => {
        console.log(result);
      });
}