import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const db = await mysql.createPool({
  uri: process.env.MYSQL_URL,
  timezone: "-03:00"
});