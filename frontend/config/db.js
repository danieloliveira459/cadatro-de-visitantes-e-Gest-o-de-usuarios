import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

console.log("MYSQL_URL:", process.env.MYSQL_URL);

export const db = await mysql.createConnection(process.env.MYSQL_URL);

console.log("MySQL conectado!");

//testando//