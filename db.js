import mysql from "mysql2/promise";
import fs from "fs";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    ca: fs.readFileSync(process.env.DB_SSL_CA, "utf8"),
    minVersion: "TLSv1.2",
  },
});

export async function getConn() {
  const conn = await pool.getConnection();
  await conn.query("SET time_zone = ?;", [process.env.DB_TZ || "+07:00"]);
  return conn;
}
