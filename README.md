# 🗄️ Cơ sở dữ liệu: Login / Register (MySQL + Aiven)

## 🎯 Mục tiêu
Xây dựng và triển khai cơ sở dữ liệu **đăng ký / đăng nhập** sử dụng **MySQL** (cục bộ và cloud).  
Chuẩn bị tài liệu kết nối để **backend (Node.js)** sử dụng an toàn, có SSL và múi giờ Việt Nam.

---

## 🕒 Múi giờ hiển thị
- **Dữ liệu lưu** dưới dạng **UTC** trong cơ sở dữ liệu.  
- **Hiển thị** theo **UTC+7 (Asia/Ho_Chi_Minh)** bằng một trong hai cách:
  - Thiết lập múi giờ trong backend:  
    `SET time_zone = '+07:00'`
  - Hoặc dùng trong truy vấn:  
    `CONVERT_TZ(..., '+00:00', '+07:00')`

---

## ⚙️ Công nghệ & Công cụ sử dụng

| Thành phần | Mô tả |
|-------------|-------|
| **MySQL 8 / MariaDB client** | Dùng để thao tác DB (CLI: `mysql`, `mysqldump`) |
| **Aiven for MySQL (Free plan)** | Cloud Database có SSL bắt buộc |
| **SQL chuẩn (DDL/DML)** | Tạo bảng, thêm dữ liệu, truy vấn dữ liệu |
| **Node.js** | Dùng để kết nối và thao tác backend |
| **mysql2/promise** | Thư viện Node.js hỗ trợ Promise cho MySQL |
| **SSL (ca.pem)** | Đảm bảo kết nối bảo mật với Aiven |

---

## 🧱 Cấu trúc dữ liệu
CSDL gồm một 3 bảng  `student`, `tutor`, `admin` lưu thông tin:
- `id` — định danh tự tăng (PRIMARY KEY)  
- `name` — tên hiển thị của người dùng  
- `email` — duy nhất cho mỗi người dùng (UNIQUE)  
- `password` — mật khẩu  
- `created_at` — thời điểm tạo  

---

## 🔐 Thông tin kết nối (Aiven Cloud)
nằm trong file .env và db.js
