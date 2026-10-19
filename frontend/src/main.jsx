
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/index.css';

import App from './components/App.jsx';
import FAQPage from './components/FAQPage.jsx';
import DashboardPage from './components/DashboardPage.jsx';
import AnalyzePage from './components/AnalyzePage.jsx';
import ReportPage from './components/ReportPage.jsx';
import Login from './components/common/Login.jsx';
import ProfilePage from './components/common/Profile.jsx';

// Admin pages
import AdminLogin from './components/admin/AdminLogin.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import AdminContent from './components/admin/AdminContent.jsx';
import AdminUsers from './components/admin/AdminUsers.jsx';
import AdminSkinAnalysis from './components/admin/AdminSkinAnalysis.jsx';
import AdminReports from './components/admin/AdminReports.jsx';
import AdminFeedback from './components/admin/AdminFeedback.jsx';
import AdminSettings from './components/admin/AdminSettings.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Public website routes */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/content" element={<AdminContent />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route
          path="/admin/skin-analysis"
          element={<AdminSkinAnalysis />}
        />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/feedback" element={<AdminFeedback />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
