import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

// Standard Pages
import Home from './pages/Home';
import About from './pages/About';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';

// Layout & Reusable Elements
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Dashboard Pages
import DashboardLayout from './pages/AdminDashboard/DashboardLayout';
import Analytics from './pages/AdminDashboard/Analytics';
import JobManagement from './pages/AdminDashboard/JobManagement';
import CategoryManagement from './pages/AdminDashboard/CategoryManagement';
import ApplicantManagement from './pages/AdminDashboard/ApplicantManagement';
import BannerManagement from './pages/AdminDashboard/BannerManagement';
import ContentManagement from './pages/AdminDashboard/ContentManagement';
import MediaManagement from './pages/AdminDashboard/MediaManagement';
import ContactEnquiries from './pages/AdminDashboard/ContactEnquiries';
import SettingsPanel from './pages/AdminDashboard/SettingsPanel';

// Main Client Layout Wrapper (Displays header and footer)
const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <Routes>
            {/* Public Client Routes */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/about" element={<MainLayout><About /></MainLayout>} />
            <Route path="/jobs" element={<MainLayout><Jobs /></MainLayout>} />
            <Route path="/jobs/:id" element={<MainLayout><JobDetails /></MainLayout>} />
            <Route path="/careers" element={<MainLayout><Careers /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Dashboard Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUB_ADMIN']} />}>
              <Route path="/admin/dashboard" element={<DashboardLayout />}>
                <Route index element={<Analytics />} />
                <Route path="jobs" element={<JobManagement />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="applicants" element={<ApplicantManagement />} />
                <Route path="banners" element={<BannerManagement />} />
                <Route path="content" element={<ContentManagement />} />
                <Route path="media" element={<MediaManagement />} />
                <Route path="enquiries" element={<ContactEnquiries />} />
                <Route path="settings" element={<SettingsPanel />} />
              </Route>
            </Route>

            {/* Fallback Catch-All Redirect */}
            <Route path="*" element={<MainLayout><Home /></MainLayout>} />
          </Routes>
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
