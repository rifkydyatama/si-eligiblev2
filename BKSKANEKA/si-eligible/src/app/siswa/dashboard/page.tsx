'use client';

/**
 * ==============================================================================
 * SI-ELIGIBLE SISWA INTELLIGENCE DASHBOARD v4.1 - STABLE BUILD
 * ==============================================================================
 * Style       : Alpha-Gen Professional 3D (Neat & Calibrated)
 * Logic       : Multi-Route API Sync + Live Database Timeline
 * Calibration : Optimized for 100% Desktop Scaling
 * Fixed       : ReferenceError Fingerprint & Consolidated Lucide Imports
 * ==============================================================================
 */

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONOGRAPHY ENGINE (ALL REGISTERED & VERIFIED) ---
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Target, 
  GraduationCap, 
  AlertCircle, 
  ChevronRight, 
  Code2, 
  Activity, 
  Clock, 
  CheckCircle2, 
  Zap,
  FileText,
  MapPin,
  Cpu,
  Sparkles,
  Database,
  Fingerprint, // FIX: Sekarang sudah di-import dengan benar
  Calendar,
  RefreshCcw,
  Download
} from 'lucide-react';

// --- UI COMPONENTS ---
import { Button } from "@/components/ui/button";

// --- INTERFACES ---
interface DashboardStats {
  nilaiVerified: number;
  totalNilai: number;
  peminatanFilled: boolean;
  kelulusanReported: boolean;
  sanggahanActive: number;
}

interface TimelineEntry {
  id: string;
  jalur: string;
  tanggalMulai: string;
  tanggalSelesai: string;
}

interface KIPKStatus {
  statusKIPK: boolean;
  mendaftarKIPK: boolean;
  canRegister: boolean;
}

