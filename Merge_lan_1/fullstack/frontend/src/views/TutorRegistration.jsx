import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TutorRegistration.css";

export default function TutorRegistration() {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [isLoadingTutors, setIsLoadingTutors] = useState(true);
  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    email: "",
    phone: "",
    tutorId: "", // Thêm tutorId
    subject: "",
    topic: "",
    preferredTime: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy danh sách tutors khi component mount
  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const response = await fetch("http://localhost:5000/tutors");
      const data = await response.json();
      
      if (data.success) {
        setTutors(data.tutors);
      }
    } catch (error) {
      console.error("Error fetching tutors:", error);
      alert("Không thể tải danh sách tutors. Vui lòng thử lại sau.");
    } finally {
      setIsLoadingTutors(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch("http://localhost:5000/tutor-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
        navigate("/dashboard");
      } else {
        alert("Có lỗi xảy ra: " + (data.error || "Vui lòng thử lại"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Không thể kết nối đến server. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  // Lấy tutor đã chọn để hiển thị thông tin
  const selectedTutor = tutors.find(t => t.id === parseInt(formData.tutorId));

  return (
    <div className="tutor-registration-container">
      <div className="registration-header">
        <button className="back-button" onClick={handleCancel}>
          ← Quay lại
        </button>
        <h1>Đăng ký nhận hỗ trợ</h1>
      </div>

      <form className="registration-form" onSubmit={handleSubmit}>
        {/* Chọn Tutor Section */}
        <div className="form-section">
          <h2>Chọn Tutor</h2>
          
          <div className="form-group">
            <label htmlFor="tutorId">
              Chọn Tutor <span className="required">*</span>
            </label>
            {isLoadingTutors ? (
              <p>Đang tải danh sách tutors...</p>
            ) : (
              <>
                <select
                  id="tutorId"
                  name="tutorId"
                  value={formData.tutorId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn tutor --</option>
                  {tutors.map((tutor) => (
                    <option key={tutor.id} value={tutor.id}>
                      {tutor.name} - {tutor.specialization} ⭐ {tutor.rating}
                    </option>
                  ))}
                </select>
                
                {/* Hiển thị thông tin tutor đã chọn */}
                {selectedTutor && (
                  <div className="tutor-info-card">
                    <h4>📚 Thông tin Tutor</h4>
                    <div className="tutor-detail">
                      <strong>Tên:</strong> {selectedTutor.name}
                    </div>
                    <div className="tutor-detail">
                      <strong>Chuyên môn:</strong> {selectedTutor.specialization}
                    </div>
                    <div className="tutor-detail">
                      <strong>Các môn dạy:</strong> {selectedTutor.subjects}
                    </div>
                    <div className="tutor-detail">
                      <strong>Đánh giá:</strong> ⭐ {selectedTutor.rating}/5.0
                    </div>
                    <div className="tutor-detail">
                      <strong>Số buổi đã dạy:</strong> {selectedTutor.total_sessions} buổi
                    </div>
                    {selectedTutor.bio && (
                      <div className="tutor-bio">
                        <strong>Giới thiệu:</strong>
                        <p>{selectedTutor.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="form-section">
          <h2>Thông tin sinh viên</h2>
          
          <div className="form-group">
            <label htmlFor="studentName">
              Họ và tên <span className="required">*</span>
            </label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              required
              placeholder="Nhập họ và tên của bạn"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="studentId">
                MSSV <span className="required">*</span>
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                placeholder="Ví dụ: 2211234"
              />
            </div>

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
                required
                placeholder="example@hcmut.edu.vn"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Số điện thoại <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="0123456789"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Thông tin môn học cần hỗ trợ</h2>
          
          <div className="form-group">
            <label htmlFor="subject">
              Môn học <span className="required">*</span>
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn môn học --</option>
              <option value="Hệ cơ sở dữ liệu">Hệ cơ sở dữ liệu</option>
              <option value="Mạng máy tính">Mạng máy tính</option>
              <option value="Công nghệ phần mềm">Công nghệ phần mềm</option>
              <option value="Cấu trúc dữ liệu và giải thuật">
                Cấu trúc dữ liệu và giải thuật
              </option>
              <option value="Lập trình hướng đối tượng">
                Lập trình hướng đối tượng
              </option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="topic">
              Chủ đề cần hỗ trợ <span className="required">*</span>
            </label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
              placeholder="Ví dụ: Normalization, SQL queries, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="preferredTime">
              Thời gian mong muốn <span className="required">*</span>
            </label>
            <select
              id="preferredTime"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn khung giờ --</option>
              <option value="Sáng (8h-12h)">Sáng (8h-12h)</option>
              <option value="Chiều (13h-17h)">Chiều (13h-17h)</option>
              <option value="Tối (18h-21h)">Tối (18h-21h)</option>
              <option value="Cuối tuần">Cuối tuần</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Ghi chú thêm (không bắt buộc)</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải hoặc yêu cầu đặc biệt..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </div>
      </form>
    </div>
  );
}
