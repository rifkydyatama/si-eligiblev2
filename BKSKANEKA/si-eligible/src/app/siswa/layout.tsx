'use client';

/**
 * ==============================================================================
 * SI-ELIGIBLE NEURAL LAYOUT v5.0.1 - STABLE PATCH
 * ==============================================================================
 * Style       : Alpha-Gen Professional 3D (Floating Dock)
 * Logic       : Fixed ShieldCheck & Code2 Reference Errors
 * Version     : Stable Build 2026.01
 * ==============================================================================
 */

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONOGRAPHY ENGINE (ALL REGISTERED) ---
import { 
  LayoutDashboard, 
  CheckSquare, 
  Target, 
  GraduationCap, 
  LogOut, 
  Cpu, 
  User,
  ChevronRight,
  Zap,
  ShieldCheck, // FIX: Sekarang sudah terdaftar
  Code2        // FIX: Sekarang sudah terdaftar
} from 'lucide-react';

export default function SiswaLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'siswa') {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading' || status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'siswa')) {
    return (
      <div className="min-h-screen bg-[#FDFEFF] flex flex-col items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-[6px] border-slate-100 border-t-purple-600 rounded-full shadow-2xl" 
        />
        <p className="mt-6 font-black text-slate-300 uppercase tracking-[0.3em] text-[10px] italic animate-pulse">
          Authorizing Neural Access...
        </p>
      </div>
    );
  }

  const menuItems = [
    { href: '/siswa/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/siswa/verifikasi-nilai', icon: CheckSquare, label: 'Verifikasi Nilai' },
    { href: '/siswa/peminatan', icon: Target, label: 'Peminatan Kampus' },
    { href: '/siswa/kelulusan', icon: GraduationCap, label: 'Lapor Kelulusan' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFEFF] text-slate-900 selection:bg-purple-600 selection:text-white">
      
      {/* 1. LAYER AMBIENT BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-5%] right-[-5%] w-[50%] h-[50%] bg-purple-400/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px]" />
      </div>

      {/* 2. SIDEBAR: NEURAL DOCK */}
      <aside className="fixed top-0 left-0 w-80 h-full p-8 z-50">
        <div className="w-full h-full bg-white border-4 border-white shadow-[0_30px_60px_rgba(0,0,0,0.05)] rounded-[3rem] flex flex-col relative overflow-hidden">
          
          {/* Logo Section */}
          <div className="p-10 pb-6">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:rotate-12 transition-all duration-500">
                <Cpu size={24} fill="currentColor" className="text-purple-500" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-black text-2xl tracking-tighter uppercase italic leading-none">
                  SI-ELI<span className="text-purple-600">GIBLE.</span>
                </span>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-300 mt-1">
                  Student Console v5.0.1
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 px-6 space-y-3 overflow-y-auto no-scrollbar pt-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center justify-between px-6 py-5 rounded-[2rem] transition-all duration-300 group ${
                      isActive 
                        ? 'bg-slate-950 text-white shadow-[0_15px_30px_rgba(0,0,0,0.15)]' 
                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon size={20} className={isActive ? 'text-purple-400' : 'text-slate-300 group-hover:text-purple-400'} />
                      <span className="font-black uppercase italic tracking-tighter text-[11px]">
                        {item.label}
                      </span>
                    </div>
                    {isActive && (
                      <motion.div layoutId="activeDot">
                        <Zap size={12} fill="currentColor" className="text-purple-400" />
                      </motion.div>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className="p-8 border-t-4 border-slate-50">
            <div className="bg-slate-50 rounded-[2rem] p-5 mb-4 flex items-center gap-4 border border-slate-100">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm border-2 border-white">
                  <User size={20} />
               </div>
               <div className="flex flex-col min-w-0 flex-1">
                  <p className="font-black text-xs uppercase tracking-tighter truncate text-slate-800 leading-none mb-1">
                    {session?.user?.name}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none italic">
                    Certified Siswa
                  </p>
               </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full h-14 bg-red-50 text-red-500 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all shadow-inner active:scale-95 group"
            >
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
              Terminal Logout
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-10 -left-10 opacity-[0.03] pointer-events-none">
             <Cpu size={200} />
          </div>
        </div>
      </aside>

      {/* 3. MAIN CONTENT AREA */}
      <main className="ml-80 min-h-screen p-10 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {/* Global Footer */}
        <footer className="mt-20 py-10 border-t-4 border-slate-50 flex items-center justify-between opacity-20">
           <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">
              SMKN 1 KADEMANGAN <span className="text-slate-200">/</span> NEURAL INFRASTRUCTURE v5.0
           </p>
           <div className="flex gap-4">
              <Zap size={14} />
              <ShieldCheck size={14} />
           </div>
        </footer>
      </main>
    </div>
  );
}