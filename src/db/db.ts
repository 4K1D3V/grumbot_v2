import mysql2 from "mysql2";
import dbConfig from "./db.config";

export default mysql2.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE
});