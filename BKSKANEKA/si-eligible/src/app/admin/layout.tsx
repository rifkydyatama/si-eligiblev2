'use client';

/**
 * ============================================================
 * SI-ELIGIBLE ADMIN ARCHITECTURE v2.0
 * ============================================================
 * Layout: Professional Alpha-Gen Dashboard Frame
 * Style: Floating Glassmorphism, 3D Navigation, Vibrant Ambient
 * Feature: Smart Sidebar, Custom Auth Loader, Parallax Backdrop
 * ============================================================
 */

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  AlertTriangle, 
  School, 
  BarChart3, 
  Download, 
  Settings, 
  LogOut,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Menu,
  X,
  UserCircle
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // --- AUTH PROTECTION LOGIC (UNTOUCHED) ---
  useEffect(() => {
    setMounted(true);
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin' && session?.user?.role !== 'guru_bk') {
      router.push('/login');
    }
  }, [session, status, router]);

  // --- SMART LOADING STATE (ALPHA VERSION) ---
  if (status === 'loading' || !mounted || (status === 'authenticated' && session?.user?.role !== 'admin' && session?.user?.role !== 'guru_bk')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFEFF]">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl rotate-45 animate-pulse" />
          </div>
        </div>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mt-8 text-sm font-black uppercase tracking-[0.3em] text-slate-400"
        >
          Authenticating System...
        </motion.p>
      </div>
    );
  }

  const menuItems = [
    { href: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { href: '/admin/siswa', icon: <Users size={20} />, label: 'Data Siswa' },
    { href: '/admin/nilai', icon: <FileText size={20} />, label: 'Data Nilai' },
    { href: '/admin/sanggahan', icon: <AlertTriangle size={20} />, label: 'Sanggahan' },
    { href: '/admin/kampus', icon: <School size={20} />, label: 'Master Kampus' },
    { href: '/admin/monitoring', icon: <BarChart3 size={20} />, label: 'Monitoring' },
    { href: '/admin/export', icon: <Download size={20} />, label: 'Export Data' },
    { href: '/admin/konfigurasi', icon: <Settings size={20} />, label: 'Konfigurasi' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFF] selection:bg-blue-600 selection:text-white relative overflow-hidden">
      
      {/* 1. GLOBAL 3D BACKGROUND ENGINE */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-purple-400/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* 2. FLOATING SIDEBAR (THE NAVIGATION HUB) */}
      <aside 
        className={`fixed top-6 bottom-6 left-6 z-50 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isSidebarOpen ? 'w-72' : 'w-24'
        }`}
      >
        <div className="h-full bg-white/70 backdrop-blur-3xl border border-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] flex flex-col relative overflow-hidden">
          
          {/* Decorative Mesh in Sidebar */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-50" />

          {/* Sidebar Header: Logo Section */}
          <div className="p-8 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-4 group">
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0"
              >
                <span className="font-black italic text-xl">SE</span>
              </motion.div>
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col whitespace-nowrap"
                  >
                    <span className="font-black text-xl tracking-tighter text-slate-900 leading-none">Si-Eligible</span>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1 italic">Pro v2.0 Build</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* Toggle Button for Desktop */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-3 top-24 w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-xl hover:bg-blue-600 transition-colors z-50 md:flex hidden"
          >
            {isSidebarOpen ? <ChevronRight size={16} className="rotate-180" /> : <ChevronRight size={16} />}
          </button>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto no-scrollbar">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div 
                    whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center h-14 rounded-2xl transition-all duration-300 group ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="w-14 flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span 
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                          className="font-bold text-sm uppercase tracking-widest whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    
                    {/* Active Glow Dot */}
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav-glow"
                        className="absolute right-4 w-2 h-2 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,1)]" 
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer: Profile & Logout */}
          <div className="p-4 border-t border-slate-50 bg-slate-50/30">
            {session?.user && (
              <div className={`flex items-center gap-4 p-4 mb-4 rounded-3xl bg-white border border-slate-100 shadow-sm transition-all ${!isSidebarOpen && 'justify-center p-2'}`}>
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <UserCircle size={24} />
                </div>
                {isSidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs text-slate-800 truncate uppercase tracking-tighter">{session.user.name}</p>
                    <div className="flex items-center gap-1">
                      <Zap size={10} className="text-amber-500 fill-amber-500" />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        {session.user.role === 'admin' ? 'Super Admin' : 'Guru BK'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className={`w-full flex items-center h-14 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-black text-xs uppercase tracking-widest ${
                isSidebarOpen ? 'px-4 gap-4' : 'justify-center'
              }`}
            >
              <LogOut size={20} />
              {isSidebarOpen && <span>Sign Out System</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* 3. MAIN VIEWPORT (THE CONTENT CANVAS) */}
      <main 
        className={`relative z-10 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] min-h-screen ${
          isSidebarOpen ? 'pl-80 pr-6' : 'pl-36 pr-6'
        } py-8`}
      >
        {/* Dynamic Context Header (Innovative Feature) */}
        <header className="mb-8 flex items-center justify-between">
          <div className="hidden md:block">
             <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md rounded-2xl border border-white shadow-sm">
                <ShieldCheck size={14} className="text-blue-600" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Security Layer Active</span>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="px-5 py-2 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20">
                Live Data Monitoring
             </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {children}
        </motion.div>

        {/* Global Layout Footer */}
        <footer className="mt-20 py-8 text-center opacity-30 border-t border-slate-200">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
             Si-Eligible Integrated Professional Analytics Frame
           </p>
        </footer>
      </main>

      {/* CUSTOM CURSOR BLOB (DECORATIVE) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[30%] w-96 h-96 bg-indigo-300/10 rounded-full blur-[100px]" />
      </div>

    </div>
  );
}