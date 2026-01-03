'use client';

/**
 * ==============================================================================
 * SI-ELIGIBLE STUDENT DATA MANAGEMENT v4.6 - LIGHT-SPEED BUILD
 * ==============================================================================
 * Module      : High-Density Student Management with Virtual Pagination
 * Style       : Alpha-Gen Professional 3D (Refined Fonts)
 * Calibration : Optimized for 100% Desktop Scaling (Super Light)
 * Logic       : Client-Side Pagination (Multiples of 10), Mass/Single Delete
 * Feature     : Entry Selector (10, 20, 50, 100), Unified KIP Status
 * ==============================================================================
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONOGRAPHY ENGINE ---
import { 
  Users, 
  Search, 
  Plus, 
  ChevronRight, 
  ChevronLeft,
  UserPlus, 
  FileSpreadsheet,
  GraduationCap,
  ShieldCheck,
  Zap,
  LayoutGrid,
  List,
  Sparkles,
  Database,
  Fingerprint,
  RefreshCcw,
  Trash2, 
  AlertCircle,
  Code2,
  Clock,
  Layers,
  PencilLine,
  Eye
} from 'lucide-react';

// --- UI COMPONENTS ---
import { Button } from "@/components/ui/button";

// --- INTERFACES ---
interface JurusanSekolah {
  id: string;
  kode: string;
  nama: string;
  isActive: boolean;
}

interface Siswa {
  id: string;
  nisn: string;
  nama: string;
  kelas: string;
  jurusanSekolah: JurusanSekolah | null;
  statusKIPK: boolean;
  mendaftarKIPK: boolean;
}

interface FilterOptions {
  kelas: string[];
  tingkat: string[];
  jurusanKelas: string[];
  jurusanSekolah: Array<{ id: string; kode: string; nama: string }>;
  stats: {
    totalKelas: number;
    totalTingkat: number;
    totalJurusan: number;
    totalJurusanSekolah: number;
  };
}

export default function DataSiswaPage() {
  // --- CORE STATES ---
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [filterTingkat, setFilterTingkat] = useState('');
  const [filterJurusan, setFilterJurusan] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [academicYear, setAcademicYear] = useState("");

  // --- PAGINATION STATES (PENTING: BIKIN RINGAN) ---
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10); // Default 10 data

  // --- INITIALIZATION ---
  useEffect(() => {
    const now = new Date();
    const period = now.getMonth() + 1 >= 7 
      ? `${now.getFullYear()}/${now.getFullYear() + 1}` 
      : `${now.getFullYear() - 1}/${now.getFullYear()}`;
    setAcademicYear(period);
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    await Promise.all([fetchSiswa(), fetchFilterOptions()]);
    setLoading(false);
  };

  const fetchSiswa = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/admin/siswa');
      if (res.ok) {
        const data = await res.json();
        setSiswa(data);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const res = await fetch('/api/admin/siswa/filters');
      if (res.ok) {
        const data = await res.json();
        setFilterOptions(data);
        console.log('📊 Filter Options Loaded:', data);
      }
    } catch (e) { 
      console.error('Filter options error:', e); 
    }
  };

  // --- DELETE OPERATIONS ---
  const deleteSiswa = async (id: string, name: string) => {
    if (!confirm(`Hapus data neural siswa: ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/siswa/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSiswa(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) { alert("Gagal menghapus."); }
  };

  const deleteAllSiswa = async () => {
    if (!confirm(`⚠️ WARNING: Hapus TOTAL ${siswa.length} data siswa?`)) return;
    const key = prompt("Ketik 'DELETE-ALL' untuk konfirmasi:");
    if (key === 'DELETE-ALL') {
      try {
        const res = await fetch('/api/admin/siswa/delete-all', { method: 'DELETE' });
        if (res.ok) {
          setSiswa([]);
          alert("Database dikosongkan.");
        }
      } catch (error) { alert("Mass delete gagal."); }
    }
  };

  // --- PAGINATION & FILTER ENGINE (MATH LOGIC) ---
  const filteredSiswa = useMemo(() => {
    return siswa.filter(s => {
      const matchesSearch = s.nama.toLowerCase().includes(search.toLowerCase()) || s.nisn.includes(search);
      const matchesKelas = filterKelas === '' || s.kelas === filterKelas;
      
      // Filter by tingkat (XII, XI, X)
      const matchesTingkat = filterTingkat === '' || s.kelas.startsWith(filterTingkat);
      
      // Filter by jurusan (extract dari kelas, misal: "XII TKR 5" -> "TKR")
      const kelasJurusan = s.kelas.split(' ')[1];
      const matchesJurusan = filterJurusan === '' || kelasJurusan === filterJurusan;
      
      return matchesSearch && matchesKelas && matchesTingkat && matchesJurusan;
    });
  }, [siswa, search, filterKelas, filterTingkat, filterJurusan]);

  // Hitung index data untuk ditampilkan
  const totalPages = Math.ceil(filteredSiswa.length / entriesPerPage);
  const indexOfLastSiswa = currentPage * entriesPerPage;
  const indexOfFirstSiswa = indexOfLastSiswa - entriesPerPage;
  const currentSiswaBatch = filteredSiswa.slice(indexOfFirstSiswa, indexOfLastSiswa);

  // Reset ke hal 1 jika filter berubah
  useEffect(() => { setCurrentPage(1); }, [search, filterKelas, entriesPerPage]);

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-10 font-sans text-slate-900 relative">
      
      {/* 1. LAYER BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-400/10 rounded-full blur-[140px] animate-pulse delay-700" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto">
        
        {/* --- 2. HEADER NAVIGATION --- */}
        <header className="mb-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                <Database size={28} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                  Data Siswa
                </h1>
                <p className="text-sm font-semibold text-slate-500 mt-1">
                  Manajemen database siswa terpadu
                </p>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-wrap gap-3">
            <motion.button 
              whileHover={{ y: -3 }} 
              onClick={deleteAllSiswa}
              className="px-6 py-3 bg-white border-2 border-red-200 text-red-600 rounded-xl font-bold text-xs hover:bg-red-50 hover:border-red-300 transition-all flex items-center gap-2 shadow-sm"
            >
              <Trash2 size={16} /> Hapus Semua
            </motion.button>
            <Link href="/admin/siswa/import">
              <motion.div 
                whileHover={{ y: -3 }} 
                className="px-6 py-3 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 rounded-xl font-bold text-xs hover:bg-emerald-100 hover:border-emerald-300 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <FileSpreadsheet size={16} /> Import Excel
              </motion.div>
            </Link>
            <Link href="/admin/siswa/tambah">
              <motion.div 
                whileHover={{ y: -3 }} 
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <UserPlus size={16} /> Tambah Siswa
              </motion.div>
            </Link>
          </div>
        </header>

        {/* --- 3. ANALYTICS MINI BENTO --- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatMiniCard label="Total Siswa" value={siswa.length} icon={<Users size={22}/>} color="blue" />
          <StatMiniCard 
            label="KIP-K Aktif" 
            value={siswa.filter(s => s.statusKIPK || s.mendaftarKIPK).length} 
            icon={<Sparkles size={22}/>} 
            color="orange" 
          />
          <StatMiniCard 
            label="Kelas XII" 
            value={siswa.filter(s => s.kelas.startsWith('XII')).length} 
            icon={<GraduationCap size={22}/>} 
            color="emerald" 
          />
          <StatMiniCard label="Database" value="Online" icon={<RefreshCcw size={22}/>} color="purple" />
        </section>

        {/* --- 4. SMART FILTER & PERFORMANCE (PAGINATION SELECTOR) --- */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-slate-100 rounded-2xl p-5 shadow-md mb-8"
        >
          {/* Row 1: Search + Show Entries */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text" 
                placeholder="Cari siswa berdasarkan nama atau NISN..."
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 font-medium text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              />
            </div>
            
            {/* Show Entries */}
            <div className="flex items-center gap-2 bg-slate-900 px-4 h-12 rounded-xl shrink-0">
              <span className="text-xs font-semibold text-slate-400">SHOW:</span>
              <select 
                value={entriesPerPage} 
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="bg-transparent border-none text-white font-bold text-sm cursor-pointer focus:ring-0 outline-none appearance-none pr-1"
              >
                {[10, 20, 50, 100].map(val => (
                  <option key={val} value={val} className="bg-slate-800">{val}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Filters + View Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Tingkat */}
            <select 
              value={filterTingkat} 
              onChange={(e) => setFilterTingkat(e.target.value)}
              className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm text-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer transition-all appearance-none pr-10 bg-no-repeat bg-right"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundSize: "1.5em 1.5em" }}
            >
              <option value="">Semua Tingkat</option>
              {filterOptions?.tingkat.map(t => (
                <option key={t} value={t}>Tingkat {t}</option>
              ))}
            </select>

            {/* Filter Jurusan */}
            <select 
              value={filterJurusan} 
              onChange={(e) => setFilterJurusan(e.target.value)}
              className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm text-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer transition-all appearance-none pr-10 bg-no-repeat bg-right"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundSize: "1.5em 1.5em" }}
            >
              <option value="">Semua Jurusan</option>
              {filterOptions?.jurusanKelas.map(j => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>

            {/* Filter Rombel */}
            <select 
              value={filterKelas} 
              onChange={(e) => setFilterKelas(e.target.value)}
              className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm text-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer transition-all appearance-none pr-10 bg-no-repeat bg-right"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundSize: "1.5em 1.5em" }}
            >
              <option value="">Semua Rombel</option>
              {filterOptions?.kelas.slice(0, 50).map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            
            {/* Spacer */}
            <div className="flex-1 min-w-0"></div>
            
            {/* View Mode Toggle */}
            <div className="flex bg-blue-50/50 p-1 rounded-xl border border-blue-100">
              <button 
                onClick={() => setViewMode('table')} 
                className={`px-5 py-2 rounded-lg transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-wide ${
                  viewMode === 'table' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <List size={16} /> Tabel
              </button>
              <button 
                onClick={() => setViewMode('grid')} 
                className={`px-5 py-2 rounded-lg transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-wide ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <LayoutGrid size={16} /> Grid
              </button>
            </div>
          </div>
        </motion.section>

        {/* --- 5. DATA RENDERING (CUMA RENDERING SESUAI LIMIT) --- */}
        <section className="relative min-h-[500px]">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-40">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full" />
             </div>
          ) : (
            <AnimatePresence mode="wait">
              {viewMode === 'table' ? (
                <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gradient-to-r from-slate-50 to-blue-50/30 border-b-2 border-slate-100">
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">NISN</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Nama Siswa</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Jurusan</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 text-center">Kelas</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 text-center">Status KIP-K</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentSiswaBatch.map((s) => {
                          // Extract jurusan dari kelas (misal: "XII TKR 5" -> "TKR")
                          const kelasJurusan = s.kelas.split(' ')[1] || '';
                          
                          return (
                          <tr key={s.id} className="group hover:bg-blue-50/50 transition-all duration-200">
                            <td className="px-8 py-5">
                              <span className="font-mono text-xs font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                                {s.nisn}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                                  {s.nama.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 text-sm leading-tight mb-0.5">
                                    {s.nama}
                                  </p>
                                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                                    ID: {s.nisn.slice(-4)}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-black uppercase tracking-wider">
                                {kelasJurusan || s.jurusanSekolah?.kode || '-'}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-center">
                              <span className="inline-flex items-center px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-sm">
                                {s.kelas}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center justify-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${
                                  s.mendaftarKIPK ? 'bg-emerald-500 animate-pulse shadow-emerald-500/50 shadow-lg' : 
                                  s.statusKIPK ? 'bg-orange-500 animate-pulse shadow-orange-500/50 shadow-lg' : 
                                  'bg-slate-300'
                                }`} />
                                <span className={`text-[10px] font-black uppercase tracking-wider ${
                                  s.mendaftarKIPK ? 'text-emerald-600' : 
                                  s.statusKIPK ? 'text-orange-600' : 
                                  'text-slate-400'
                                }`}>
                                  {s.mendaftarKIPK ? 'Mendaftar' : s.statusKIPK ? 'Penerima' : 'Reguler'}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex justify-center gap-2">
                                <Link href={`/admin/siswa/${s.id}`}>
                                  <button className="p-2.5 bg-green-50 border border-green-100 text-green-600 rounded-lg hover:bg-green-600 hover:text-white hover:shadow-lg transition-all">
                                    <Eye size={16}/>
                                  </button>
                                </Link>
                                <Link href={`/admin/siswa/${s.id}/edit`}>
                                  <button className="p-2.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white hover:shadow-lg transition-all">
                                    <PencilLine size={16}/>
                                  </button>
                                </Link>
                                <button 
                                  onClick={() => deleteSiswa(s.id, s.nama)} 
                                  className="p-2.5 bg-red-50 border border-red-100 text-red-500 rounded-lg hover:bg-red-500 hover:text-white hover:shadow-lg transition-all"
                                >
                                  <Trash2 size={16}/>
                                </button>
                              </div>
                            </td>
                          </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentSiswaBatch.map((s) => (
                    <BentoCard key={s.id} siswa={s} onDelete={() => deleteSiswa(s.id, s.nama)} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </section>

        {/* --- 6. SMART PAGINATION CONTROLS (ALPHA DESIGN) --- */}
        <section className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 pb-20">
           <div className="flex flex-col">
              <p className="text-sm font-bold text-slate-700">
                Halaman {currentPage} dari {totalPages}
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Menampilkan {indexOfFirstSiswa + 1}-{Math.min(indexOfLastSiswa, filteredSiswa.length)} dari {filteredSiswa.length} siswa
              </p>
           </div>
           
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1}
                className="w-11 h-11 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex gap-1.5">
                 {[...Array(totalPages)].map((_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1).map((p, i, arr) => (
                   <React.Fragment key={p}>
                      {i > 0 && arr[i-1] !== p - 1 && <span className="text-slate-400 self-center font-bold px-1">...</span>}
                      <button 
                        onClick={() => setCurrentPage(p)}
                        className={`min-w-11 h-11 px-4 rounded-xl font-bold text-sm transition-all ${
                          currentPage === p 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
                        }`}
                      >
                        {p}
                      </button>
                   </React.Fragment>
                 ))}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages}
                className="w-11 h-11 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
           </div>
        </section>

      </main>
    </div>
  );
}

// --- ATOMIC SUB-COMPONENTS ---

interface StatMiniCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'orange' | 'emerald' | 'purple';
}

function StatMiniCard({ label, value, icon, color }: StatMiniCardProps) {
  const colorMap: Record<string, string> = { 
    blue: "from-blue-500 to-blue-600", 
    orange: "from-orange-500 to-orange-600", 
    emerald: "from-emerald-500 to-emerald-600", 
    purple: "from-purple-500 to-purple-600" 
  };
  
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }} 
      className="p-6 bg-white border-2 border-slate-100 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorMap[color]} text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-2xl font-black text-slate-900 mb-0.5">{value}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</div>
        </div>
      </div>
    </motion.div>
  );
}

function BentoCard({ siswa, onDelete }: { siswa: Siswa, onDelete: () => void }) {
  // Extract jurusan dari kelas (misal: "XII TKR 5" -> "TKR")
  const kelasJurusan = siswa.kelas.split(' ')[1] || '';
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -10 }}
      className="bg-white p-10 rounded-[4rem] border-4 border-white shadow-xl relative overflow-hidden group h-full flex flex-col"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100 transition-colors" />
      <div className="flex justify-between items-start mb-8 relative z-10">
         <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl group-hover:rotate-12 transition-transform">{siswa.nama.charAt(0)}</div>
         <button onClick={onDelete} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>
      </div>
      <h3 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter mb-4 truncate">{siswa.nama}</h3>
      <div className="flex gap-2 mb-8">
         <span className="px-4 py-1.5 bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase italic">{siswa.kelas}</span>
         {kelasJurusan && <span className="px-4 py-1.5 bg-blue-50 rounded-xl text-[10px] font-black text-blue-600 uppercase italic">{kelasJurusan}</span>}
         {/* 3-Level KIP-K Status */}
         <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase italic ${
           siswa.mendaftarKIPK ? 'bg-emerald-50 text-emerald-600' : 
           siswa.statusKIPK ? 'bg-orange-50 text-orange-600' : 
           'bg-slate-50 text-slate-300'
         }`}>
           {siswa.mendaftarKIPK ? '📝 MENDAFTAR' : siswa.statusKIPK ? '✅ PENERIMA' : '⭕ REGULER'}
         </span>
      </div>
      <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
         <p className="font-mono text-[10px] font-black text-slate-400 tracking-widest">{siswa.nisn}</p>
         <Link href={`/admin/siswa/${siswa.id}/edit`}>
            <button className="w-12 h-12 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-inner"><ChevronRight size={20}/></button>
         </Link>
      </div>
    </motion.div>
  );
}