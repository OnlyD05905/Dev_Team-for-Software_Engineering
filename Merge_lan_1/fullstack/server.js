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

// API đăng ký nhận hỗ trợ từ tutor
app.post('/tutor-requests', async (req, res) => {
  const { 
    studentName, 
    studentId, 
    email, 
    phone, 
    subject, 
    topic, 
    preferredTime, 
    message,
    userId,
    tutorId // Thêm tutorId
  } = req.body;

  // Validate required fields
  if (!studentName || !studentId || !email || !phone || !subject || !topic || !preferredTime || !tutorId) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO tutor_requests 
       (user_id, tutor_id, student_name, student_id, email, phone, subject, topic, preferred_time, message, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [userId, tutorId, studentName, studentId, email, phone, subject, topic, preferredTime, message || '']
    );
    
    res.json({ 
      success: true, 
      requestId: result.insertId,
      message: 'Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.'
    });
  } catch (err) {
    console.error('Lỗi khi tạo yêu cầu tutor:', err);
    res.status(500).json({ error: 'Không thể tạo yêu cầu. Vui lòng thử lại sau.' });
  }
});

// API lấy danh sách yêu cầu tutor của student
app.get('/tutor-requests/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const [requests] = await pool.query(
      `SELECT tr.*, t.name as tutor_name, t.email as tutor_email, t.specialization 
       FROM tutor_requests tr 
       LEFT JOIN tutor t ON tr.tutor_id = t.id 
       WHERE tr.user_id = ? 
       ORDER BY tr.created_at DESC`,
      [userId]
    );
    
    res.json({ success: true, requests });
  } catch (err) {
    console.error('Lỗi khi lấy danh sách yêu cầu:', err);
    res.status(500).json({ error: 'Không thể lấy danh sách yêu cầu' });
  }
});

// API lấy danh sách tutors
app.get('/tutors', async (req, res) => {
  try {
    const [tutors] = await pool.query(
      'SELECT id, name, email, phone, specialization, subjects, bio, rating, total_sessions FROM tutor ORDER BY rating DESC, name ASC'
    );
    
    res.json({ success: true, tutors });
  } catch (err) {
    console.error('Lỗi khi lấy danh sách tutors:', err);
    res.status(500).json({ error: 'Không thể lấy danh sách tutors' });
  }
});

// API lấy thông tin chi tiết 1 tutor
app.get('/tutors/:tutorId', async (req, res) => {
  const { tutorId } = req.params;
  
  try {
    const [tutors] = await pool.query(
      'SELECT id, name, email, phone, specialization, subjects, bio, rating, total_sessions FROM tutor WHERE id = ?',
      [tutorId]
    );
    
    if (tutors.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy tutor' });
    }
    
    res.json({ success: true, tutor: tutors[0] });
  } catch (err) {
    console.error('Lỗi khi lấy thông tin tutor:', err);
    res.status(500).json({ error: 'Không thể lấy thông tin tutor' });
  }
});

// API đăng ký cho tutor (giảng viên)
app.post('/tutor/register', async (req, res) => {
  const { name, email, password, phone, specialization, subjects, bio } = req.body;
  
  if (!name || !email || !password || !specialization) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin bắt buộc (Tên, Email, Mật khẩu, Chuyên môn)' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO tutor (name, email, password, phone, specialization, subjects, bio) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, password, phone || null, specialization, subjects || '', bio || '']
    );
    
    res.json({ 
      success: true, 
      tutorId: result.insertId,
      message: 'Đăng ký thành công! Bạn có thể đăng nhập ngay.' 
    });
  } catch (err) {
    console.error('Lỗi khi đăng ký tutor:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email đã được sử dụng. Vui lòng chọn email khác.' });
    }
    res.status(500).json({ error: 'Không thể đăng ký. Vui lòng thử lại sau.' });
  }
});

// API đăng nhập cho tutor (giảng viên)
app.post('/tutor/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu' });
  }

  try {
    const [tutors] = await pool.query(
      'SELECT id, name, email, phone, specialization, subjects, bio, rating, total_sessions FROM tutor WHERE email = ? AND password = ?',
      [email, password]
    );
    
    if (tutors.length === 0) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    const tutor = tutors[0];
    
    res.json({ 
      success: true, 
      tutor: tutor,
      message: 'Đăng nhập thành công!' 
    });
  } catch (err) {
    console.error('Lỗi khi đăng nhập tutor:', err);
    res.status(500).json({ error: 'Không thể đăng nhập. Vui lòng thử lại sau.' });
  }
});

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
  testDatabaseConnection();
});