export default function SiswaDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    nilaiVerified: 0,
    totalNilai: 0,
    peminatanFilled: false,
    kelulusanReported: false,
    sanggahanActive: 0
  });
  const [siswaInfo, setSiswaInfo] = useState<any>(null);
  const [timelines, setTimelines] = useState<TimelineEntry[]>([]);
  const [kipkStatus, setKipkStatus] = useState<KIPKStatus | null>(null);
  const [loadingKIPK, setLoadingKIPK] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- LOGIC: DATE & STATUS SYNC ---
  const getLiveStatus = (start: string, end: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (now >= startDate && now <= endDate) return 'open';
    return 'soon';
  };

  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const e = new Date(end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${s} - ${e}`;
  };

  // --- LOGIC: SECURE FETCH ENGINE (V4.1 STABLE) ---
  const fetchAllStats = useCallback(async () => {
    try {
      setLoading(true);
      
      const [nilaiRes, peminatanRes, kelulusanRes, timelineRes, kipkRes, sanggahanRes] = await Promise.all([
        fetch('/api/siswa/nilai'),
        fetch('/api/siswa/peminatan'),
        fetch('/api/siswa/kelulusan'),
        fetch('/api/siswa/timeline'),
        fetch('/api/siswa/mendaftar-kipk'),
        fetch('/api/siswa/sanggahan')
      ]);

      // 1. Process Nilai & Siswa Info
      if (nilaiRes.ok) {
        const resNilai = await nilaiRes.json();
        if (resNilai.success) {
          setSiswaInfo(resNilai.data.siswa);
          setStats(prev => ({ 
            ...prev, 
            totalNilai: resNilai.data.totalStats.totalNilai,
            nilaiVerified: resNilai.data.totalStats.verified 
          }));
        }
      }

      // 2. Process Peminatan
      if (peminatanRes.ok) {
        const resPeminatan = await peminatanRes.json();
        setStats(prev => ({ ...prev, peminatanFilled: resPeminatan.length > 0 }));
      }

      // 3. Process Kelulusan
      if (kelulusanRes.ok) {
        const resKelulusan = await kelulusanRes.json();
        // Check if array has items, not just !== null
        setStats(prev => ({ 
          ...prev, 
          kelulusanReported: Array.isArray(resKelulusan) && resKelulusan.length > 0 
        }));
      }

      // 4. Process Timeline Database
      if (timelineRes.ok) {
        const resTimeline = await timelineRes.json();
        setTimelines(resTimeline);
      }

      // 5. Process KIP-K Status
      if (kipkRes.ok) {
        const resKipk = await kipkRes.json();
        setKipkStatus(resKipk);
      }

      // 6. Process Sanggahan Active
      if (sanggahanRes.ok) {
        const resSanggahan = await sanggahanRes.json();
        const sanggahanData = resSanggahan.success ? resSanggahan.data : resSanggahan;
        const activeSanggahan = Array.isArray(sanggahanData) 
          ? sanggahanData.filter((s: any) => s.status === 'pending').length 
          : 0;
        setStats(prev => ({ ...prev, sanggahanActive: activeSanggahan }));
      }

    } catch (error) {
      console.error('Extraction Protocol Failure:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- LOGIC: Mendaftar KIP-K ---
  const handleDaftarKIPK = async (action: 'register' | 'cancel') => {
    try {
      setLoadingKIPK(true);
      
      const res = await fetch('/api/siswa/mendaftar-kipk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setKipkStatus(prev => prev ? { ...prev, mendaftarKIPK: data.mendaftarKIPK } : null);
      } else {
        alert(data.error || 'Gagal memproses pendaftaran KIP-K');
      }
    } catch (error) {
      console.error('Error mendaftar KIP-K:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoadingKIPK(false);
    }
  };

  useEffect(() => {
    if (session?.user) fetchAllStats();
  }, [session, fetchAllStats]);

  // --- RENDER: LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFEFF] flex flex-col items-center justify-center relative overflow-hidden">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-[8px] border-slate-100 border-t-blue-600 rounded-full shadow-2xl relative z-10" />
        <p className="mt-8 font-black text-slate-300 uppercase tracking-[0.4em] text-[10px] animate-pulse italic relative z-10">Synchronizing Global Protocol...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-8 lg:p-10 font-sans text-slate-900 relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* KINETIC AMBIENT LAYER */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-5%] right-[-5%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-indigo-400/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto">
        
        {/* --- HEADER NAVIGATION --- */}
        <header className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-4 mb-5">
              <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-[0_20px_40px_rgba(37,99,235,0.3)] transform hover:rotate-12 transition-all">
                <LayoutDashboard size={26} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 leading-none mb-1">Student Terminal v4.1</span>
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-2 uppercase">
                  <Code2 size={12} /> Secure Neural Session Active
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-950 leading-none uppercase italic">
              Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 underline decoration-8">{session?.user?.name?.split(' ')[0]}!</span> 👋
            </h1>
            
            {siswaInfo && (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="px-6 py-2.5 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl">
                   <Fingerprint size={16} className="text-blue-400" /> {siswaInfo.nisn}
                </div>
                <div className="px-6 py-2.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-3">
                   <ShieldCheck size={16} /> {siswaInfo.kelas} • {siswaInfo.jurusan}
                </div>
              </div>
            )}
          </motion.div>
        </header>

        {/* --- STATS GRID --- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <StatCard label="Verifikasi Rapor" value={`${stats.nilaiVerified}/${stats.totalNilai}`} icon={<FileText size={28} />} color="blue" desc="Status Validasi" />
          <StatCard label="Input Peminatan" value={stats.peminatanFilled ? "LENGKAP" : "BELUM"} icon={<Target size={28} />} color="purple" desc="Pilihan Kampus" />
          <StatCard label="Laporan Lulus" value={stats.kelulusanReported ? "TERKIRIM" : "NIHIL"} icon={<GraduationCap size={28} />} color="emerald" desc="Status Penerimaan" />
          <StatCard label="Sanggahan Aktif" value={stats.sanggahanActive} icon={<AlertCircle size={28} />} color="orange" desc="Anomali Nilai" />
        </section>

        {/* --- BENTO ACTION & TIMELINE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          
          <div className="lg:col-span-8 bg-white rounded-[4rem] p-10 md:p-14 border border-slate-50 shadow-xl group relative overflow-hidden">
            <div className="flex items-center gap-5 mb-12 relative z-10">
               <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shadow-inner group-hover:rotate-12 transition-all">
                  <Activity size={30} />
               </div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Aksi Cepat</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
               <QuickActionButton href="/siswa/verifikasi-nilai" icon="✅" title="Verifikasi Nilai" color="purple" />
               <QuickActionButton href="/siswa/peminatan" icon="🎯" title="Input Peminatan" color="blue" />
               <QuickActionButton href="/siswa/kelulusan" icon="🎓" title="Lapor Kelulusan" color="emerald" />
            </div>
            
            {/* KIP-K Section */}
            {kipkStatus && (
              <div className="mt-10 pt-10 border-t border-slate-100 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Status KIP-K</h3>
                    <p className="text-sm text-slate-500 font-bold italic">
                      {kipkStatus.statusKIPK ? 'Anda sudah terdaftar sebagai penerima KIP-K' : 
                       kipkStatus.mendaftarKIPK ? 'Anda sudah mendaftar, menunggu verifikasi' : 
                       'Daftar sekarang untuk mendapatkan bantuan KIP-K'}
                    </p>
                  </div>
                  <div className={`px-6 py-3 rounded-2xl font-black text-xs uppercase ${
                    kipkStatus.statusKIPK ? 'bg-orange-100 text-orange-600 border border-orange-200' :
                    kipkStatus.mendaftarKIPK ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' :
                    'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    {kipkStatus.statusKIPK ? '✅ PENERIMA' : 
                     kipkStatus.mendaftarKIPK ? '📝 MENDAFTAR' : 
                     '⭕ REGULER'}
                  </div>
                </div>
                
                {!kipkStatus.statusKIPK && (
                  <button
                    onClick={() => handleDaftarKIPK(kipkStatus.mendaftarKIPK ? 'cancel' : 'register')}
                    disabled={loadingKIPK}
                    className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                      kipkStatus.mendaftarKIPK 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {loadingKIPK ? (
                      <span className="flex items-center justify-center gap-2">
                        <RefreshCcw size={16} className="animate-spin" />
                        Memproses...
                      </span>
                    ) : (
                      kipkStatus.mendaftarKIPK ? '❌ Batalkan Pendaftaran' : '✅ Daftar KIP-K Sekarang'
                    )}
                  </button>
                )}
              </div>
            )}
            
            <div className="absolute -bottom-10 -right-10 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                <Cpu size={400} />
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-950 rounded-[4rem] p-10 md:p-12 text-white relative overflow-hidden flex flex-col group border-b-[15px] border-blue-600 shadow-2xl">
            <div className="flex items-center justify-between mb-12 relative z-10">
               <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Schedule.</h2>
               <div className="p-4 bg-white/10 backdrop-blur-3xl rounded-2xl group-hover:rotate-[360deg] transition-all duration-1000"><Clock size={30} className="text-blue-400" /></div>
            </div>
            <div className="space-y-6 relative z-10 mb-8">
              {timelines.length > 0 ? (
                timelines.map((item) => (
                  <TimelineItem key={item.id} label={item.jalur} date={formatDateRange(item.tanggalMulai, item.tanggalSelesai)} status={getLiveStatus(item.tanggalMulai, item.tanggalSelesai)} />
                ))
              ) : (
                <div className="py-14 text-center opacity-20 flex flex-col items-center gap-4">
                   <Database size={50} />
                   <p className="text-[10px] font-black uppercase tracking-[0.4em]">No Schedule Found</p>
                </div>
              )}
            </div>
            <div className="absolute top-0 right-0 w-[60%] h-full bg-blue-600/10 blur-[100px] pointer-events-none" />
          </div>

        </div>

        {/* --- GLOBAL FOOTER --- */}
        <footer className="mt-40 py-24 border-t-8 border-slate-950/5 flex flex-col md:flex-row items-center justify-between opacity-30 text-center md:text-left gap-12">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-6">
                <div className="w-20 h-1.5 bg-blue-600 rounded-full" />
                <p className="text-[20px] font-black uppercase tracking-[1em] text-slate-950">SMKN 1 KADEMANGAN</p>
            </div>
            <p className="text-[12px] font-bold text-slate-500 tracking-[0.4em] uppercase italic">Intelligence Infrastructure v4.1 Build Stable</p>
          </div>
          <div className="flex gap-16">
             <div className="flex flex-col items-center gap-4"><Cpu size={32} className="text-blue-600 shadow-inner"/><span className="text-[10px] font-black uppercase tracking-widest text-blue-900 leading-none">Neural-Core</span></div>
             <div className="flex flex-col items-center gap-4"><ShieldCheck size={32} className="text-indigo-600 shadow-inner"/><span className="text-[10px] font-black uppercase tracking-widest text-indigo-900 leading-none">Titan-Shield</span></div>
          </div>
        </footer>
      </main>

      {/* FLOAT WIDGET */}
      <div className="fixed bottom-12 right-12 z-50 hidden lg:block">
        <div className="bg-white/80 backdrop-blur-3xl border-4 border-white p-7 rounded-[3.5rem] shadow-2xl flex items-center gap-8 group hover:scale-105 transition-all">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl animate-bounce"><Sparkles size={24} /></div>
            <div className="pr-6">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Status Protocol</p>
                <p className="text-base font-black text-slate-950 uppercase italic tracking-tighter leading-none">Neural Bridge Online</p>
            </div>
        </div>
      </div>

    </div>
  );
}

