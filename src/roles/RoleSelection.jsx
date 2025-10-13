import React from "react";
import { useNavigate } from "react-router-dom";
import "./RoleSelection.css";

export default function RoleSelection() {
  const navigate = useNavigate();

  // Hàm xử lý khi người dùng chọn vai trò
  const handleSelectRole = (role) => {
    navigate(`/login?role=${role}`); // 👉 truyền role qua URL
  };

  return (
    <div className="role-container">
      <div className="logo-section">
        <img src="bachkhoa_logo.png" alt="HCMUT" className="logo" />
        <h1>Welcome to BKSmartTutor</h1>
      </div>

      <div className="button-group">
        <button className="btn green" onClick={() => handleSelectRole("teacher")}>
          Giảng viên HCMUT đăng nhập
        </button>
        <button className="btn orange" onClick={() => handleSelectRole("student")}>
          Sinh viên HCMUT đăng nhập
        </button>
        <button className="btn red" onClick={() => handleSelectRole("admin")}>
          Admin đăng nhập
        </button>
      </div>
    </div>
  );
}
