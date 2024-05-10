import { REST, Routes } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

export async function deployCommands() {
    try {
        console.log("Started refreshing application (/) commands.");
        await rest.put(
            Routes.applicationCommands(config.DISCORD_CLIENT_ID),
            {
                body: commandsData,
            }
        );
        console.log(`Successfully reloaded ${commandsData.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}

export async function deleteCommands() {
    console.log("Started deleting application (/) commands.");
    try {
        await rest.put(
            Routes.applicationCommands(config.DISCORD_CLIENT_ID),
            {
                body: [],
            }
        );
        console.log(`Successfully deleted all application (/) commands`);
    } catch (error) {
        console.error(error);
    }
}