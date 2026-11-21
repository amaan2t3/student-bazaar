import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { useAuth } from '../../context/AuthContext';

export const PublicLayout = () => {
  const { role } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {role !== 'admin' && <Footer />}
    </div>
  );
};

export default PublicLayout;
