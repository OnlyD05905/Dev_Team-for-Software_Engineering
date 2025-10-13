# se-logreg • README

> **Mục tiêu**: Xây dựng & triển khai cơ sở dữ liệu đăng ký/đăng nhập (login/register) với **MySQL** và **Aiven for MySQL**, chuẩn bị tài liệu kết nối cho backend.

---


> **Múi giờ hiển thị**: lưu **UTC** trong DB, hiển thị **UTC+7 (Asia/Ho_Chi_Minh)** qua `SET time_zone = '+07:00'` hoặc `CONVERT_TZ`.

---

## 2) Công nghệ & Công cụ sử dụng

- **MySQL 8 / MariaDB client** (CLI: `mysql`, `mysqldump`)
- **Aiven for MySQL (Free plan)** – cloud managed DB, SSL bắt buộc
- **SQL** tiêu chuẩn (DDL/DML): `CREATE DATABASE`, `CREATE TABLE`, `INSERT/SELECT/UPDATE/DELETE`, `CONVERT_TZ`
- **Cho backend**:
  - Node.js: `mysql2/promise`

---

## 3) Lược đồ CSDL

```sql
CREATE TABLE IF NOT EXISTS users (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)      NOT NULL,
  email       VARCHAR(254)      NOT NULL UNIQUE,
  password    VARCHAR(255)      NOT NULL, 
  created_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

Các truy vấn tham chiếu:

```sql
-- Đăng ký 
INSERT INTO users (name, email, password) VALUES (?, ?, ?);

-- Đăng nhập 
SELECT id, name, email, password FROM users WHERE email = ?;

-- Hiển thị thời gian UTC+7
SELECT id, name, email, CONVERT_TZ(created_at, '+00:00', '+07:00') AS created_at_vn
FROM users WHERE id = ?;

```

## 4) Thông tin kết nối (điền khi triển khai Aiven)

| Tham số | Giá trị |
|---|---|
| `DB_HOST` | `mysql-se-group-meowdata.b.aivencloud.com` |
| `DB_PORT` | `26443` |
| `DB_NAME` | `se_logreg` |
| `DB_USER` | `avnadmin` |
| `DB_PASS` | `AVNS_gE7GBUFNcANHqoaIcGf` |
| `DB_SSL_CA` | `ca.pem` |
| `DB_TZ` | `+07:00` |

---

## 5) Xuất dữ liệu (Local → Aiven)

**Xuất từ local**

```bash
mysqldump -u root -p se_logreg > se_logreg.sql
```

**Nhập lên Aiven (SSL VERIFY CA)**

```bash
mysql -h <HOST> -P <PORT> -u <USER> -p \
  --ssl-mode=VERIFY_CA --ssl-ca="/path/to/ca.pem" \
  se_logreg < se_logreg.sql
```

**Kiểm tra nhanh**

```bash
mysql -h <HOST> -P <PORT> -u <USER> -p \
  --ssl-mode=VERIFY_CA --ssl-ca="/path/to/ca.pem" \
  -e "SHOW DATABASES; USE se_logreg; SHOW TABLES; SELECT COUNT(*) FROM users;"
```

---

## 6) Kết nối Backend

### Node.js (`mysql2/promise`)

```js
// db.js
import mysql from "mysql2/promise";
import fs from "fs";

export async function makeConn() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { ca: fs.readFileSync(process.env.DB_SSL_CA, "utf8") }, // VERIFY CA
  });
  await conn.query("SET time_zone = ?;", [process.env.DB_TZ || "+07:00"]);
  return conn;
}
```

