import mysql2, { ConnectionOptions } from "mysql2";
import dbConfig from "./db.config";

const connectionConfig: ConnectionOptions = {
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE,
    port: 12435,
    connectTimeout: 180
}

export var connection = mysql2.createConnection(connectionConfig);

function handleDisconnet() {
    connection = mysql2.createConnection(connectionConfig);
    connection.connect((err) => {
        if (err) setTimeout(handleDisconnet, 2000);
    });
    connection.on("error", (err) => {
        console.log("DB Connection Closed. Attempting Reconnect!");
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnet();
        }
    })
}

handleDisconnet();

export default connection;