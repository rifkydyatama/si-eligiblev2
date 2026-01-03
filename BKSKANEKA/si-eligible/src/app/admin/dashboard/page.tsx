'use client';

/**
 * ============================================================
 * SI-ELIGIBLE PROFESSIONAL ANALYTICS v2.0
 * ============================================================
 * Dashboard Admin - Alpha Generation Professional Edition
 * Developed with: Next.js, Tailwind CSS, Framer Motion, Lucide
 * Focus: 3D Claymorphism, Bento Grid, Real-time Database Sync
 * ============================================================
 */

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  Plus, 
  FileDown, 
  School, 
  Upload,
  ArrowUpRight,
  Zap,
  Clock,
  LayoutDashboard,
  MessageSquare,
  Search,
  Bell,
  Settings,
  MoreVertical,
  Activity,
  History,
  ShieldAlert,
  BarChart4,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ArrowDown
} from 'lucide-react';

// --- ANIMATION CONFIGURATIONS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 }
  }
};

// --- SUB-COMPONENTS ---
function AnomalyCard({ label, count }: { label: string; count: number }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm">
      <div className="text-3xl font-black text-red-600 mb-2">{count}</div>
      <div className="text-xs font-bold text-slate-600 uppercase tracking-wide">{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  // 1. STATE MANAGEMENT
  const [stats, setStats] = useState({
    totalSiswa: 0,
    totalKIPK: 0,
    totalMendaftarKIPK: 0,
    totalNeuralKIPK: 0,
    totalKelas12: 0,
    totalNilaiVerified: 0,
    totalSanggahanPending: 0,
    totalKelulusan: 0
  });
  
  const [anomalies, setAnomalies] = useState({
    totalAnomalies: 0,
    nisnDuplicates: 0,
    namaDuplicates: 0,
    emailDuplicates: 0,
    phoneDuplicates: 0,
    anomalies: []
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingRebuttals, setPendingRebuttals] = useState([]);
  const [academicYear, setAcademicYear] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 2. REAL-TIME LOGIC & SYNC
  useEffect(() => {
    // Sync Jam & Tahun Ajaran
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    setAcademicYear(month >= 7 ? `${year}/${year + 1}` : `${year - 1}/${year}`);

    // Initial Data Fetching
    fetchAllData();

    return () => clearInterval(timer);
  }, []);

  const fetchAllData = async () => {
    setIsRefreshing(true);
    try {
      // Sinkronisasi Statistik Utama
      const statsRes = await fetch('/api/admin/stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      // Sinkronisasi Deteksi Anomali
      const anomalyRes = await fetch('/api/admin/stats/anomalies');
      if (anomalyRes.ok) {
        const anomalyData = await anomalyRes.json();
        setAnomalies(anomalyData);
      }

      // Sinkronisasi Sanggahan Pending (Model Rebuttal)
      const rebuttalRes = await fetch('/api/admin/sanggahan?status=pending');
      if (rebuttalRes.ok) {
        const rebuttalData = await rebuttalRes.json();
        setPendingRebuttals(rebuttalData);
      }

      // Sinkronisasi Aktivitas Terkini (Model AuditLog)
      // (Asumsi endpoint ini mengembalikan data prisma.auditLog.findMany)
      const activityRes = await fetch('/api/admin/activities');
      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setRecentActivities(activityData);
      }
    } catch (error) {
      console.error('Database Sync Error:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-8 font-sans text-slate-900 relative">
      
      {/* DEKORASI BACKGROUND LAYER (3D AMBIENT) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/10 rounded-full blur-[150px] animate-pulse delay-1000" />
      </div>

      <main className="relative z-10 max-w-[1600px] mx-auto">
        
        {/* TOP BAR / NAVIGATION HEADER */}
        <section className="mb-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/60 shadow-sm">
          <div className="flex items-center gap-6">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20"
            >
              <LayoutDashboard size={28} />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Pro Panel</span>
                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">v2.0 Stable Build</span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900">
                Pusat Kontrol <span className="text-blue-600 italic">Si-Eligible.</span>
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Real-time Watch Widget */}
            <div className="flex items-center gap-4 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <Clock className="text-blue-500" size={20} />
              <div className="text-left">
                <div className="text-sm font-black leading-none text-slate-800">
                  {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                  TA {academicYear}
                </div>
              </div>
            </div>

            <button 
              onClick={fetchAllData}
              disabled={isRefreshing}
              className={`p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all active:scale-90 ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <History size={20} className="text-slate-400" />
            </button>
            
            <Link href="/admin/settings">
              <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-xl hover:bg-blue-600 transition-all cursor-pointer">
                <Settings size={20} />
              </div>
            </Link>
          </div>
        </section>

        {/* STATS ANALYTICS GRID (3D CLAYMORPHISM) */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <StatCard 
            label="Database Siswa" 
            value={stats.totalSiswa} 
            icon={<Users size={32} />} 
            color="blue" 
            sub="Siswa Terdaftar"
          />
          <StatCard 
            label="Verifikasi Data" 
            value={stats.totalNilaiVerified} 
            icon={<CheckCircle2 size={32} />} 
            color="emerald" 
            sub="Rapor Valid"
          />
          <StatCard 
            label="Antrian Sanggah" 
            value={stats.totalSanggahanPending} 
            icon={<ShieldAlert size={32} />} 
            color="orange" 
            sub="Butuh Review"
          />
          <StatCard 
            label="Proyeksi SNBP" 
            value={stats.totalKelulusan} 
            icon={<GraduationCap size={32} />} 
            color="purple" 
            sub="Siswa Eligible"
          />
        </motion.section>

        {/* DATA ANOMALY DETECTION SECTION */}
        {anomalies.totalAnomalies > 0 && (
          <motion.section 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="mb-12 bg-gradient-to-br from-red-50 to-orange-50 rounded-[3rem] p-10 border border-red-200 shadow-[0_20px_50px_rgba(239,68,68,0.1)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-red-500 text-white rounded-3xl shadow-lg shadow-red-500/30">
                  <AlertCircle size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-red-900 tracking-tight">Anomali Data Terdeteksi</h2>
                  <p className="text-red-600 font-bold text-sm mt-1">Sistem mendeteksi {anomalies.totalAnomalies} potensi duplikasi atau inkonsistensi data</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <AnomalyCard label="NISN Duplikat" count={anomalies.nisnDuplicates} />
              <AnomalyCard label="Nama Duplikat" count={anomalies.namaDuplicates} />
              <AnomalyCard label="Email Duplikat" count={anomalies.emailDuplicates} />
              <AnomalyCard label="Telepon Duplikat" count={anomalies.phoneDuplicates} />
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {anomalies.anomalies.map((anomaly: any, idx: number) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        anomaly.type === 'NISN_DUPLICATE' ? 'bg-red-100 text-red-700' :
                        anomaly.type === 'NAMA_DUPLICATE' ? 'bg-orange-100 text-orange-700' :
                        anomaly.type === 'EMAIL_DUPLICATE' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {anomaly.type.replace('_', ' ')}
                      </span>
                      <span className="font-bold text-slate-700">{anomaly.value}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-400">{anomaly.count} data</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {anomaly.students.map((student: any) => (
                      <Link 
                        key={student.id} 
                        href={`/admin/siswa/${student.id}`}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                      >
                        <div>
                          <div className="font-bold text-slate-800">{student.nama}</div>
                          <div className="text-xs text-slate-500 font-mono">{student.nisn}</div>
                          {student.email && <div className="text-xs text-blue-600 mt-1">{student.email}</div>}
                          {student.noTelepon && <div className="text-xs text-green-600">{student.noTelepon}</div>}
                        </div>
                        <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* CORE BENTO INTERFACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* BENTO LARGE: QUICK ACTIONS & SYSTEM TOOLS */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-8 bg-white rounded-[3rem] p-10 border border-slate-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Tools & Akses Cepat</h2>
                <p className="text-slate-400 font-bold text-sm italic">Manajemen data terintegrasi</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-500">
                <Zap size={24} fill="currentColor" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
              <ActionButton href="/admin/siswa/tambah" icon={<Plus size={32} />} label="Siswa Baru" color="blue" />
              <ActionButton href="/admin/siswa/import" icon={<Upload size={32} />} label="Import Excel" color="emerald" />
              <ActionButton href="/admin/kampus/tambah" icon={<School size={32} />} label="Update Kampus" color="purple" />
              <ActionButton href="/admin/export" icon={<FileDown size={32} />} label="Export Data" color="orange" />
            </div>

            {/* Background Accent */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50" />
          </motion.div>

          {/* BENTO SMALL: SYSTEM HEALTH MONITOR */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-4 bg-gradient-to-br from-indigo-600 to-blue-800 rounded-[3rem] p-10 text-white relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl">
                <Activity size={32} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Status Server</p>
                <div className="flex items-center gap-2 justify-end">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                  <span className="font-bold text-sm">Online</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-4xl font-black italic tracking-tighter leading-none mb-4 uppercase">Sync <br /> Optimized</h3>
              <p className="font-medium opacity-70 text-sm leading-relaxed">Sistem terhubung ke database MySQL dengan performa latensi 12ms.</p>
            </div>

            <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
              Detail Performa
            </button>
          </motion.div>

          {/* BENTO MID: RECENT ACTIVITIES (FROM AUDITLOG) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-7 bg-white rounded-[3rem] p-10 border border-slate-50 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black flex items-center gap-4 uppercase tracking-tighter">
                <TrendingUp className="text-blue-600" /> Aktivitas Sistem
              </h2>
              <button className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">Lihat Semua</button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.length > 0 ? recentActivities.map((log: any, idx) => (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  key={log.id} 
                  className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] hover:bg-slate-100 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100 group-hover:rotate-6 transition-transform font-black text-blue-600">
                      {(log.admin?.name || log.student?.name || 'S').charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 leading-none mb-1 text-base">
                        {log.admin?.name || log.student?.name || 'Automated System'}
                      </p>
                      <p className="text-sm font-bold text-slate-400 line-clamp-1 italic">{log.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-300 uppercase tracking-tighter mb-1">
                      {new Date(log.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-[10px] px-2 py-0.5 bg-white text-slate-400 rounded-md font-bold">{log.ipAddress || 'Internal'}</div>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-16">
                  <BarChart4 size={48} className="mx-auto text-slate-100 mb-4" />
                  <p className="text-slate-400 font-bold italic">Belum ada log aktivitas masuk.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* BENTO MID: PENDING REBUTTALS (FROM REBUTTAL) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 bg-[#FFF9F0] rounded-[3rem] p-10 border border-amber-100 shadow-[0_15px_40px_rgba(251,191,36,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-amber-950 uppercase tracking-tighter">Sanggahan</h2>
              <div className="px-4 py-1.5 bg-amber-500 text-white rounded-full font-black text-xs animate-bounce shadow-lg shadow-amber-500/20">
                {stats.totalSanggahanPending} NEW
              </div>
            </div>
            
            <div className="space-y-5">
              {pendingRebuttals.length > 0 ? pendingRebuttals.map((rebuttal: any, idx) => (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  key={rebuttal.id} 
                  className="bg-white p-6 rounded-[2.5rem] border border-amber-50 shadow-sm flex flex-col gap-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">
                        {rebuttal.student?.name?.charAt(0)}
                      </div>
                      <p className="font-black text-slate-800 tracking-tight">{rebuttal.student?.name}</p>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-1 bg-amber-50 text-amber-600 rounded-lg">Pending</span>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-xs font-bold text-slate-500 line-clamp-2 leading-relaxed italic">
                      &quot;{rebuttal.description}&quot;
                    </p>
                  </div>

                  <Link href={`/admin/rebuttals`}>
                    <button className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_8px_0_0_#d97706] active:shadow-none active:translate-y-2 flex items-center justify-center gap-3">
                      Validasi Data <ChevronRight size={14} />
                    </button>
                  </Link>
                </motion.div>
              )) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-amber-200" />
                  </div>
                  <p className="text-amber-900/40 font-black uppercase tracking-widest text-xs">Semua bersih!</p>
                </div>
              )}
            </div>
          </motion.div>

        </div>

        {/* BOTTOM SECTION: SYSTEM FOOTER */}
        <footer className="py-12 flex flex-col md:flex-row items-center justify-between border-t border-slate-100 opacity-60">
          <div className="text-sm font-black uppercase tracking-widest text-slate-400">
            &copy; {new Date().getFullYear()} SMKN 1 Kademangan - Professional Analytics
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400 mt-6 md:mt-0">
            <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-blue-600 transition-colors">API Endpoint</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Security Audit</a>
          </div>
        </footer>
      </main>

      {/* FLOAT ACTION BUTTON (ADD SISWA QUICK ACCESS) */}
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-10 right-10 z-50 lg:hidden"
      >
        <button className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center">
          <Plus size={32} />
        </button>
      </motion.div>

    </div>
  );
}

// --- COMPLEX REUSABLE SUB-COMPONENTS ---

function StatCard({ label, value, icon, color, sub }: any) {
  const colorStyles = {
    blue: "bg-blue-600 shadow-blue-500/20",
    emerald: "bg-emerald-500 shadow-emerald-500/20",
    orange: "bg-orange-500 shadow-orange-500/20",
    purple: "bg-purple-600 shadow-purple-500/20",
  };

  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -10 }}
      className="p-10 rounded-[3rem] bg-white border border-slate-50 shadow-[0_15px_40px_rgba(0,0,0,0.02)] group relative overflow-hidden cursor-default"
    >
      <div className={`w-16 h-16 ${colorStyles[color as keyof typeof colorStyles]} text-white rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:rotate-[15deg] transition-all duration-500`}>
        {icon}
      </div>
      <div className="text-6xl font-black text-slate-900 tracking-tighter mb-2 leading-none">
        {(value ?? 0).toLocaleString()}
      </div>
      <div>
        <div className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">{label}</div>
        <p className="text-[10px] font-bold text-slate-300 uppercase">{sub}</p>
      </div>

      {/* Internal Decor Blur */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-[0.03] bg-slate-900 group-hover:scale-150 transition-transform duration-700`} />
    </motion.div>
  );
}

function ActionButton({ href, icon, label, color }: any) {
  const borderStyles = {
    blue: "border-blue-50 hover:border-blue-500 hover:bg-blue-50/50 text-blue-600",
    emerald: "border-emerald-50 hover:border-emerald-500 hover:bg-emerald-50/50 text-emerald-600",
    purple: "border-purple-50 hover:border-purple-500 hover:bg-purple-50/50 text-purple-600",
    orange: "border-orange-50 hover:border-orange-500 hover:bg-orange-50/50 text-orange-600",
  };

  return (
    <Link href={href} className="block">
      <motion.div 
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className={`p-8 border-2 ${borderStyles[color as keyof typeof borderStyles]} rounded-[2.5rem] flex flex-col items-center justify-center transition-all group h-full shadow-sm hover:shadow-xl`}
      >
        <div className="mb-6 group-hover:rotate-12 transition-transform duration-300">{icon}</div>
        <h3 className="font-black text-slate-900 text-xs text-center leading-tight tracking-[0.1em] uppercase">{label}</h3>
        <ArrowUpRight size={14} className="mt-4 opacity-0 group-hover:opacity-40 transition-opacity" />
      </motion.div>
    </Link>
  );
}