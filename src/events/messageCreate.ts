import { CommandInteraction, Events, Message, MessageInteraction } from "discord.js";
import dbRepository from "../repository/db.repository";
import Guild from "../model/guild.model";
import { config } from "../config";
import { deployCommands } from "../deploy-commands";

module.exports = {
    name: Events.MessageCreate,
    async execute(message: Message<boolean>) {
        if (message.author.bot) return;

        // Fetch Guild Prefix Command
        const prefix = await dbRepository.getGuildById(message.guildId as string)
            .then((result: Guild) => {
                return result[0].command_prefix;
            })

        // Reply to hello grumbot
        if (message.content.toLowerCase().startsWith("hello grumbot")) {
            message.reply("Beep Boop .... Beep Beep, I am Grumbot. I am created by <@1216042650096898189>. I am still in development.")
        }

        // Reply to !reload to deploy bot commands to discord
        if (message.content.toLowerCase() === `${prefix}reload`) {
            if (config.STAFF_USER_ID.includes(message.author.id)) {
                const numberOfCommands = await deployCommands()
                    .catch(error => {
                        console.error(error);
                        message.reply("There was an error while reloading the application (/) commands!");
                    });
                message.reply("Reloading application (/) commands...")
                    .then(msg => {
                        setTimeout(() => {
                            msg.edit(`Successfully reloaded ${numberOfCommands} application (/) commands.`);
                        }, 2000);
                    })
            } else message.reply("You do not have permission to do this!");
        }

        // Ping command
        if (message.content.toLowerCase() === `${prefix}ping`) {
            message.reply("Beep Boop .... Beep Beep, I am Grumbot. I am created by <@1216042650096898189>. I am still in development!");
        }

    }
}