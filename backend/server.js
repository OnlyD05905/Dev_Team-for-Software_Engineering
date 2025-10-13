const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Cấu hình kết nối MySQL

const db = mysql.createConnection({
  host: 'localhost',
  user: 'khoa_admin1',
  password: '0963672757',
  database: 'se_logreg'
});

// Kiểm tra kết nối
db.connect((err) => {
  if (err) {
    console.error('❌ Lỗi kết nối MySQL:', err.message);
  } else {
    console.log('✅ Đã kết nối MySQL thành công!');
  }
});

// API test đơn giản
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// API thử đọc dữ liệu
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('❌ Lỗi truy vấn:', err);
      res.status(500).json({ error: 'Database query failed' });
    } else {
      res.json(results);
    }
  });
});

// API thêm user mới - register
app.post('/se_logreg', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Thiếu thông tin' });

  db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Không thêm được user do trùng email' });
      } else {
        res.json({ success: true, id: result.insertId });
      }
    }
  );
});

// API thêm user mới - login/users
app.post('/users', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Thiếu thông tin' });

  db.query(
    'SELECT * FROM users WHERE `email` = ? AND `password` = ?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Lỗi truy vấn database' });
      }
      if (results.length === 0) {
        // Không tìm thấy user
        return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
      }
      // Đăng nhập thành công, trả về thông tin user (không trả về password)
      return res.json({ success: true, user: results[0] });
    }
  );
});

// Chạy server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));