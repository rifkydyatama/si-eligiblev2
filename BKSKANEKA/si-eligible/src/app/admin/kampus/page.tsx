'use client';

/**
 * ============================================================
 * SI-ELIGIBLE CAMPUS MASTER ENGINE v2.0
 * ============================================================
 * Module: Admin Campus & Program Management
 * Style: Alpha-Gen Professional 3D (Vibrant Edition)
 * Feature: Smart Filtering, 3D Claymorphism, Real-time TA
 * ============================================================
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  School, 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  MapPin, 
  GraduationCap, 
  Award, 
  Globe, 
  Building2, 
  Zap, 
  Clock,
  LayoutGrid,
  List,
  Sparkles,
  ArrowUpRight,
  Database,
  SearchCode
} from 'lucide-react';
import { Button } from "@/components/ui/button";

// --- INTERFACE (NO CHANGES IN LOGIC) ---
interface Kampus {
  id: string;
  kodeKampus: string;
  namaKampus: string;
  jenisKampus: string;
  kategoriJalur: string;
  akreditasi: string | null;
  provinsi: string;
  kota: string;
  jurusanCount: number;
}

export default function DataKampusPage() {
  const [kampus, setKampus] = useState<Kampus[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [academicYear, setAcademicYear] = useState("");

  // --- AUTO SYNC YEAR ---
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    setAcademicYear(month >= 7 ? `${year}/${year + 1}` : `${year - 1}/${year}`);
    fetchKampus();
  }, []);

  // --- LOGIKA FETCHING (TETAP SAMA) ---
  const fetchKampus = async () => {
    try {
      const res = await fetch('/api/admin/kampus');
      if (res.ok) {
        const data = await res.json();
        setKampus(data);
      }
    } catch (error) {
      console.error('Anomali transmisi data kampus:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredKampus = kampus.filter(k => {
    const matchSearch = k.namaKampus.toLowerCase().includes(search.toLowerCase()) ||
                       k.kodeKampus.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filterJenis || k.jenisKampus === filterJenis;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-8 font-sans text-slate-900 relative overflow-hidden">
      
      {/* 1. AMBIENT BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-400/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto">
        
        {/* 2. HEADER NAVIGATION (BENTO STYLE) */}
        <section className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-600 rounded-2xl text-white shadow-xl shadow-purple-500/30 transform hover:rotate-12 transition-transform">
                <School size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600">Infrastructure Center</span>
                <span className="text-xs font-bold text-slate-400 italic text-sm">Master Repositori Kampus</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-none">
              Database <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Kampus.</span>
            </h1>
            <p className="text-slate-400 font-bold mt-4 flex items-center gap-2 italic">
              <Clock size={16} /> Update Sistem: TA {academicYear}
            </p>
          </motion.div>

          <Link href="/admin/kampus/tambah">
            <motion.div 
              whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}
              className="px-8 py-5 bg-purple-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-[0_10px_0_0_#581c87] active:shadow-none active:translate-y-2 transition-all flex items-center gap-3 cursor-pointer group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Tambah Kampus Baru
            </motion.div>
          </Link>
        </section>

        {/* 3. ANALYTICS MINI CARDS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatMiniCard label="Total Instansi" value={kampus.length} icon={<Building2 />} color="blue" />
          <StatMiniCard label="Vokasi/PTN" value={kampus.filter(k => k.jenisKampus === 'PTN').length} icon={<Zap />} color="orange" />
          <StatMiniCard label="Prodi Terdaftar" value={kampus.reduce((acc, curr) => acc + curr.jurusanCount, 0)} icon={<Database />} color="emerald" />
          <StatMiniCard label="TA Aktif" value={academicYear} icon={<Sparkles />} color="purple" isText />
        </section>

        {/* 4. SMART SEARCH & FILTER BAR (GLASSMORPHISM) */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] mb-10 flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors">
              <SearchCode size={22} />
            </div>
            <input
              type="text"
              placeholder="Cari Identitas atau Kode Institusi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-16 pl-16 pr-6 rounded-2xl bg-[#F8FAFC] border-none focus:ring-4 focus:ring-purple-500/10 transition-all font-bold text-slate-700 shadow-inner placeholder:text-slate-400"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              <select
                value={filterJenis}
                onChange={(e) => setFilterJenis(e.target.value)}
                className="pl-12 pr-10 h-16 bg-[#F8FAFC] border-none rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 focus:ring-4 focus:ring-purple-500/10 cursor-pointer shadow-inner appearance-none"
              >
                <option value="">Semua Jenis</option>
                <option value="PTN">PTN</option>
                <option value="PTKIN">PTKIN</option>
                <option value="PTS">PTS</option>
                <option value="Kedinasan">Kedinasan</option>
              </select>
            </div>
          </div>
        </motion.section>

        {/* 5. DATA RENDERING ENGINE */}
        <section className="relative min-h-[400px]">
          {loading ? (
            <div className="bg-white rounded-[4rem] p-24 text-center border border-slate-50 shadow-xl flex flex-col items-center">
              <div className="w-20 h-20 border-8 border-slate-100 border-t-purple-600 rounded-full animate-spin mb-6" />
              <p className="text-xl font-black text-slate-300 uppercase tracking-[0.3em] animate-pulse">Syncing Campus Data...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredKampus.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[4rem] p-32 text-center border border-slate-50 shadow-sm">
                  <div className="text-8xl mb-6 grayscale opacity-20">🏫</div>
                  <p className="text-slate-400 font-bold italic text-lg uppercase tracking-widest">Tidak ada record institusi <br /> yang ditemukan.</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredKampus.map((k, idx) => (
                    <CampusCard key={k.id} kampus={k} index={idx} />
                  ))}
                </div>
              )}
            </AnimatePresence>
          )}
        </section>

        {/* 6. FOOTER ANALYTICS */}
        <footer className="mt-24 py-12 border-t border-slate-100 text-center opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
            &copy; {new Date().getFullYear()} SMKN 1 Kademangan | Professional Campus Infrastructure
          </p>
        </footer>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS (ALPHA GENERATION STYLE) ---

