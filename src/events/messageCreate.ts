import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } from "discord.js";
import { deployCommands } from "../deploy-commands";
import allGuildsMap from "../bot";
import { config } from "../config";

export async function execute(message: Message<boolean>) {
    if (message.author.bot) return;

    // Fetch Guild Prefix Command
    const prefix = allGuildsMap.guildCommandPrefixMap.get(message.guildId as string);

    // Reply to hello grumbot
    if (message.content.toLowerCase().startsWith("hello grumbot")) {
        message.reply(`Beep Boop .... Beep Beep, I am Grumbot. I am created by <@1216042650096898189>. I am still in development.\nClient-Server Ping - ${message.client.ws.ping}ms`);
    }

    // Reply to !reload to deploy bot commands to discord
    if (message.content.toLowerCase() === `${prefix}sudo-reload`) {
        if (message.author.id === config.DEV_USER_ID) {
            const confirmButton = new ButtonBuilder().setCustomId("confirm-reload").setLabel("Confirm").setStyle(ButtonStyle.Secondary).setEmoji('✅');
            const denyButton = new ButtonBuilder().setCustomId("deny-reload").setLabel("Deny").setStyle(ButtonStyle.Primary).setEmoji('❌');
            const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(confirmButton, denyButton);
            await message.reply({ content: "Confirm Reload Action?", components: [buttonRow] })
                .then(async response => {
                    await response.awaitMessageComponent({ filter: (i: any) => i.user.id === message.author.id, time: 10_000 })
                        .then(async buttonResponse => {
                            if (buttonResponse.customId === 'confirm-reload') {
                                const numberOfCommands = await deployCommands()
                                    .catch(error => {
                                        console.error(error);
                                        message.reply("There was an error while reloading the application (/) commands!");
                                    });
                                buttonResponse.update({ content: "Reloading application (/) commands...", components: [] })
                                    .then(msg => {
                                        setTimeout(() => {
                                            msg.edit(`Successfully reloaded ${numberOfCommands} application (/) commands.`);
                                        }, 2000);
                                    })
                            } else if (buttonResponse.customId === 'deny-reload') {
                                buttonResponse.update({ content: "Application (/) commands reload cancelled.", components: [] });
                            }
                        }).catch(async () => {
                            await message.edit({ content: "Confirmation not received within 10 econds, cancelling", components: [] })
                        })
                });
        } else message.reply("You do not have permission to do this! Only my developer can run this command!");
    }

    // Ping command
    if (message.content.toLowerCase() === `${prefix}ping`) {
        message.reply("Beep Boop .... Beep Beep, I am Grumbot. I am created by <@1216042650096898189>. I am still in development!");
    }

}