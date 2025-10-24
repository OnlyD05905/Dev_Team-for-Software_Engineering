import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TutorRegisterPage.css";

export default function TutorRegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    specialization: "",
    subjects: "",
    bio: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Xóa lỗi khi user nhập lại
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!formData.specialization.trim()) {
      newErrors.specialization = "Vui lòng nhập chuyên môn";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/tutor/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          specialization: formData.specialization,
          subjects: formData.subjects,
          bio: formData.bio,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message || "Đăng ký thành công!");
        navigate("/login", { state: { role: "tutor" } });
      } else {
        alert(data.error || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Không thể kết nối đến server. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tutor-register-container">
      <div className="tutor-register-card">
        <div className="register-header">
          <h1>👨‍🏫 Đăng ký Giảng viên</h1>
          <p>Tạo tài khoản để bắt đầu hỗ trợ sinh viên</p>
        </div>

        <form onSubmit={handleSubmit} className="tutor-register-form">
          <div className="form-group">
            <label htmlFor="name">
              Họ và tên <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ và tên đầy đủ"
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@hcmut.edu.vn"
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0123456789"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">
                Mật khẩu <span className="required">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ít nhất 6 ký tự"
                className={errors.password ? "error" : ""}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Xác nhận mật khẩu <span className="required">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                className={errors.confirmPassword ? "error" : ""}
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="specialization">
              Chuyên môn <span className="required">*</span>
            </label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="VD: Cơ sở dữ liệu, Lập trình, AI..."
              className={errors.specialization ? "error" : ""}
            />
            {errors.specialization && (
              <span className="error-message">{errors.specialization}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="subjects">Các môn học dạy</label>
            <input
              type="text"
              id="subjects"
              name="subjects"
              value={formData.subjects}
              onChange={handleChange}
              placeholder="VD: Hệ CSDL, SQL, MongoDB (phân cách bằng dấu phẩy)"
            />
            <small className="helper-text">
              Nhập các môn học, phân cách bằng dấu phẩy
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Giới thiệu về bạn</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Kinh nghiệm giảng dạy, thành tích, sở thích..."
            />
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          <div className="login-link">
            Đã có tài khoản?{" "}
            <span onClick={() => navigate("/login")} className="link">
              Đăng nhập ngay
            </span>
          </div>

          <div className="back-home">
            <span onClick={() => navigate("/")} className="link">
              ← Quay về trang chủ
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
