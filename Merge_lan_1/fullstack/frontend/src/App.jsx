import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './views/LoginPage.jsx';
import RegisterPage from './views/RegisterPage.jsx';
import RoleSelection from './roles/RoleSelection.jsx';
import Dashboard from './views/Dashboard.jsx';
import TutorRegistration from './views/TutorRegistration.jsx';
import TutorRequestHistory from './views/TutorRequestHistory.jsx';
import TutorRegisterPage from './views/TutorRegisterPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 👇 Trang chọn role hiển thị đầu tiên */}
        <Route index element={<RoleSelection />} /> 
        <Route path="login" element={<LoginPage />} /> 
        <Route path="register" element={<RegisterPage />} /> 
        <Route path="tutor/register" element={<TutorRegisterPage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tutor-registration" element={<TutorRegistration />} />
        <Route path="tutor-history" element={<TutorRequestHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
