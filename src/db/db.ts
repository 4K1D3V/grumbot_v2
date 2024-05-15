import mysql2 from "mysql2";
import dbConfig from "./db.config";

const connectionConfig = {
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE,
    port: 12435
}

export var connection = mysql2.createConnection(connectionConfig);

function handleDisconnet() {
    connection = mysql2.createConnection(connectionConfig)
}

connection.on("error", (err) => {
    console.log("DB Connection Closed. Attenpting Reconnect!");
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        handleDisconnet();
    } else {
        console.log("DB Connection Error!");
    }
})

export default connection;