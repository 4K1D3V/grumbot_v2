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
  MYSQL_PORT
} = process.env;
const STAFF_USER_ID: String[] = ["1216042650096898189"];

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  STAFF_USER_ID,
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
  MYSQL_PORT
};