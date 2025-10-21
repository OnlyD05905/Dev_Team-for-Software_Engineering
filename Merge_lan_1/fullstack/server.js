import express from 'express';
import mysql from "mysql2/promise";
import fs from "fs";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Cấu hình kết nối MySQL với Aiven
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

// Kiểm tra kết nối database khi khởi động
async function testDatabaseConnection() {
  try {
    const conn = await getConn();
    await conn.query('SELECT 1');
    conn.release();
    console.log('✅ Đã kết nối tới MySQL (Aiven) thành công!');
  } catch (err) {
    console.error('❌ Lỗi kết nối database:', err.message);
  }
}

// API test đơn giản
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// API thử đọc dữ liệu
app.get('/users', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM users');
    res.json(results);
  } catch (err) {
    console.error('❌ Lỗi truy vấn:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// API thêm user mới - register
app.post('/se_logreg', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Thiếu thông tin' });

  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Không thêm được user do trùng email' });
  }
});

// API thêm user mới - login/users
app.post('/users', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Thiếu thông tin' });

  try {
    const [results] = await pool.query(
      'SELECT * FROM users WHERE `email` = ? AND `password` = ?',
      [email, password]
    );
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }
    
    return res.json({ success: true, user: results[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Lỗi truy vấn database' });
  }
});

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
  testDatabaseConnection();
});