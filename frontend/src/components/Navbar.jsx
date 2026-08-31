import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  ShieldAlert, 
  FileText, 
  Calendar, 
  Bell, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X 
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const isAdmin = user.user?.role === 'admin';

  const userLinks = [
    { name: 'Documents', path: '/dashboard', icon: FileText },
    { name: 'Appointments', path: '/appointments', icon: Calendar },
    { name: 'Reminders', path: '/reminders', icon: Bell },
  ];

  const adminLinks = [
    { name: 'Admin Console', path: '/admin', icon: LayoutDashboard },
  ];

  const navLinks = isAdmin ? adminLinks : userLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center space-x-2.5">
            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">MediVault</span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    active
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* User Profile & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-800">{user.user?.name}</div>
              <span className="inline-block text-[10px] font-semibold uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                {user.user?.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">{user.user?.name}</span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}