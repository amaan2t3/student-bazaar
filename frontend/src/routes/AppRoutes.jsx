import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import Home from '../pages/public/Home';
import BrowseProjects from '../pages/public/BrowseProjects';
import ProjectDetails from '../pages/public/ProjectDetails';
import CustomProjectRequest from '../pages/public/CustomProjectRequest';
import HowItWorks from '../pages/public/HowItWorks';
import AcademicIntegrity from '../pages/public/AcademicIntegrity';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import BecomeSeller from '../pages/seller/BecomeSeller';
import SellerApplicationsReview from '../pages/admin/SellerApplicationsReview';
import AddProject from '../pages/seller/AddProject';
import MyProjects from '../pages/seller/MyProjects';
import ProjectModeration from '../pages/admin/ProjectModeration';
import MyDownloads from '../pages/buyer/MyDownloads';
import NotFound from '../pages/public/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Main Layout Route Tree */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<BrowseProjects />} />
        <Route path="/project/:slug" element={<ProjectDetails />} />
        <Route path="/custom-request" element={<CustomProjectRequest />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/academic-integrity" element={<AcademicIntegrity />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Phase 6 Seller Application & Admin Review */}
        <Route path="/become-seller" element={<BecomeSeller />} />
        <Route path="/admin/seller-applications" element={<SellerApplicationsReview />} />

        {/* Phase 7 Ready-Made Project Marketplace Studio */}
        <Route path="/seller/add-project" element={<AddProject />} />
        <Route path="/seller/my-projects" element={<MyProjects />} />
        <Route path="/admin/project-moderation" element={<ProjectModeration />} />

        {/* Phase 8 Buyer Private Download Vault */}
        <Route path="/my-downloads" element={<MyDownloads />} />
        <Route path="/my-purchases" element={<MyDownloads />} />
        
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
