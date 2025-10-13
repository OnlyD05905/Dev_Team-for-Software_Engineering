// server.js
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json()); // để đọc JSON body

// -------------------------
// Khởi tạo kết nối MySQL
// -------------------------
let db;

const initDB = async () => {
  try {
    db = await mysql.createConnection({
      host: "localhost",
      user: "react_user",
      password: "123456",
      database: "tutor_system",
    });
    console.log("✅ Kết nối MySQL thành công!");
  } catch (err) {
    console.error("❌ Lỗi kết nối MySQL:", err);
    process.exit(1); // dừng server nếu DB không connect được
  }
};

// -------------------------
// Endpoint login
// -------------------------
app.post("/login", async (req, res) => {
  console.log("🔹 Login request body:", req.body);

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username và password không được để trống" });
  }

  try {
    // Lấy user từ DB
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    console.log("🔹 DB rows:", rows);

    if (rows.length === 0) {
      return res.status(401).json({ message: "User không tồn tại" });
    }

    const user = rows[0];

    // So sánh password
    // So sánh đơn giản (vì DB đang lưu plain text)
    if (password !== user.password) {
      return res.status(401).json({ message: "Sai mật khẩu" });
    }
    // Login thành công, trả về thông tin user (không trả password)
    const { id, username: u, role, fullname } = user;
    return res.json({
      success: true,
      id,
      username: u,
      role,
      fullname
    });
  } catch (err) {
    console.error("❌ Lỗi server:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
});

// -------------------------
// Endpoint register (optional)
// -------------------------
app.post("/register", async (req, res) => {
  const { username, password, fullname, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username và password không được để trống" });
  }

  try {
    // Kiểm tra role hợp lệ theo ENUM trong DB
    const validRoles = ["student", "teacher", "admin"];
    const safeRole = validRoles.includes(role) ? role : "student";

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert vào DB
    await db.execute(
      "INSERT INTO users (username, password, fullname, role) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, fullname || "", safeRole]
    );

    return res.json({ message: "Đăng ký thành công!" });
  } catch (err) {
    console.error("❌ Lỗi register:", err);
    return res.status(500).json({ message: "Lỗi server khi đăng ký" });
  }
});
// -------------------------
// Start server
// -------------------------
const startServer = async () => {
  await initDB();
  app.listen(3000, () => {
    console.log("🚀 Server đang chạy tại: http://localhost:3000");
  });
};

startServer();
