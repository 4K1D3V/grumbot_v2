import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Slots } from "discord-gamecord";

export const data = new SlashCommandBuilder()
    .setName("slots")
    .setDescription("Start a Slots Game!")

export async function execute(interaction: ChatInputCommandInteraction) {
    const Game = new Slots({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: 'Slot Machine',
          color: '#5865F2'
        },
        slots: ['🍇', '🍊', '🍋', '🍌'],
        playerOnlyMessage: 'Only {player} can use these buttons.'
      });
      
      Game.startGame();
      Game.on('gameOver', result => {
        console.log(result);  // =>  { result... }
      });
}