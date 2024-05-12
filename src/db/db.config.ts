import { config } from "../config";

const dbConfig = {
    HOST: config.MYSQL_HOST,
    USER: config.MYSQL_USER,
    PASSWORD: config.MYSQL_PASSWORD,
    DATABASE: config.MYSQL_DATABASE,
    PORT: config.MYSQL_PORT
};

export default dbConfig;