import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo1.jpeg';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Sparkles,
  UserCircle,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Button from './Button';

export const Navbar = () => {
  const { user, role, switchRole, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Brand colors
  const MIDNIGHT_NAVY = '#101827';
  const ROYAL_NAVY = '#1B2940';
  const GOLD = '#D6B779';
  const IVORY = '#F8F5ED';
  const BORDER = '#E5E1D8';

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-[#D6B779] ${isActive ? 'text-[#D6B779] font-semibold' : 'text-[#475569]'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm" style={{ borderBottom: `1px solid ${BORDER}` }}>

      {/* ── Top micro bar ── */}
      <div style={{ backgroundColor: MIDNIGHT_NAVY }} className="text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">

          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: GOLD }}></span>
            <span className="font-medium" style={{ color: GOLD }}>Exclusive for Pakistani Universities:</span>
            <span className="text-white hidden sm:inline">FAST, NUST, PUCIT, COMSATS, UET, GIKI &amp; more.</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-white hidden md:inline">Currency: <strong className="text-white">PKR (Rs)</strong></span>

            {/* Role switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-xs transition-colors border border-slate-700"
                style={{ color: GOLD }}
              >
                <span className="text-white">Role:</span>
                <span className="capitalize font-bold text-white">{role}</span>
                <span className="text-slate-400 text-[10px]">▼</span>
              </button>

              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-1 w-48 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-xs"
                  onClick={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-1 text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-100 font-semibold">
                    Switch Test Persona
                  </div>
                  {['guest', 'buyer', 'seller', 'admin'].map((r) => (
                    <button
                      key={r}
                      onClick={() => switchRole(r)}
                      className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#F8F5ED] capitalize"
                    >
                      <span>{r === 'guest' ? 'Guest (Logged Out)' : r === 'buyer' ? 'Buyer (Ali - BSIT)' : r === 'seller' ? 'Seller (Usman - Dev)' : 'Admin (Prof. Tariq)'}</span>
                      {role === r && <span style={{ color: GOLD }} className="font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <img
              src={logo}

              alt="StudentBazaar"
              className="h-16 w-auto group-hover:scale-10 transition-transform"
            />
          </Link>


          {/* Search bar (desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search OOP, Web, AI, DBMS, C++, Python projects..."
              className="w-full pl-9 pr-4 py-2 text-sm  rounded-lg transition-all placeholder:text-slate-400 focus:outline-none"
              style={{ border: `1px solid ${BORDER}` }}
              onFocus={e => e.target.style.borderColor = GOLD}
              onBlur={e => e.target.style.borderColor = BORDER}
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </form>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-6">
            <NavLink to="/browse" className={navLinkClasses}>Browse Projects</NavLink>
            <NavLink to="/custom-request" className={navLinkClasses}>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" style={{ color: GOLD }} />
                Custom Request
              </span>
            </NavLink>

            {role === 'admin' ? (
              <>
                <NavLink to="/admin/project-moderation" className={navLinkClasses}>
                  <span className="text-amber-600 font-semibold">⚖️ Moderate</span>
                </NavLink>
                <NavLink to="/admin/seller-applications" className={navLinkClasses}>Vetting</NavLink>
              </>
            ) : role === 'seller' ? (
              <>
                <NavLink to="/seller/my-projects" className={navLinkClasses}>My Projects</NavLink>
                <NavLink to="/seller/add-project" className={navLinkClasses}>
                  <span className="font-semibold px-2 py-0.5 rounded text-sm" style={{ color: MIDNIGHT_NAVY, backgroundColor: GOLD }}>
                    + Upload
                  </span>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/my-downloads" className={navLinkClasses}>My Downloads</NavLink>
                <NavLink to="/become-seller" className={navLinkClasses}>Become a Seller</NavLink>
              </>
            )}

            <NavLink to="/how-it-works" className={navLinkClasses}>How It Works</NavLink>
          </nav>

          {/* Right: cart + auth */}
          <div className="flex items-center gap-2">
            <Link
              to="/browse"
              className="relative p-2 rounded-lg transition-colors text-slate-500 hover:text-slate-800 hover:bg-[#F8F5ED]"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
                  style={{ backgroundColor: GOLD, color: MIDNIGHT_NAVY }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative flex items-center gap-2 pl-2 border-l border-[#E5E1D8]">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="hidden sm:block text-right">
                    <div className="text-xs font-semibold text-slate-900 truncate max-w-[100px]">{user.full_name || user.name}</div>
                    <div className="text-[10px] font-medium" style={{ color: GOLD }}>{user.university}</div>
                  </div>
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover"
                    style={{ border: `2px solid ${GOLD}` }}
                  />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <div className="font-bold text-slate-900">{user.full_name || user.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                      <div className="mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded inline-block" style={{ color: MIDNIGHT_NAVY, backgroundColor: '#E9D9B5' }}>
                        {role.toUpperCase()}
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-3.5 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link to="/register"><Button variant="primary" size="sm">Register</Button></Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-[#F8F5ED] rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t py-4 px-2 space-y-2 bg-white" style={{ borderColor: BORDER }}>
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#F8F5ED] rounded-lg focus:outline-none"
                style={{ border: `1px solid ${BORDER}` }}
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </form>

            {[
              { to: '/browse', label: 'Browse Projects' },
              { to: '/custom-request', label: '✨ Custom Request' },
              { to: '/how-it-works', label: 'How It Works' },
              { to: '/academic-integrity', label: 'Academic Integrity' },
              ...(role === 'seller' ? [{ to: '/seller/my-projects', label: 'My Projects' }, { to: '/seller/add-project', label: '+ Upload Project' }] : []),
              ...(role === 'admin' ? [{ to: '/admin/project-moderation', label: '⚖️ Moderate Projects' }, { to: '/admin/seller-applications', label: 'Seller Vetting' }] : []),
              ...(role === 'buyer' ? [{ to: '/my-downloads', label: 'My Downloads' }, { to: '/become-seller', label: 'Become a Seller' }] : []),
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-[#F8F5ED] hover:text-[#101827]"
              >
                {label}
              </NavLink>
            ))}

            <div className="pt-3 border-t flex gap-2" style={{ borderColor: BORDER }}>
              {!user ? (
                <>
                  <Link to="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link to="/register" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" variant="primary" size="sm">Register</Button>
                  </Link>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600"
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                >
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
