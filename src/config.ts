import dotenv from "dotenv";

dotenv.config();

const { 
  DISCORD_TOKEN, 
  DISCORD_CLIENT_ID, 
  PORT, 
  X_RapidAPI_Key, 
  MUSIXMATCH_API_KEY, 
  GUILD_ID,
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_PORT,
  GEMINI_API
} = process.env;

const DEV_USER_ID: String = "1216042650096898189"
const BOT_IMAGE = "https://cdn.discordapp.com/avatars/1225394097280253982/d5326ca03c8b52f441173368b7e4e0ed?size=1024"

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  DEV_USER_ID,
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  PORT,
  X_RapidAPI_Key,
  MUSIXMATCH_API_KEY,
  GUILD_ID,
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_PORT,
  BOT_IMAGE,
  GEMINI_API
};