'use client';

/**
 * ==============================================================================
 * SI-ELIGIBLE CAMPUS INTELLIGENCE CENTER v3.3 - NEAT ALPHA
 * ==============================================================================
 * Module      : Campus & Program Analytic Detail
 * Style       : Alpha-Gen Professional 3D (Neat & Calibrated)
 * Logic       : Integrated CRUD Engine with Safe-Fetch Protocol
 * Calibration : Optimized for 100% Desktop Scaling (Golden Ratio)
 * ==============================================================================
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONOGRAPHY ENGINE ---
import { 
  Building2, ArrowLeft, Plus, Trash2, Globe, MapPin, Award, 
  ShieldCheck, Cpu, Zap, Clock, ExternalLink, Layers, 
  GraduationCap, Activity, Settings2, PencilLine, 
  AlertCircle, ArrowUpRight, UserCheck, CheckCircle2,
  Info, Database, Sparkles, LayoutDashboard, Share2,
  History, Code2
} from 'lucide-react';

import { Button } from "@/components/ui/button";

// --- DATA SCHEMATICS ---
interface Kampus {
  id: string;
  kodeKampus: string;
  namaKampus: string;
  jenisKampus: string;
  kategoriJalur: string;
  akreditasi: string | null;
  provinsi: string;
  kota: string;
  website: string | null;
  logoUrl: string | null;
  isActive: boolean;
  tahunUpdate: string;
  jurusan: Jurusan[];
}

interface Jurusan {
  id: string;
  kodeJurusan: string;
  namaJurusan: string;
  jenjang: string;
  fakultas: string;
  akreditasi: string | null;
  isActive: boolean;
}

export default function DetailKampusPage() {
  // 1. SYSTEM HOOKS
  const params = useParams();
  const router = useRouter();
  
  // 2. STATE ARCHITECTURE
  const [kampus, setKampus] = useState<Kampus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [academicYear, setAcademicYear] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // 3. INTERNAL UTILS: Academic Year Sync
  const syncAcademicPeriod = useCallback(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const period = month >= 7 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
    setAcademicYear(period);
  }, []);

  // 4. DATA FETCHING ENGINE (SAFE-FETCH PROTOCOL)
  const fetchCampusMetadata = useCallback(async () => {
    if (!params?.id) return;

    try {
      setLoading(true);
      setError('');
      
      const res = await fetch(`/api/admin/kampus/${params.id}`);
      
      // Mencegah error "Unexpected token <" dengan validasi JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Format data tidak valid (Bukan JSON).");
      }

      if (res.ok) {
        const data = await res.json();
        setKampus(data);
      } else {
        setError('Gagal sinkronisasi pusat data.');
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Anomali Jaringan: Gagal memuat metadata.');
    } finally {
      setLoading(false);
    }
  }, [params]);

  // 5. SYSTEM INITIALIZATION
  useEffect(() => {
    syncAcademicPeriod();
    fetchCampusMetadata();
  }, [fetchCampusMetadata, syncAcademicPeriod]);

  // 6. ACTION HANDLERS: DELETE
  const handleDeleteJurusan = async (jurusanId: string, nama: string) => {
    if (!confirm(`TINDAKAN KRITIS: Hapus permanen Program Studi "${nama}"?`)) return;

    setIsDeleting(jurusanId);
    try {
      const res = await fetch(`/api/admin/kampus/${params.id}/jurusan/${jurusanId}`, { 
        method: 'DELETE' 
      });

      if (res.ok) {
        await fetchCampusMetadata();
      } else {
        alert('Gagal mengeksekusi protokol penghapusan.');
      }
    } catch (error) {
      alert('Sistem sedang sibuk.');
    } finally {
      setIsDeleting(null);
    }
  };

  // 7. RENDER: LOADING VIEW
  if (loading && !kampus) {
    return (
      <div className="min-h-screen bg-[#FDFEFF] flex flex-col items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-[6px] border-slate-100 border-t-blue-600 rounded-full shadow-lg" 
        />
        <p className="mt-6 font-black text-slate-300 uppercase tracking-[0.3em] text-sm animate-pulse italic">
          Neural Syncing...
        </p>
      </div>
    );
  }

  // 8. RENDER: ERROR STATE
  if (error || !kampus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFEFF] p-6">
        <div className="text-center p-10 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-lg">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-6" />
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-4">Metadata Failure</h2>
          <p className="text-slate-400 text-sm mb-8 font-medium italic">{error}</p>
          <Button onClick={() => router.push('/admin/kampus')} className="bg-slate-900 rounded-2xl w-full h-12 uppercase tracking-widest font-black text-xs">Kembali ke Repositori</Button>
        </div>
      </div>
    );
  }

  // 9. MAIN INTERFACE (GOLDEN RATIO CALIBRATION)
  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-8 lg:p-12 font-sans text-slate-900 relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-blue-400/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-purple-400/10 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto">
        
        {/* --- HEADER NAVIGATION --- */}
        <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-500/20 transform hover:rotate-12 transition-all">
                <LayoutDashboard size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-600 leading-none">Architecture v3.3</span>
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                  <Code2 size={12} /> Sync Session Active
                </span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 leading-none uppercase italic">
              {kampus.namaKampus}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <div className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-2">
                <ShieldCheck size={14} /> TA {academicYear}
              </div>
              <div className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Cpu size={14} className="text-blue-400" /> {kampus.kodeKampus}
              </div>
              <Link href="/admin/kampus">
                <Button variant="outline" className="h-8 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                  <ArrowLeft size={14} className="mr-1" /> Back
                </Button>
              </Link>
            </div>
          </motion.div>

          <div className="flex flex-wrap gap-3">
            <Link href={`/admin/kampus/${kampus.id}/edit`}>
              <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                className="px-6 h-14 bg-white border-2 border-slate-100 text-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_6px_0_0_#e2e8f0] active:shadow-none active:translate-y-1 transition-all flex items-center gap-2 group"
              >
                <PencilLine size={16} className="text-blue-600 group-hover:rotate-12 transition-transform" /> Edit Profile
              </motion.button>
            </Link>
            <Link href={`/admin/kampus/${kampus.id}/jurusan/tambah`}>
              <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                className="px-6 h-14 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_6px_0_0_#1e40af] active:shadow-none active:translate-y-1 transition-all flex items-center gap-2 group"
              >
                <Plus size={18} className="text-blue-200 group-hover:rotate-90 transition-transform" /> Add Prodi
              </motion.button>
            </Link>
          </div>
        </header>

        {/* --- BENTO ANALYTICS GRID --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
          
          {/* Card: Metrics */}
          <div className="md:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:scale-110 transition-transform">
              <Building2 size={180} className="text-blue-950" />
            </div>
            <h3 className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-300 mb-6 flex items-center gap-2">
                <Database size={12} /> Operational Data
            </h3>
            <div className="grid grid-cols-2 gap-5 relative z-10">
              <div className="p-6 bg-slate-50 rounded-3xl shadow-inner border border-white">
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1 leading-none">Type</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight italic uppercase leading-none">{kampus.jenisKampus}</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl shadow-inner border border-white">
                <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest mb-1 leading-none">Admission</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight italic uppercase leading-none">{kampus.kategoriJalur}</p>
              </div>
            </div>
          </div>

          {/* Card: Accreditation */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm flex flex-col justify-center items-center text-center group">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner group-hover:rotate-12 transition-all">
              <Award size={28} />
            </div>
            <p className="text-[9px] font-black uppercase text-slate-300 mb-1">Rank</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{kampus.akreditasi || 'N/A'}</p>
          </div>

          {/* Card: Live Visibility */}
          <div className={`rounded-[2.5rem] p-8 border-2 flex flex-col justify-center items-center text-center shadow-lg relative overflow-hidden transition-all duration-500 ${kampus.isActive ? 'bg-indigo-600 border-indigo-400 text-white shadow-indigo-500/10' : 'bg-red-600 border-red-400 text-white shadow-red-500/10'}`}>
            <Sparkles className="absolute top-4 right-4 opacity-20" size={24} />
            <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-4">
               {kampus.isActive ? <CheckCircle2 size={24} /> : <Zap size={24} />}
            </div>
            <h3 className="text-[9px] font-black uppercase opacity-60 mb-1 leading-none tracking-widest">Visibility</h3>
            <p className="text-3xl font-black uppercase italic leading-none tracking-tighter">{kampus.isActive ? 'Active' : 'Offline'}</p>
          </div>

          {/* Card: Deployment Center (Large) */}
          <div className="md:col-span-3 bg-slate-950 rounded-[3rem] p-10 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 group">
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:scale-105 transition-all">
                <MapPin size={36} />
              </div>
              <div className="space-y-1">
                <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-400 leading-none">Deployment Area</h4>
                <p className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">{kampus.kota}, <br /> <span className="text-blue-500">{kampus.provinsi}</span></p>
              </div>
            </div>
            <div className="md:text-right relative z-10 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-10">
              <p className="text-[9px] font-black uppercase text-slate-500 mb-3 italic tracking-widest">Registry Sync</p>
              <div className="flex items-center md:justify-end gap-2 text-xl font-black italic text-white/90">
                <History className="text-blue-500" size={18} /> {new Date(kampus.tahunUpdate).getFullYear()}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-[40%] h-full bg-blue-600/5 blur-[80px]" />
          </div>

          {/* Card: Digital Presence */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-sm flex flex-col justify-center group relative overflow-hidden">
            <h3 className="text-[9px] font-black uppercase text-slate-300 mb-8 leading-none">Institutional Site</h3>
            {kampus.website ? (
              <a href={kampus.website} target="_blank" rel="noopener noreferrer" className="group/link flex flex-col h-full justify-between">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover/link:bg-purple-600 group-hover/link:text-white transition-all">
                    <Globe size={32} className="group-hover/link:rotate-[360deg] transition-all duration-1000" />
                  </div>
                  <ArrowUpRight size={20} className="text-slate-200 group-hover/link:text-purple-600 transition-all translate-x-0 group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                </div>
                <p className="mt-8 text-[11px] font-black text-slate-900 underline decoration-purple-100 decoration-4 group-hover/link:decoration-purple-500 transition-all uppercase italic tracking-tighter">
                  Launch Portal
                </p>
              </a>
            ) : (
              <div className="flex flex-col items-center gap-3 opacity-20 py-4 grayscale">
                <Globe size={40} />
                <p className="text-[8px] font-black uppercase">Null Gateway</p>
              </div>
            )}
          </div>
        </section>

        {/* --- DEPARTMENT REPOSITORY --- */}
        <section className="bg-white rounded-[3.5rem] p-8 md:p-14 border border-slate-50 shadow-sm relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 relative z-10">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-slate-950 rounded-2xl text-white shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform">
                <Layers size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-950 uppercase italic leading-none">Departments.</h2>
                <p className="text-slate-400 font-bold text-sm mt-1 italic">Total <span className="text-blue-600 underline font-black">{kampus.jurusan.length}</span> integrated programs</p>
              </div>
            </div>
            
            <div className="px-6 py-3 bg-[#F8FAFC] border border-slate-100 rounded-full hidden md:flex items-center gap-3">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sync Engine v3.3 Ready</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            <AnimatePresence mode="popLayout">
              {kampus.jurusan.length === 0 ? (
                <div className="col-span-full py-24 flex flex-col items-center justify-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} className="text-7xl mb-6 grayscale opacity-10">📚</motion.div>
                  <h4 className="text-lg font-black text-slate-300 uppercase tracking-widest italic text-center">Repository Is Empty</h4>
                </div>
              ) : (
                kampus.jurusan.map((jurusan, idx) => (
                  <motion.div
                    key={jurusan.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: -100 }}
                    transition={{ delay: idx * 0.04 }}
                    className="bg-white rounded-[2.5rem] p-6 border border-slate-100 hover:shadow-xl hover:border-blue-500/20 transition-all group relative flex flex-col overflow-hidden shadow-sm"
                  >
                    {/* Visual Badge Background */}
                    <div className="absolute -top-2 -right-4 text-slate-50 font-black text-6xl pointer-events-none group-hover:text-blue-50/50 transition-colors italic leading-none select-none">
                        {idx + 1}
                    </div>

                    <div className="flex justify-between items-start mb-10 relative z-10">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transform group-hover:rotate-6 transition-all leading-none">
                        {jurusan.namaJurusan.substring(0,1)}
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        jurusan.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      } border border-current`}>
                        {jurusan.isActive ? 'Verified' : 'Paused'}
                      </div>
                    </div>

                    <div className="mb-8 relative z-10">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-3 group-hover:text-blue-600 transition-colors uppercase italic line-clamp-1">
                        {jurusan.namaJurusan}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mb-8">
                        <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg font-black text-[8px] uppercase tracking-widest italic">{jurusan.kodeJurusan}</span>
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-black text-[8px] uppercase tracking-widest">{jurusan.fakultas}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-[#F8FAFC] rounded-2xl flex flex-col shadow-inner border border-white/50 text-center">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none italic">Degree</span>
                          <span className="text-lg font-black text-slate-800 tracking-tighter uppercase leading-none">{jurusan.jenjang}</span>
                        </div>
                        <div className="p-4 bg-[#F8FAFC] rounded-2xl flex flex-col shadow-inner border border-white/50 text-center">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none italic">Accred</span>
                          <span className="text-lg font-black text-slate-800 tracking-tighter uppercase leading-none">{jurusan.akreditasi || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* ACTION ZONE (NEAT) */}
                    <div className="flex gap-2 pt-6 mt-auto border-t border-slate-50 relative z-20">
                      <Link href={`/admin/kampus/${kampus.id}/jurusan/${jurusan.id}/edit`} className="flex-[4]">
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className="w-full h-12 bg-slate-950 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.3em] shadow-lg active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 italic"
                        >
                          <Settings2 size={14} className="text-blue-400" /> Optimize
                        </motion.button>
                      </Link>
                      
                      <motion.button whileHover={{ scale: 1.05, rotate: -3 }} whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteJurusan(jurusan.id, jurusan.namaJurusan)}
                        disabled={isDeleting === jurusan.id}
                        className="flex-1 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border-2 border-red-100 shadow-sm active:translate-y-1"
                      >
                        {isDeleting === jurusan.id ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="mt-24 py-16 border-t-4 border-slate-900/5 flex flex-col md:flex-row items-center justify-between opacity-30 text-center md:text-left gap-10">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="w-10 h-1 bg-blue-600 rounded-full" />
                <p className="text-[14px] font-black uppercase tracking-[0.8em] text-slate-700 leading-none">SMKN 1 KADEMANGAN</p>
            </div>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase italic leading-none">Alpha Analytics Infrastructure Core v3.3</p>
          </div>
          <div className="flex gap-10">
             <div className="flex flex-col items-center gap-2"><Cpu size={24} className="text-blue-600"/> <span className="text-[8px] font-black uppercase tracking-widest leading-none">Neural-Core</span></div>
             <div className="flex flex-col items-center gap-2"><ShieldCheck size={24} className="text-purple-600"/> <span className="text-[8px] font-black uppercase tracking-widest leading-none">Titan-Shield</span></div>
          </div>
        </footer>
      </main>

      {/* FIXED DATA WIDGET */}
      <div className="fixed bottom-8 right-8 z-50 hidden lg:block">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}
            className="bg-white/90 backdrop-blur-xl border-4 border-white p-5 rounded-[2.5rem] shadow-2xl flex items-center gap-5"
        >
            <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                <Share2 size={18} />
            </div>
            <div className="pr-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Database Sync</p>
                <p className="text-xs font-black text-slate-900 uppercase italic tracking-tighter leading-none">Safe Sync Protocol Active</p>
            </div>
        </motion.div>
      </div>

    </div>
  );
}