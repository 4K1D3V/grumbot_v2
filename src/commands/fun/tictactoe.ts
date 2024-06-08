import { ChatInputCommandInteraction, SlashCommandBuilder, User } from "discord.js";
import { TicTacToe } from "discord-gamecord";

export const data = new SlashCommandBuilder()
    .setName("tictactoe")
    .setDescription("Play Tik Tak Toe with a friend!")
    .addUserOption(user => 
        user.setName("user")
            .setDescription("The use you want to play with")
            .setRequired(true)
    )
    .setDMPermission(false)

export async function execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user") as User;
    const Game = new TicTacToe({
        message: interaction,
        isSlashGame: true,
        opponent: user,
        embed: {
          title: 'Tic Tac Toe',
          color: '#5865F2',
          statusTitle: 'Status',
          overTitle: 'Game Over'
        },
        emojis: {
          xButton: '❌',
          oButton: '🔵',
          blankButton: '➖'
        },
        mentionUser: true,
        timeoutTime: 60000,
        xButtonStyle: 'DANGER',
        oButtonStyle: 'PRIMARY',
        turnMessage: '{emoji} | Its turn of player **{player}**.',
        winMessage: '{emoji} | **{player}** won the TicTacToe Game.',
        tieMessage: 'The Game tied! No one won the Game!',
        timeoutMessage: 'The Game went unfinished! No one won the Game!',
        playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
      });

      Game.startGame();
      Game.on("gameOver", result => {
        console.log(result);
      })
}