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
  MYSQL_DATABASE
} = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  PORT,
  X_RapidAPI_Key,
  MUSIXMATCH_API_KEY,
  GUILD_ID,
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE
};