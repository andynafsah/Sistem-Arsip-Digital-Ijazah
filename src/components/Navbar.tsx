import React from 'react';
import { 
  FolderArchive, 
  LayoutDashboard, 
  Table, 
  CheckSquare, 
  FilePlus2, 
  FolderTree, 
  History, 
  Code2, 
  Download,
  Sparkles,
  Search,
  Sun,
  Moon,
  Users,
  LogOut,
  User,
  Shield
} from 'lucide-react';
import { AdminUser } from '../types/user';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenGasModal: () => void;
  onBackup: () => void;
  unreadCount?: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  currentUser: AdminUser | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenGasModal,
  onBackup,
  unreadCount = 0,
  theme,
  onToggleTheme,
  currentUser,
  onLogout
}) => {
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  const navItems = [
    { id: 'dashboard', label: '04 Dashboard', icon: LayoutDashboard },
    { id: 'database', label: '01 Database Ijazah', icon: Table },
    { id: 'search', label: '05 Pencarian Cepat', icon: Search },
    { id: 'verification', label: 'Verifikasi Arsip', icon: CheckSquare, badge: unreadCount },
    { id: 'form', label: 'Formulir Pengajuan', icon: FilePlus2 },
    { id: 'drive', label: 'Google Drive Tree', icon: FolderTree },
    ...(isSuperAdmin ? [{ id: 'users', label: '02 User Admin', icon: Users, highlightRole: true }] : []),
    { id: 'logs', label: '03 Log Aktivitas', icon: History },
    { id: 'gas', label: 'Apps Script Hub', icon: Code2, highlight: true }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 text-slate-100 shadow-xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Institution Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/60 border border-emerald-400/30 group-hover:scale-105 transition-transform duration-200">
              <FolderArchive className="w-5 h-5 text-white drop-shadow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-white font-['Outfit',sans-serif]">
                  DASHBOARD ARSIP DIGITAL IJAZAH
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded-full shadow-inner">
                  v2.6 LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium truncate max-w-[240px] sm:max-w-md">
                Ma’had Darul Hadits Lima Puluh Kota
              </p>
            </div>
          </div>

          {/* User Profile Info & Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Authenticated User Identity Pill (Sections 24) */}
            {currentUser && (
              <div className="hidden lg:flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] border border-emerald-500/30">
                  {currentUser.nama.charAt(0).toUpperCase()}
                </div>
                <div className="text-left leading-tight">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-white truncate max-w-[130px]">{currentUser.nama}</span>
                    <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded-full border ${
                      currentUser.role === 'SUPER_ADMIN'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : currentUser.role === 'ADMIN_TU'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {currentUser.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    Unit: {currentUser.unit}
                  </span>
                </div>
              </div>
            )}

            {/* Theme Toggle Button (Light/Dark Mode) */}
            <button
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700/80 shadow-sm transition active:scale-95 cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Terang</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">Gelap</span>
                </>
              )}
            </button>

            <button
              onClick={onBackup}
              title="Buat Cadangan Database"
              className="hidden xl:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700/80 shadow-sm transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Backup</span>
            </button>

            <button
              onClick={onOpenGasModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-900/30 border border-emerald-400/30 transition transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">GAS</span>
              <span>Hub</span>
            </button>

            {/* Logout Button (Section 23) */}
            {currentUser && (
              <button
                onClick={onLogout}
                title="Keluar dari Dashboard Administrator"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold bg-rose-950/40 hover:bg-rose-900/80 text-rose-300 rounded-xl border border-rose-800/40 transition active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar py-1 pb-2.5 border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-amber-500 text-slate-950 font-bold rounded-full shadow-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