// --- ATOMIC UI COMPONENTS ---

function StatCard({ label, value, icon, color, desc }: any) {
  const colorMap: any = {
    blue: "bg-blue-600",
    purple: "bg-purple-600",
    emerald: "bg-emerald-500",
    orange: "bg-amber-500",
  };

  return (
    <motion.div whileHover={{ y: -10 }} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] group transition-all overflow-hidden relative flex flex-col justify-between h-full min-h-[240px]">
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className={`w-16 h-16 ${colorMap[color]} text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-all duration-500`}>{icon}</div>
        <div className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Global Node</div>
      </div>
      <div className="relative z-10">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 leading-none italic">{label}</p>
        <div className="text-4xl font-black text-slate-950 tracking-tighter leading-none mb-5 uppercase">{value}</div>
        <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse border-2 border-white shadow-sm" />
            <p className="text-[12px] font-black text-slate-500 uppercase tracking-tight italic opacity-60">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

function QuickActionButton({ href, icon, title, color }: any) {
  const colorShadow = color === 'purple' ? 'shadow-[0_12px_0_0_#581c87]' : color === 'blue' ? 'shadow-[0_12px_0_0_#1e40af]' : 'shadow-[0_12px_0_0_#065f46]';
  const bgColor = color === 'purple' ? 'bg-purple-600' : color === 'blue' ? 'bg-blue-600' : 'bg-emerald-600';

  return (
    <a href={href} className="block group">
      <motion.div whileHover={{ y: -8 }} whileTap={{ scale: 0.95 }}
        className="p-8 bg-[#F8FAFC] border-4 border-white rounded-[3.5rem] shadow-xl hover:border-blue-200 transition-all text-center flex flex-col items-center justify-center"
      >
        <div className="text-5xl mb-6 transform group-hover:scale-125 transition-all duration-500 drop-shadow-xl">{icon}</div>
        <h3 className="font-black text-slate-800 uppercase italic tracking-tighter mb-8 leading-tight">{title}</h3>
        <div className={`h-14 w-full ${bgColor} ${colorShadow} text-white rounded-2xl flex items-center justify-center font-black text-[11px] uppercase tracking-[0.3em] active:translate-y-2 active:shadow-none transition-all`}>OPEN MODULE</div>
      </motion.div>
    </a>
  );
}

function TimelineItem({ label, date, status }: any) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-6 bg-white/5 rounded-[2.5rem] border border-white/5 group hover:bg-white/10 transition-all"
    >
      <div>
        <h3 className="font-black text-base uppercase italic tracking-tighter text-white mb-2.5">{label}</h3>
        <div className="flex items-center gap-2">
            <Calendar size={12} className="text-blue-400" />
            <p className="text-[10px] font-bold text-blue-400 tracking-[0.2em] uppercase italic">{date}</p>
        </div>
      </div>
      <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${status === 'open' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
        {status === 'open' ? 'DIBUKA' : 'SEGERA'}
      </span>
    </motion.div>
  );
}