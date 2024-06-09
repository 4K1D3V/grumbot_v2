import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Flood } from "discord-gamecord";

export const data = new SlashCommandBuilder()
    .setName("flood")
    .setDescription("Start a Flood Game!")

export async function execute(interaction: ChatInputCommandInteraction) {
    const Game = new Flood({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: 'Flood',
          color: '#5865F2',
        },
        difficulty: 13,
        timeoutTime: 60000,
        buttonStyle: 'PRIMARY',
        emojis: ['🟥', '🟦', '🟧', '🟪', '🟩'],
        winMessage: 'You won! You took **{turns}** turns.',
        loseMessage: 'You lost! You took **{turns}** turns.',
        playerOnlyMessage: 'Only {player} can use these buttons.'
      });
      
      Game.startGame();
      Game.on('gameOver', result => {
        console.log(result);  // =>  { result... }
      });
}