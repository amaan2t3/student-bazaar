import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { useAuth } from '../context/AuthContext';
import Home from '../pages/public/Home';
import BrowseProjects from '../pages/public/BrowseProjects';
import ProjectDetails from '../pages/public/ProjectDetails';
import CustomProjectRequest from '../pages/public/CustomProjectRequest';
import HowItWorks from '../pages/public/HowItWorks';
import AcademicIntegrity from '../pages/public/AcademicIntegrity';
import Contact from '../pages/public/Contact';
import OurTeam from '../pages/public/OurTeam';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import BecomeSeller from '../pages/seller/BecomeSeller';
import SellerApplicationsReview from '../pages/admin/SellerApplicationsReview';
import AdminDashboard from '../pages/admin/AdminDashboard';
import CustomRequestModeration from '../pages/admin/CustomRequestModeration';
import AddProject from '../pages/seller/AddProject';
import MyProjects from '../pages/seller/MyProjects';
import ProjectModeration from '../pages/admin/ProjectModeration';
import AdminProjectDetails from '../pages/admin/AdminProjectDetails';
import ContactMessages from '../pages/admin/ContactMessages';
import TeamManagement from '../pages/admin/TeamManagement';
import ContactSettings from '../pages/admin/ContactSettings';
import MyDownloads from '../pages/buyer/MyDownloads';
import NotFound from '../pages/public/NotFound';

const HideMarketplaceForAdmin = ({ children }) => {
  const { role, loading } = useAuth();
  if (loading) return null;
  return role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : children;
};

const RequireRole = ({ roles, children }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-12 text-center text-sm text-slate-500">Checking your session...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (!roles.includes(role)) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/browse'} replace />;
  }
  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Main Layout Route Tree */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HideMarketplaceForAdmin><Home /></HideMarketplaceForAdmin>} />
        <Route path="/browse" element={<HideMarketplaceForAdmin><BrowseProjects /></HideMarketplaceForAdmin>} />
        <Route path="/project/:slug" element={<HideMarketplaceForAdmin><ProjectDetails /></HideMarketplaceForAdmin>} />
        <Route path="/custom-request" element={<HideMarketplaceForAdmin><CustomProjectRequest /></HideMarketplaceForAdmin>} />
        <Route path="/how-it-works" element={<HideMarketplaceForAdmin><HowItWorks /></HideMarketplaceForAdmin>} />
        <Route path="/academic-integrity" element={<HideMarketplaceForAdmin><AcademicIntegrity /></HideMarketplaceForAdmin>} />
        <Route path="/contact" element={<HideMarketplaceForAdmin><Contact /></HideMarketplaceForAdmin>} />
        <Route path="/team" element={<HideMarketplaceForAdmin><OurTeam /></HideMarketplaceForAdmin>} />
        <Route path="/our-team" element={<HideMarketplaceForAdmin><OurTeam /></HideMarketplaceForAdmin>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Phase 6 Seller Application & Admin Review */}
        <Route path="/become-seller" element={<RequireRole roles={['buyer', 'seller']}><BecomeSeller /></RequireRole>} />
        <Route path="/admin/dashboard" element={<RequireRole roles={['admin']}><AdminDashboard /></RequireRole>} />
        <Route path="/admin/custom-requests" element={<RequireRole roles={['admin']}><CustomRequestModeration /></RequireRole>} />
        <Route path="/admin/seller-applications" element={<RequireRole roles={['admin']}><SellerApplicationsReview /></RequireRole>} />

        {/* Phase 7 Ready-Made Project Marketplace Studio */}
        <Route path="/seller/add-project" element={<RequireRole roles={['seller']}><AddProject /></RequireRole>} />
        <Route path="/seller/my-projects" element={<RequireRole roles={['seller']}><MyProjects /></RequireRole>} />
        <Route path="/admin/projects" element={<RequireRole roles={['admin']}><ProjectModeration /></RequireRole>} />
        <Route path="/admin/projects/new" element={<RequireRole roles={['admin']}><AddProject /></RequireRole>} />
        <Route path="/admin/projects/:id/edit" element={<RequireRole roles={['admin']}><AddProject /></RequireRole>} />
        <Route path="/admin/projects/:id" element={<RequireRole roles={['admin']}><AdminProjectDetails /></RequireRole>} />
        <Route path="/admin/project-moderation" element={<RequireRole roles={['admin']}><ProjectModeration /></RequireRole>} />

        {/* Contact & Team Management */}
        <Route path="/admin/contact-messages" element={<RequireRole roles={['admin']}><ContactMessages /></RequireRole>} />
        <Route path="/admin/team" element={<RequireRole roles={['admin']}><TeamManagement /></RequireRole>} />
        <Route path="/admin/contact-settings" element={<RequireRole roles={['admin']}><ContactSettings /></RequireRole>} />

        {/* Phase 8 Buyer Private Download Vault */}
        <Route path="/my-downloads" element={<RequireRole roles={['buyer']}><MyDownloads /></RequireRole>} />
        <Route path="/my-purchases" element={<RequireRole roles={['buyer']}><MyDownloads /></RequireRole>} />
        
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
