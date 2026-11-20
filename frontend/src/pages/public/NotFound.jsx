import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';

export const NotFound = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-ivory text-gold flex items-center justify-center mx-auto border border-gold-soft">
        <FileQuestion className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900">404 — Page Not Found</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          The project package, category, or page you are looking for does not exist or has been relocated.
        </p>
      </div>
      <div className="pt-2 flex justify-center gap-3">
        <Link to="/">
          <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
