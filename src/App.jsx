import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './views/LoginPage.jsx';
import RoleSelection from './roles/RoleSelection.jsx';
import Dashboard from './views/Dashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 👇 Trang chọn role hiển thị đầu tiên */}
        <Route index element={<RoleSelection />} /> 
        <Route path="login" element={<LoginPage />} /> 
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