function StatMiniCard({ label, value, icon, color, isText }: any) {
  const colors: any = {
    blue: "bg-blue-600 shadow-blue-500/20",
    orange: "bg-orange-500 shadow-orange-500/20",
    emerald: "bg-emerald-500 shadow-emerald-500/20",
    purple: "bg-purple-600 shadow-purple-500/20",
  };

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="p-6 bg-white border border-slate-50 rounded-[2.5rem] shadow-sm flex items-center gap-5 group"
    >
      <div className={`w-14 h-14 ${colors[color]} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform`}>
        {icon}
      </div>
      <div>
        <div className={`font-black text-slate-900 leading-none mb-1 ${isText ? 'text-lg' : 'text-3xl tracking-tighter'}`}>
          {value}
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
      </div>
    </motion.div>
  );
}

function CampusCard({ kampus, index }: { kampus: Kampus, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -12 }}
      className="bg-white p-8 rounded-[3.5rem] border border-slate-50 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group relative overflow-hidden flex flex-col justify-between"
    >
      {/* Background ID Decoration */}
      <div className="absolute top-[-20%] right-[-10%] text-slate-50 font-black text-[10rem] pointer-events-none select-none italic group-hover:text-purple-50 transition-colors">
        {index + 1}
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-[1.5rem] flex items-center justify-center text-slate-500 font-black text-3xl shadow-inner group-hover:rotate-6 transition-transform">
            🏫
          </div>
          <div className="flex flex-col gap-2 items-end">
            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">
              {kampus.jenisKampus}
            </span>
            {kampus.akreditasi && (
              <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm flex items-center gap-2">
                <Award size={12} /> {kampus.akreditasi}
              </span>
            )}
          </div>
        </div>

        <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-3 group-hover:text-purple-600 transition-colors uppercase italic">
          {kampus.namaKampus}
        </h3>
        
        <div className="flex items-center gap-2 mb-6">
          <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
            KODE: {kampus.kodeKampus}
          </span>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-slate-400 font-bold text-sm">
            <MapPin size={16} className="text-purple-500" />
            <span className="truncate">{kampus.kota}, {kampus.provinsi}</span>
          </div>
          <div className="flex items-center gap-3 text-purple-600 font-black text-sm">
            <Zap size={16} fill="currentColor" />
            <span>{kampus.jurusanCount} Program Studi Terintegrasi</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex gap-3 pt-6 border-t border-slate-50">
        <Link href={`/admin/kampus/${kampus.id}`} className="flex-1">
          <Button className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95 transition-all">
            Kelola Data
          </Button>
        </Link>
        <Link href={`/admin/kampus/${kampus.id}/jurusan/tambah`}>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 12 }}
            className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20"
          >
            <Plus size={24} />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}