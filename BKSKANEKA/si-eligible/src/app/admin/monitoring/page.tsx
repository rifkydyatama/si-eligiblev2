'use client';

/**
 * ==============================================================================
 * SI-ELIGIBLE ALUMNI MONITORING COMMAND CENTER v3.4 - REFINED UI
 * ==============================================================================
 * Module      : Alumni Analytics & Graduation Tracking
 * Style       : Alpha-Gen Professional 3D (Clean & Symmetric)
 * Logic       : Dynamic Statistical Mapping & Visualization
 * Calibration : Optimized for 100% Desktop Scaling
 * Fixed       : ReferenceError Button & Layout Alignment
 * ==============================================================================
 */

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONOGRAPHY ENGINE (Lucide Assets) ---
import { 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Target, 
  BarChart4, 
  MapPin, 
  School, 
  Award, 
  Activity, 
  Zap, 
  Clock, 
  Cpu, 
  ShieldCheck, 
  Code2, 
  Sparkles,
  ChevronRight,
  PieChart,
  LayoutDashboard,
  Database,
  ArrowUpRight,
  History,
  FileText,
  Share2
} from 'lucide-react';

// --- UI COMPONENTS ---
import { Button } from "@/components/ui/button";

// --- DATA SCHEMATICS ---
interface MonitoringStats {
  totalSiswa: number;
  totalKelulusan: number;
  totalPeminatan: number;
  kelulusanByMonth: Array<{ month: string; count: number }>;
  kelulusanByKampusType: Array<{ jenisKampus: string; count: number }>;
  kelulusanByJurusan: Array<{ namaJurusan: string; count: number }>;
  topKampus: Array<{ namaKampus: string; count: number }>;
}

