import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TutorRequestHistory.css";

export default function TutorRequestHistory() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate("/");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/tutor-requests/${user.id}`
      );
      const data = await response.json();

      if (data.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f39c12",
      approved: "#27ae60",
      rejected: "#e74c3c",
      completed: "#3498db",
    };
    return colors[status] || "#95a5a6";
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "Đang chờ",
      approved: "Đã chấp nhận",
      rejected: "Đã từ chối",
      completed: "Hoàn thành",
    };
    return texts[status] || status;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          ← Quay lại Dashboard
        </button>
        <h1>Lịch sử yêu cầu hỗ trợ Tutor</h1>
      </div>

      <div className="history-content">
        {isLoading ? (
          <div className="loading">Đang tải...</div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <p>Bạn chưa có yêu cầu nào.</p>
            <button
              className="btn-new-request"
              onClick={() => navigate("/tutor-registration")}
            >
              Tạo yêu cầu mới
            </button>
          </div>
        ) : (
          <div className="requests-list">
            {requests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <h3>{request.subject}</h3>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(request.status) }}
                  >
                    {getStatusText(request.status)}
                  </span>
                </div>

                <div className="request-body">
                  <div className="request-info">
                    <strong>Tutor:</strong> {request.tutor_name || 'Chưa xác định'} {request.tutor_name && `(${request.specialization})`}
                  </div>
                  <div className="request-info">
                    <strong>Chủ đề:</strong> {request.topic}
                  </div>
                  <div className="request-info">
                    <strong>Thời gian mong muốn:</strong>{" "}
                    {request.preferred_time}
                  </div>
                  <div className="request-info">
                    <strong>MSSV:</strong> {request.student_id}
                  </div>
                  <div className="request-info">
                    <strong>Email:</strong> {request.email}
                  </div>
                  <div className="request-info">
                    <strong>SĐT:</strong> {request.phone}
                  </div>
                  {request.message && (
                    <div className="request-message">
                      <strong>Ghi chú:</strong>
                      <p>{request.message}</p>
                    </div>
                  )}
                </div>

                <div className="request-footer">
                  <span className="request-date">
                    Tạo lúc: {formatDate(request.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
