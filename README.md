# 🧭 Dev Workflow – Tutor Support System

Tài liệu này hướng dẫn quy trình làm việc nhóm trên GitHub cho dự án **Tutor Support System**.  
🎯 Mục tiêu: đảm bảo code đồng bộ, không xung đột và dễ kiểm soát khi review / merge.

---

## 🌳 Cấu trúc Branch

| Branch | Mục đích | Người phụ trách |
|:--------|:----------|:----------------|
| `main` | Chứa phiên bản **ổn định**, đã test và sẵn sàng nộp. | TechLead |
| `develop` *(tùy chọn)* | Dùng để tích hợp các feature trước khi merge vào `main`. | TechLead |
| `frontend` | Phát triển **giao diện UI/UX**. | Dev 1 |
| `backend` | Xử lý **API, logic nghiệp vụ, server-side**. | Dev 2 |
| `database` | Thiết kế & quản lý **CSDL, ERD, script SQL**. | Dev 3 |
| `test` | Kiểm thử và xác minh chức năng (QC). | QC |

---

## ⚙️ Quy trình làm việc chuẩn (Git Workflow)

### 🔹 Bước 1. Clone repo về máy

```bash
git clone https://github.com/<ORG_NAME>/<REPO_NAME>.git
cd <REPO_NAME>
```

### 🔹 Bước 2. Chuyển sang nhánh của bạn

```bash
git checkout <branch_name>
# Ví dụ: git checkout frontend
```

### 🔹 Bước 3. Cập nhật code mới nhất trước khi làm việc

```bash
git pull origin <branch_name>
```

### 🔹 Bước 4. Code và commit

```bash
git add .
git commit -m "[FE] Thêm giao diện đăng ký Tutor"
```

### 🔹 Bước 5. Push code lên GitHub

```bash
git push origin <branch_name>
```

### 🔹 Bước 6. Tạo Pull Request (PR)

- Vào GitHub → chọn branch của bạn → **Compare & Pull Request**  
- Gửi PR vào `develop` (hoặc `main` nếu không có `develop`)  
- **TechLead** review & merge khi đạt yêu cầu

---

## 🧱 Quy tắc Commit Message

Để lịch sử Git dễ đọc và thống nhất, mọi commit nên theo cấu trúc:
```
[Loại] Mô tả ngắn gọn thay đổi
```

| Nhóm | Tag gợi ý | Ví dụ |
|:------|:------------|:---------|
| Frontend | `[FE]` | `[FE] Thêm form đăng ký chương trình Tutor` |
| Backend | `[BE]` | `[BE] Xử lý API đăng ký tutor` |
| Database | `[DB]` | `[DB] Tạo bảng tutor_registration` |
| Fix lỗi | `[FIX]` | `[FIX] Sửa lỗi hiển thị form` |
| Tài liệu | `[DOC]` | `[DOC] Cập nhật hướng dẫn workflow` |

---

## 🧩 Quy tắc Review & Merge

- Mỗi **Pull Request (PR)** cần ít nhất **1 người review** (TechLead/QC).  
- **Không merge thẳng vào `main`** nếu chưa được duyệt.  
- Sau khi merge, xóa branch feature nếu đã hoàn tất.  
- **QC (branch `test`)** chạy thử và xác nhận trước khi merge chính thức.

---

## 🧠 Workflow minh họa

```
main
├── develop
├── frontend
├── backend
├── database
└── test (QC kiểm thử)
```

- Dev code trên nhánh riêng (`frontend`, `backend`, `database`)  
- Merge vào `develop` sau khi hoàn tất tính năng  
- QC test → xác nhận ổn → merge `develop` → `main`

---

## 🔒 Quy tắc khác

- ❌ **Không commit file rác** như:
  - `node_modules/`, `.env`, `.vscode/`, `__pycache__/`, `dist/`, `build/`
- 📝 **Cập nhật README.md** nếu có thay đổi cấu trúc hoặc setup  
- ⚡ **Luôn pull code mới nhất** trước khi code để tránh conflict  


---

## 👥 Vai trò trong team

| Vai trò | Thành viên | Trách nhiệm |
|:--------|:------------|:-------------|
| **TechLead + SysAdmin** | Nhất Duy | Quản lý branch, review & merge code |
| **Quality Control (QC)** | Nhật Huy | Test, xác nhận lỗi, dùng branch `test` |
| **Dev Team** | Khoa, Khôi, Bình | Code FE/BE/DB |

---

## 🧾 Checklist cuối Sprint

- [ ] Code đã merge vào `main` thành công  
- [ ] Tất cả PR đã review & close  
- [ ] Database script cập nhật đầy đủ  
- [ ] README được update mới nhất  


---


---

📌 *Tài liệu cập nhật bởi TechLead: Nguyễn Nhất Duy*  
🗓️ *Ngày cập nhật gần nhất: 10/10/2025*

