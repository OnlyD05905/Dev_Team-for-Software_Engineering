CREATE DATABASE se_logreg CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE se_logreg;


CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE USER 'khoa_admin1'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
GRANT ALL PRIVILEGES ON *.* TO 'khoa_admin1'@'localhost';
FLUSH PRIVILEGES;
