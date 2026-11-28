import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Grid, BookOpen, PenLine, Mail } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Home', exact: true },
  { to: '/browse', icon: Grid, label: 'Browse' },
  { to: '/notes', icon: BookOpen, label: 'Notes' },
  { to: '/custom-request', icon: PenLine, label: 'Request' },
  { to: '/contact', icon: Mail, label: 'Contact' },
];

export const BottomNavBar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-1px_8px_rgba(0,0,0,0.06)] lg:hidden">
      <div className="w-full flex items-stretch">
        {NAV_ITEMS.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors duration-150 ${
                isActive
                  ? 'text-slate-900'
                  : 'text-slate-400 hover:text-slate-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex items-center justify-center w-6 h-6 rounded-lg transition-colors duration-150 ${isActive ? 'bg-slate-900 text-white' : ''}`}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;
