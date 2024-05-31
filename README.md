## Creating a Discord Bot 🤖

1. To create your own bot in Discord, begin by visiting the [Discord Developer Portal](https://discord.com/developers/applications). Click on the "New Application" button and give your bot a name before creating it. Once your bot is created, navigate to the Bot tab on its page and click on the "Reset Token" button to obtain your bot's Token. Remember to keep this token private and never share it publicly.

2. In the "Privileged Gateway Intents" section, ensure that "SERVER MEMBERS INTENT" and "MESSAGE CONTENT INTENT" are toggled on. Next, head to the OAuth2 tab and switch the "AUTHORIZATION METHOD" to "In-app Authorization." Toggle on "bot" and "applications.commands" under "SCOPES," and select "Administrator" under BOT PERMISSIONS before saving your changes.

3. To generate an OAuth2 URL, move to the OAuth2 URL Generator section. Toggle on "applications.commands" and "bot" under "SCOPES," and ensure that "Administrator" is selected under BOT PERMISSIONS. Scroll down to find the generated URL, open it in a new tab, and choose the server where you want to add your bot.

**That's all it takes to create your bot on Discord!**

## Installation 💻

**Requirements / Dependencies**

- **Nodejs v20.12.x**
- **Dependencies** ->
  - types/express: ^4.17.21
  - axios: ^1.6.8
  - discord.js: ^14.15.2
  - dotenv: ^16.4.5
  - express: ^4.19.2
  - random-jokes-api: ^1.5.9
  - servius: ^1.1.4
  - convert-font: ^1.0.4
  - mysql2: ^3.9.7
- **Dev Dependencies** ->
  - tsup: ^8.0.2
  - tsx: ^4.9.3
  - typescript: ^5.4.5

Simply run the command `npm install` or `npm i` to install all necessary dependencies.

## Configuration ⚙️

After successfully installing the bot's dependencies, create a file named `.env` in the root directory and enter the required details as follows - 

- DISCORD_TOKEN=
- DISCORD_CLIENT_ID=
- GUILD_ID=
- PORT=
- X_RapidAPI_Key=
- MUSIXMATCH_API_KEY=
- GUILD_ID=
- MYSQL_HOST=
- MYSQL_DATABASE
- MYSQL_PORT
- MYSQL_USER
- MYSQL_PASSWORD

For instance, your bot's Token should be assigned to the **DISCORD_TOKEN** variable using `environment variables` or by adding it to the `.env` file. Additionally, make sure to input the Owner user IDs, server name, and other relevant details accurately for the bot to function effectively. Review and input all necessary information before running the bot.

**Note -**
- To get a free MySQL for development purposes, head to [Aiven](https://aiven.io/) and create a free account and, Create a SQL Instance for free. 
- Get RapidAPI from [Rapid API Hub](https://rapidapi.com/hub) to use various API's. You will need to subscribe the API's manually via RapidAPI Hub.
- Get MusicxMatch API Key from [MusicxMatch](https://developer.musixmatch.com/) to get the songs details

## Running the Bot 🚀

You are now ready to run the bot. Simply enter the commands below:

`npm run dev`

To deploy commands to the server, REPLACE the owner user id in `src -> config.ts`. Add the bot in a server and run it with the above command. The, type `!reload` to start registering the Slash Commands to Discord.

## Creator

Created By [Sartak](https://github.com/SarthakA24)

**Note -** Deploy commands is only required to be ran once, each time there is any changes in the slash commands.

The bot is now up and running! Test it out by joining it to your server and using the commands.