export default function MonitoringPage() {
  // 1. CORE STATE MANAGEMENT
  const [stats, setStats] = useState<MonitoringStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [academicYear, setAcademicYear] = useState("");

  // 2. INITIALIZATION ENGINE (SAFE-SYNC)
  const fetchMonitoringData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/monitoring');
      
      // Keamanan: Validasi format JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Data Format Error: Server returned non-JSON response.");
      }

      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Anomali transmisi data monitoring:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Sync Jam & Tahun Ajaran Otomatis
    const now = new Date();
    const period = now.getMonth() + 1 >= 7 
      ? `${now.getFullYear()}/${now.getFullYear() + 1}` 
      : `${now.getFullYear() - 1}/${now.getFullYear()}`;
    setAcademicYear(period);
    
    fetchMonitoringData();
  }, [fetchMonitoringData]);

  // 3. RENDER: LOADING STATE (NEURAL ANALYTICS)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFEFF] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-400 via-transparent to-transparent blur-3xl animate-pulse" />
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-[6px] border-slate-100 border-t-purple-600 rounded-full shadow-xl shadow-purple-500/10" 
        />
        <p className="mt-8 font-black text-slate-300 uppercase tracking-[0.4em] text-[10px] animate-pulse italic">
          Synchronizing Neural Data...
        </p>
      </div>
    );
  }

  // 4. RENDER: ERROR STATE
  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFEFF] p-8">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center p-14 bg-white rounded-[3rem] shadow-2xl border border-slate-100 max-w-lg">
          <Database size={64} className="mx-auto text-slate-200 mb-8" />
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-4 leading-none">Sync Protocol Failed</h2>
          <p className="text-slate-400 font-bold mb-10 text-sm leading-relaxed italic uppercase tracking-widest">Pusat data tidak memberikan respon valid.</p>
          <Button onClick={() => window.location.reload()} className="h-16 px-10 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
            Retry Connection
          </Button>
        </motion.div>
      </div>
    );
  }

  const graduationRate = stats.totalSiswa > 0 ? ((stats.totalKelulusan / stats.totalSiswa) * 100).toFixed(1) : '0';

  // 5. MAIN INTERFACE (CALIBRATED FOR 100% ZOOM)
  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-8 lg:p-10 font-sans text-slate-900 relative overflow-x-hidden selection:bg-purple-600 selection:text-white">
      
      {/* KINETIC AMBIENT ENGINE */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-400/10 rounded-full blur-[140px] animate-pulse delay-700" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto">
        
        {/* --- HEADER: ALPHA COMMAND CENTER --- */}
        <header className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-4 mb-5">
              <div className="p-4 bg-purple-600 rounded-[1.25rem] text-white shadow-[0_20px_40px_rgba(147,51,234,0.3)] transform hover:rotate-12 transition-all">
                <LayoutDashboard size={26} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-600 leading-none mb-1">Architecture v3.4</span>
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-2 uppercase">
                  <Code2 size={12} /> Neural Analytic Session Active
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-950 leading-none uppercase italic">
              Monitoring <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 underline decoration-8">Alumni.</span>
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="px-6 py-2.5 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-100 flex items-center gap-2 shadow-sm">
                <ShieldCheck size={16} /> Integrated TA {academicYear}
              </div>
              <div className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
                <Activity size={16} className="text-emerald-400 animate-pulse" /> Live Feed Active
              </div>
            </div>
          </motion.div>

          {/* 3D ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-5">
            <motion.button 
              whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => window.print()}
              className="px-10 h-18 bg-white border-2 border-slate-100 text-slate-800 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-[0_12px_0_0_#e2e8f0] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-3 group"
            >
              <FileText size={20} className="text-purple-600 group-hover:rotate-12 transition-transform" /> Generate PDF Report
            </motion.button>
          </div>
        </header>

        {/* --- SECTION 1: GLOBAL STATS GRID --- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <StatCard 
            label="Total Population" 
            value={stats.totalSiswa.toLocaleString()} 
            icon={<Users size={28} />} 
            color="blue" 
            desc="Siswa Terdaftar" 
          />
          <StatCard 
            label="Successful Graduation" 
            value={stats.totalKelulusan.toLocaleString()} 
            icon={<GraduationCap size={28} />} 
            color="emerald" 
            desc="Total Alumni Lulus" 
          />
          <StatCard 
            label="College Pipeline" 
            value={stats.totalPeminatan.toLocaleString()} 
            icon={<Target size={28} />} 
            color="purple" 
            desc="Total Pilihan Prodi" 
          />
          <StatCard 
            label="Performance Rate" 
            value={graduationRate + '%'} 
            icon={<TrendingUp size={28} />} 
            color="orange" 
            desc="Indeks Keberhasilan" 
          />
        </section>

        {/* --- SECTION 2: ANALYTIC BENTO GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          
          {/* GRADUATION TREND (MEGA BENTO) */}
          <div className="lg:col-span-8 bg-white rounded-[4rem] p-10 md:p-14 border border-slate-50 shadow-[0_40px_80px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:border-purple-200 transition-all">
            <div className="flex items-center justify-between mb-14 relative z-10">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-2 leading-none italic">Temporal Analysis</h3>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Trend Kelulusan Bulanan</h2>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 shadow-inner group-hover:rotate-12 transition-transform duration-500">
                <BarChart4 size={30} />
              </div>
            </div>
            
            <div className="space-y-8 relative z-10">
              {stats.kelulusanByMonth.map((item, index) => {
                const maxCount = Math.max(...stats.kelulusanByMonth.map(m => m.count));
                const percentage = (item.count / (maxCount || 1)) * 100;
                return (
                  <div key={index} className="group/row">
                    <div className="flex items-center justify-between mb-3 px-2">
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] italic">{item.month}</span>
                      <span className="text-sm font-black text-slate-950 bg-white px-4 py-1.5 rounded-xl border-2 border-slate-50 shadow-sm">{item.count} <span className="text-[10px] opacity-40 ml-1 italic font-bold text-slate-400">ALUMNI</span></span>
                    </div>
                    <div className="h-5 bg-[#F8FAFC] rounded-full overflow-hidden shadow-inner border border-slate-50">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${percentage}%` }} 
                        transition={{ duration: 1.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full relative"
                      >
                         <div className="absolute inset-0 bg-white/30 animate-pulse" />
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 pointer-events-none">
                <TrendingUp size={400} className="text-blue-900" />
            </div>
          </div>

          {/* TOP TARGET CAMPUS (NIGHT THEME BENTO) */}
          <div className="lg:col-span-4 bg-slate-950 rounded-[4rem] p-10 md:p-12 text-white relative overflow-hidden flex flex-col group border-b-[15px] border-purple-600 shadow-2xl">
            <div className="flex items-center justify-between mb-12 relative z-10">
               <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400 mb-2 leading-none italic">Intel Ranking</h3>
                <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Top Campus</h2>
               </div>
               <div className="p-4 bg-white/10 backdrop-blur-2xl rounded-2xl group-hover:rotate-[360deg] transition-all duration-1000">
                  <Award size={32} className="text-amber-400" />
               </div>
            </div>
            
            <div className="space-y-5 relative z-10 mb-10">
              {stats.topKampus.slice(0, 6).map((kampus, index) => (
                <motion.div 
                  key={index} 
                  initial={{ x: 20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-5 bg-white/5 rounded-3xl hover:bg-white/10 transition-all border border-white/5 group/item"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center font-black text-sm shadow-xl shadow-purple-500/20 group-hover/item:rotate-12 transition-transform">
                      {index + 1}
                    </div>
                    <span className="text-sm font-black tracking-tight uppercase italic line-clamp-1">{kampus.namaKampus}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-purple-300 tracking-tighter leading-none">{kampus.count}</span>
                    <p className="text-[8px] font-black opacity-40 uppercase tracking-widest">Verified</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-auto relative z-10 pt-4">
                <Button variant="ghost" className="w-full h-16 bg-white/5 hover:bg-white/15 border-none rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] text-purple-200 shadow-inner group">
                    ACCESS FULL REPOSITORY <ArrowUpRight size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
            </div>

            <div className="absolute top-0 right-0 w-[60%] h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent blur-[100px] pointer-events-none" />
          </div>

          {/* DISTRIBUTION ANALYTICS (BENTO MID) */}
          <div className="lg:col-span-5 bg-white rounded-[4rem] p-12 border border-slate-50 shadow-xl group overflow-hidden relative">
             <div className="flex items-center gap-5 mb-14 relative z-10">
                <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                    <PieChart size={30} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Institutional Type</h3>
             </div>

             <div className="space-y-10 relative z-10">
                {stats.kelulusanByKampusType.map((item, index) => {
                  const maxCount = Math.max(...stats.kelulusanByKampusType.map(k => k.count));
                  const percentage = (item.count / (maxCount || 1)) * 100;
                  return (
                    <div key={index} className="space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{item.jenisKampus}</span>
                            <span className="text-xl font-black text-blue-600 tracking-tighter">{item.count} <span className="text-[9px] text-slate-400">Siswa</span></span>
                        </div>
                        <div className="h-3.5 bg-[#F8FAFC] rounded-full shadow-inner relative overflow-hidden border border-slate-50">
                            <motion.div 
                                initial={{ width: 0 }} animate={{ width: `${percentage}%` }}
                                transition={{ duration: 2, delay: index * 0.15, ease: "anticipate" }}
                                className="h-full bg-blue-600 rounded-full shadow-lg shadow-blue-600/20" 
                            />
                        </div>
                    </div>
                  )
                })}
             </div>
             <div className="absolute -bottom-10 -left-10 opacity-[0.02] group-hover:rotate-12 transition-all duration-1000 pointer-events-none">
                <School size={280} className="text-blue-900" />
             </div>
          </div>

          {/* MAJOR RANKING (BENTO LARGE) */}
          <div className="lg:col-span-7 bg-white rounded-[4rem] p-10 md:p-14 border border-slate-50 shadow-xl group relative overflow-hidden">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-14 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-amber-50 rounded-2xl text-amber-500 transform group-hover:rotate-[20deg] transition-all">
                        <Zap size={30} fill="currentColor" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Popular Program Studi</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Analysis of top 10 choices</p>
                    </div>
                </div>
                <div className="px-6 py-2.5 bg-slate-50 rounded-full border border-slate-100 flex items-center gap-3">
                   <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic leading-none">Hot Picks</span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                {stats.kelulusanByJurusan.slice(0, 10).map((jurusan, index) => (
                    <motion.div 
                      key={index} 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-6 bg-[#F8FAFC] rounded-[2.5rem] border border-slate-100 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/5 transition-all group/item"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center font-black text-sm text-amber-600 shadow-sm border border-slate-100 group-hover/item:bg-amber-500 group-hover/item:text-white transition-all duration-300">
                                {index + 1}
                            </div>
                            <span className="text-[12px] font-black text-slate-700 uppercase tracking-tight leading-tight line-clamp-2 max-w-[140px] italic">{jurusan.namaJurusan}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-slate-950 tracking-tighter leading-none">{jurusan.count}</span>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Students</p>
                        </div>
                    </motion.div>
                ))}
             </div>
             <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-amber-500/5 blur-[100px] pointer-events-none" />
          </div>
        </div>

        {/* --- SYSTEM FOOTER: ALPHA BRANDING --- */}
        <footer className="mt-40 py-24 border-t-8 border-slate-950/5 flex flex-col md:flex-row items-center justify-between opacity-30 text-center md:text-left gap-12">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-6">
                <div className="w-20 h-1.5 bg-purple-600 rounded-full" />
                <p className="text-[20px] font-black uppercase tracking-[1em] text-slate-950 leading-none">SMKN 1 KADEMANGAN</p>
            </div>
            <p className="text-[12px] font-bold text-slate-500 tracking-[0.4em] uppercase italic leading-none">Infrastructure Intelligence Monitoring Core v3.4 Refined</p>
          </div>
          <div className="flex gap-16">
             <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-purple-50 rounded-2xl text-purple-600 shadow-inner">
                    <Cpu size={32} /> 
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] leading-none text-purple-900">Neural-Core</span>
             </div>
             <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shadow-inner">
                    <ShieldCheck size={32} /> 
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] leading-none text-blue-900">Titan-Shield</span>
             </div>
          </div>
        </footer>
      </main>

      {/* FLOATING SYNC INTERFACE */}
      <div className="fixed bottom-12 right-12 z-50 hidden lg:block">
        <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 1, type: "spring", stiffness: 100 }}
            className="bg-white/80 backdrop-blur-3xl border-4 border-white p-7 rounded-[3.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.15)] flex items-center gap-8 group cursor-pointer"
        >
            <div className="w-16 h-16 bg-purple-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-[0_15px_30px_rgba(147,51,234,0.3)] animate-bounce group-hover:scale-110 transition-transform">
                <Share2 size={24} />
            </div>
            <div className="pr-10 border-r border-slate-100">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none mb-2 italic">Global Integrity</p>
                <p className="text-base font-black text-slate-950 uppercase italic tracking-tighter leading-none">Safe Sync Protocol</p>
            </div>
            <div className="flex flex-col items-end">
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Active Stream</p>
                <div className="flex gap-1.5">
                    {[1,2,3].map(i => <motion.div key={i} animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />)}
                </div>
            </div>
        </motion.div>
      </div>

    </div>
  );
}

// --- SUB-COMPONENT: REFINED STAT CARD ---

function StatCard({ label, value, icon, color, desc }: any) {
  const colorMap: any = {
    blue: "bg-blue-600 shadow-blue-600/30 text-white",
    emerald: "bg-emerald-500 shadow-emerald-600/30 text-white",
    purple: "bg-purple-600 shadow-purple-600/30 text-white",
    orange: "bg-amber-500 shadow-amber-600/30 text-white",
  };

  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] group transition-all overflow-hidden relative flex flex-col justify-between h-full min-h-[220px]"
    >
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className={`w-16 h-16 ${colorMap[color]} rounded-[1.5rem] flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500`}>
          {icon}
        </div>
        <div className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Global Node</div>
      </div>
      <div className="relative z-10">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 leading-none italic">{label}</p>
        <div className="text-5xl font-black text-slate-950 tracking-tighter leading-none mb-5 italic">{value}</div>
        <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse border-2 border-white shadow-sm" /> 
            <p className="text-[12px] font-black text-slate-500 uppercase tracking-tight italic opacity-60">{desc}</p>
        </div>
      </div>
      
      {/* Visual Depth Background */}
      <div className="absolute -bottom-10 -right-10 opacity-[0.03] transform rotate-12 group-hover:scale-150 transition-all duration-1000 group-hover:text-purple-600 pointer-events-none">
        {icon}
      </div>
    </motion.div>
  );
}