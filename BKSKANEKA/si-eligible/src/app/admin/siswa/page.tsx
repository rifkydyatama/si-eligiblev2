'use client';

/**
 * ============================================================
 * SI-ELIGIBLE STUDENT DATA MANAGEMENT v2.0
 * ============================================================
 * Module: Admin Student Dashboard
 * Style: Alpha-Gen Professional (3D, Vibrant, Interactive)
 * Feature: Smart Filter, Real-time Year, Depth UI
 * ============================================================
 */

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  ChevronRight, 
  MoreHorizontal, 
  UserPlus, 
  FileSpreadsheet,
  GraduationCap,
  ShieldCheck,
  Zap,
  LayoutGrid,
  List,
  Sparkles,
  ArrowUpDown,
  History,
  Clock
} from 'lucide-react';

// --- INTERFACE (TETAP SAMA AGAR TIDAK BREAK LOGIC) ---
interface Siswa {
  id: string;
  nisn: string;
  nama: string;
  kelas: string;
  jurusan: string;
  statusKIPK: boolean;
}

export default function DataSiswaPage() {
  // --- STATE MANAGEMENT ---
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [filterJurusan, setFilterJurusan] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [academicYear, setAcademicYear] = useState("");

  // --- AUTO SYNC YEAR LOGIC ---
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    setAcademicYear(month >= 7 ? `${year}/${year + 1}` : `${year - 1}/${year}`);
    fetchSiswa();
  }, []);

  // --- LOGIKA FETCHING (TIDAK DIRUBAH) ---
  const fetchSiswa = async () => {
    try {
      const res = await fetch('/api/admin/siswa');
      if (res.ok) {
        const data = await res.json();
        setSiswa(data);
      }
    } catch (error) {
      console.error('Error fetching siswa:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- FILTERING ENGINE ---
  const filteredSiswa = siswa.filter(s => {
    const matchesSearch = s.nama.toLowerCase().includes(search.toLowerCase()) || s.nisn.includes(search);
    const matchesKelas = filterKelas === '' || s.kelas === filterKelas;
    const matchesJurusan = filterJurusan === '' || s.jurusan === filterJurusan;
    return matchesSearch && matchesKelas && matchesJurusan;
  });

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-8 font-sans text-slate-900 relative">
      
      {/* 1. LAYER BACKGROUND 3D BLOBS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-purple-400/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto">
        
        {/* 2. HEADER SECTION (BENTO STYLE) */}
        <section className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30">
                <Users size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Database Master</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900">
              Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Siswa.</span>
            </h1>
            <p className="text-slate-400 font-bold mt-2 flex items-center gap-2 italic">
              <Clock size={16} /> Update Terakhir: TA {academicYear}
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-4">
            <Link href="/admin/siswa/import">
              <motion.div 
                whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}
                className="px-6 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_8px_0_0_#059669] active:shadow-none active:translate-y-2 transition-all flex items-center gap-3 cursor-pointer"
              >
                <FileSpreadsheet size={18} /> Import Excel
              </motion.div>
            </Link>
            <Link href="/admin/siswa/tambah">
              <motion.div 
                whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}
                className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_8px_0_0_#1e40af] active:shadow-none active:translate-y-2 transition-all flex items-center gap-3 cursor-pointer"
              >
                <UserPlus size={18} /> Tambah Manual
              </motion.div>
            </Link>
          </div>
        </section>

        {/* 3. ANALYTICS MINI CARDS (SMART INSIGHTS) */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatMiniCard label="Total Siswa" value={siswa.length} icon={<Users />} color="blue" />
          <StatMiniCard label="KIP-K" value={siswa.filter(s => s.statusKIPK).length} icon={<Sparkles />} color="orange" />
          <StatMiniCard label="Kelas 12" value={siswa.filter(s => s.kelas === '12').length} icon={<GraduationCap />} color="purple" />
          <StatMiniCard label="Verified" value={siswa.length} icon={<ShieldCheck />} color="emerald" />
        </section>

        {/* 4. SMART SEARCH & FILTER BAR */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Cari Nama, NISN, atau ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-14 pl-14 pr-6 rounded-2xl bg-[#F8FAFC] border-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-400 shadow-inner"
              />
            </div>
            
            <div className="flex gap-4">
              <select 
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                className="px-6 h-14 bg-[#F8FAFC] border-none rounded-2xl font-bold text-slate-600 focus:ring-4 focus:ring-blue-500/10 cursor-pointer shadow-inner"
              >
                <option value="">Semua Kelas</option>
                <option value="12">Kelas 12</option>
                <option value="11">Kelas 11</option>
              </select>
              
              <select 
                value={filterJurusan}
                onChange={(e) => setFilterJurusan(e.target.value)}
                className="px-6 h-14 bg-[#F8FAFC] border-none rounded-2xl font-bold text-slate-600 focus:ring-4 focus:ring-blue-500/10 cursor-pointer shadow-inner"
              >
                <option value="">Semua Jurusan</option>
                <option value="IPA">IPA</option>
                <option value="IPS">IPS</option>
                <option value="Bahasa">Bahasa</option>
              </select>

              <div className="flex bg-[#F8FAFC] p-1 rounded-2xl shadow-inner">
                <button 
                  onClick={() => setViewMode('table')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'table' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}
                >
                  <List size={20} />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}
                >
                  <LayoutGrid size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 5. DATA RENDERER (TABLE / GRID) */}
        <section className="relative">
          {loading ? (
            <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-xl">
              <div className="w-20 h-20 border-8 border-slate-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-6" />
              <p className="text-xl font-black text-slate-300 uppercase tracking-widest">Sinkronisasi Data...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {viewMode === 'table' ? (
                <motion.div 
                  key="table-view"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] overflow-hidden"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F8FAFC]">
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">NISN</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Siswa / Identitas</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Kelas</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Jurusan</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">KIP-K</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredSiswa.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-8 py-32 text-center">
                              <div className="max-w-xs mx-auto">
                                <Search size={64} className="mx-auto text-slate-100 mb-6" />
                                <p className="text-slate-400 font-bold italic text-lg">Tidak ada data yang cocok dengan kriteria pencarian Anda.</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredSiswa.map((s, idx) => (
                            <motion.tr 
                              key={s.id}
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                              className="group hover:bg-blue-50/30 transition-all cursor-default"
                            >
                              <td className="px-8 py-6">
                                <span className="font-mono text-xs font-black bg-slate-100 px-3 py-1.5 rounded-lg text-slate-500">{s.nisn}</span>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                                    {s.nama.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-black text-slate-800 leading-none mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{s.nama}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Registered Student</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6 text-center">
                                <span className="font-black text-slate-700 bg-white border border-slate-100 px-3 py-1.5 rounded-xl shadow-sm">{s.kelas}</span>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                  <span className="font-bold text-slate-600">{s.jurusan}</span>
                                </div>
                              </td>
                              <td className="px-8 py-6 text-center">
                                {s.statusKIPK ? (
                                  <span className="px-3 py-1.5 bg-orange-100 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-orange-200">PENERIMA</span>
                                ) : (
                                  <span className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200">REGULER</span>
                                )}
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex justify-center gap-3">
                                  <Link href={`/admin/siswa/${s.id}`}>
                                    <motion.button whileHover={{ scale: 1.1 }} className="p-3 bg-white border border-slate-100 text-blue-600 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                      <ChevronRight size={18} />
                                    </motion.button>
                                  </Link>
                                  <Link href={`/admin/siswa/${s.id}/edit`}>
                                    <motion.button whileHover={{ scale: 1.1 }} className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg hover:shadow-blue-500/40 transition-all">
                                      <Zap size={18} fill="currentColor" />
                                    </motion.button>
                                  </Link>
                                </div>
                              </td>
                            </motion.tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ) : (
                /* GRID VIEW (ALPHA GENERATION STYLE) */
                <motion.div 
                  key="grid-view"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filteredSiswa.map((s, idx) => (
                    <motion.div 
                      key={s.id}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -10 }}
                      className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                      
                      <div className="flex items-start justify-between mb-6 relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/20 group-hover:rotate-12 transition-transform">
                          {s.nama.charAt(0)}
                        </div>
                        <div className="text-right font-black text-xs text-slate-300 uppercase tracking-widest">{s.nisn}</div>
                      </div>

                      <div className="relative z-10">
                        <h3 className="text-2xl font-black text-slate-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors uppercase truncate">{s.nama}</h3>
                        <div className="flex gap-2 mb-6">
                          <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.kelas}</span>
                          <span className="px-3 py-1 bg-blue-50 rounded-lg text-[10px] font-black text-blue-500 uppercase tracking-widest">{s.jurusan}</span>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none mb-1">Status KIP-K</span>
                            <span className={`font-black text-sm ${s.statusKIPK ? 'text-orange-500' : 'text-slate-400'}`}>{s.statusKIPK ? 'Penerima' : 'Reguler'}</span>
                          </div>
                          <Link href={`/admin/siswa/${s.id}`}>
                            <button className="px-6 py-3 bg-slate-50 hover:bg-blue-600 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Detail Profil</button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </section>

        {/* 6. SYSTEM FOOTER */}
        <footer className="mt-20 py-12 border-t border-slate-100 text-center opacity-40">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            &copy; {new Date().getFullYear()} SMKN 1 Kademangan | Professional Analytics v2.0
          </p>
        </footer>

      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatMiniCard({ label, value, icon, color }: any) {
  const colorMap: any = {
    blue: "bg-blue-600 shadow-blue-500/20",
    emerald: "bg-emerald-500 shadow-emerald-500/20",
    orange: "bg-orange-600 shadow-orange-500/20",
    purple: "bg-purple-600 shadow-purple-500/20",
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="p-6 bg-white border border-slate-50 rounded-[2.5rem] shadow-sm flex items-center gap-5 group cursor-default"
    >
      <div className={`w-12 h-12 ${colorMap[color]} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-black text-slate-800 leading-none mb-1">{value}</div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
      </div>
    </motion.div>
  );
}