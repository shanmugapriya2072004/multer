import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  ShieldCheck, 
  FolderLock, 
  CalendarDays, 
  PillBottle, 
  LayoutDashboard, 
  LogOut, 
  Search,
  BellRing,
  Sparkles,
  Stethoscope
} from 'lucide-react';

export default function ModernLayout() {
  const { user, logout } = useContext(AuthContext);
  const isAdmin = user?.user?.role === 'admin';

  const navItems = isAdmin ? [
    { name: 'Admin Console', path: '/admin', icon: LayoutDashboard },
  ] : [
    { name: 'Document Vault', path: '/dashboard', icon: FolderLock },
    { name: 'Appointments', path: '/appointments', icon: CalendarDays },
    { name: 'Medicine Track', path: '/reminders', icon: PillBottle },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex">
      {/* Light Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between p-5 sticky top-0 h-screen z-30 shadow-sm">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-3 mb-8">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-black tracking-wider text-slate-900">
                MEDI<span className="text-blue-600">VAULT</span>
              </span>
              <p className="text-[10px] tracking-widest uppercase font-semibold text-slate-400">Health Ledger</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-3 block mb-2">
              Main Menu
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border border-blue-200/80 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white uppercase shadow-sm">
                {user?.user?.name?.[0] || 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.user?.name}</p>
                <span className="text-[10px] text-blue-600 font-semibold uppercase">{user?.user?.role}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Encrypted HIPAA-Grade Cloud Storage</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Quick search records..."
                className="bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white w-56 transition-all focus:w-64"
              />
            </div>
            <div className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer">
              <BellRing className="w-4 h-4" />
            </div>
          </div>
        </header>

        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}