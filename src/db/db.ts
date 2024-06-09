import mysql2, { ConnectionOptions } from "mysql2";
import dbConfig from "./db.config";

const poolConfig: ConnectionOptions = {
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE,
    port: 12435,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}

export const connection = mysql2.createConnection(poolConfig);

function handleDisconnet() {
    connection.on('connection', (connection) => {
        console.log("New DB Connection Estabilished!");
        connection.on('error', (err: any) => {
            console.log(`DB Connection Error - ${err}`);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.log("Connection lost; attempting reconnect!");
                handleDisconnet();
            }
        })
    })
}

function keepAlive() {
    setInterval(() => {
        connection.query('SELECT 1', (err) => {
            if (err) console.log(`Keep alive query failed! - ${err}`)
            else console.log(`Keep alive query success!`)
        });
    }, 10_000);
}

handleDisconnet();
keepAlive();

export default connection;