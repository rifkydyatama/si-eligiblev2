'use client';

/**
 * ============================================================
 * SI-ELIGIBLE REBUTTAL JUSTICE SYSTEM v2.0
 * ============================================================
 * Module: Admin Grade Appeal Reviewer
 * Style: Alpha-Gen Professional 3D (Light Mode)
 * Logic: Real-time Review & Comparison Engine
 * ============================================================
 */

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowLeft, 
  ChevronRight, 
  Eye, 
  MessageSquare, 
  User, 
  Hash, 
  FileText, 
  ArrowRightLeft,
  Sparkles,
  Zap,
  Image as ImageIcon,
  ExternalLink,
  Info,
  History
} from 'lucide-react';
import { Button } from "@/components/ui/button";

// --- INTERFACE (TETAP SAMA) ---
interface Sanggahan {
  id: string;
  siswa: {
    id: string;
    nisn: string;
    nama: string;
    kelas: string;
  };
  semester: number;
  mataPelajaran: string;
  nilaiLama: number;
  nilaiBaru: number;
  buktiRapor: string;
  status: string;
  keterangan: string | null;
  createdAt: string;
}

export default function SanggahanPage() {
  const [sanggahan, setSanggahan] = useState<Sanggahan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedSanggahan, setSelectedSanggahan] = useState<Sanggahan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [academicYear, setAcademicYear] = useState("");

  // Logika Tahun Ajaran Real-time
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    setAcademicYear(month >= 7 ? `${now.getFullYear()}/${now.getFullYear() + 1}` : `${now.getFullYear() - 1}/${now.getFullYear()}`);
    fetchSanggahan();
  }, [filter]);

  // --- LOGIKA FETCHING (TETAP SAMA) ---
  const fetchSanggahan = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/sanggahan?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setSanggahan(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (s: Sanggahan) => {
    setSelectedSanggahan(s);
    setShowModal(true);
  };

  const handleApprove = async () => {
    if (!selectedSanggahan) return;
    try {
      const res = await fetch(`/api/admin/sanggahan/${selectedSanggahan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      if (res.ok) {
        setShowModal(false);
        fetchSanggahan();
      }
    } catch (error) { console.error(error); }
  };

  const handleReject = async (keterangan: string) => {
    if (!selectedSanggahan) return;
    try {
      const res = await fetch(`/api/admin/sanggahan/${selectedSanggahan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', keterangan })
      });
      if (res.ok) {
        setShowModal(false);
        fetchSanggahan();
      }
    } catch (error) { console.error(error); }
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-8 font-sans text-slate-900 relative overflow-hidden">
      
      {/* 1. LAYER DEKORASI ALPHA (AMBIENT BLOBS) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-400/10 rounded-full blur-[140px] animate-pulse delay-1000" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto">
        
        {/* 2. HEADER SMART NAVIGATION */}
        <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-xl shadow-amber-500/20 transform hover:rotate-12 transition-transform">
                <ShieldAlert size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 leading-none mb-1">Justice Panel</span>
                <span className="text-xs font-bold text-slate-400">Review & Dispute Engine</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-none uppercase">
              Sanggahan <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 italic">Nilai.</span>
            </h1>
            <p className="text-slate-400 font-bold mt-4 flex items-center gap-2 italic">
              <Clock size={16} /> Monitoring TA {academicYear}
            </p>
          </motion.div>

          {/* FILTER TABS (ALPHA STYLE) */}
          <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-[2rem] border border-slate-100 shadow-sm flex gap-1 self-start">
            {[
              { v: 'pending', l: 'Pending', i: <Clock size={14}/>, c: 'text-amber-500 bg-amber-50' },
              { v: 'approved', l: 'Approved', i: <CheckCircle2 size={14}/>, c: 'text-emerald-500 bg-emerald-50' },
              { v: 'rejected', l: 'Rejected', i: <XCircle size={14}/>, c: 'text-red-500 bg-red-50' }
            ].map((t) => (
              <button
                key={t.v}
                onClick={() => setFilter(t.v)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${
                  filter === t.v ? `${t.c} shadow-md scale-105` : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t.i} {t.l}
              </button>
            ))}
          </div>
        </section>

        {/* 3. CONTENT AREA */}
        <section className="relative">
          {loading ? (
            <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-xl">
              <div className="w-20 h-20 border-8 border-slate-100 border-t-amber-600 rounded-full animate-spin mx-auto mb-6" />
              <p className="text-xl font-black text-slate-300 uppercase tracking-widest">Memvalidasi Antrian...</p>
            </div>
          ) : sanggahan.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[3rem] p-32 text-center border border-slate-100 shadow-sm">
              <div className="text-8xl mb-6">🏜️</div>
              <p className="text-slate-400 font-bold italic text-lg uppercase tracking-widest leading-tight">Tidak ada antrian <br /> data sanggahan.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {sanggahan.map((s, idx) => (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group cursor-default relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-tr from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-slate-500 font-black text-xl shadow-inner group-hover:rotate-6 transition-transform">
                          {s.siswa.nama.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight leading-none mb-1 group-hover:text-amber-600 transition-colors">
                            {s.siswa.nama}
                          </h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.siswa.nisn} • KELAS {s.siswa.kelas}</p>
                        </div>
                      </div>
                      
                      {s.status === 'pending' ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => handleReview(s)}
                          className="px-6 py-3 bg-amber-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_6px_0_0_#d97706] active:shadow-none active:translate-y-1 transition-all"
                        >
                          Review Data
                        </motion.button>
                      ) : (
                        <div className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest ${
                          s.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {s.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Mata Pelajaran</p>
                        <p className="font-bold text-slate-700 text-sm truncate">{s.mataPelajaran}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Semester</p>
                        <p className="font-bold text-slate-700 text-sm">Semester {s.semester}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                      <div className="flex-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Delta Nilai</p>
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-black text-red-400 line-through opacity-50">{s.nilaiLama}</span>
                          <ChevronRight size={14} className="text-slate-300" />
                          <span className="text-3xl font-black text-emerald-500">{s.nilaiBaru}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Timestamp</p>
                        <p className="text-[10px] font-bold text-slate-400">{new Date(s.createdAt).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

      </main>

      {/* 4. MODAL REVIEW (3D GLASSMORPHISM) */}
      <AnimatePresence>
        {showModal && selectedSanggahan && (
          <ReviewModal
            sanggahan={selectedSanggahan}
            onApprove={handleApprove}
            onReject={handleReject}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB COMPONENT: MODAL JUDGE ---
function ReviewModal({ sanggahan, onApprove, onReject, onClose }: any) {
  const [keterangan, setKeterangan] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center z-[100] p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
        className="bg-white rounded-[3.5rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-white"
      >
        <button onClick={onClose} className="absolute top-8 right-8 w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">✕</button>
        
        <div className="p-10 md:p-14">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-600 rounded-[1.75rem] flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-orange-500/20 animate-bounce">
              {sanggahan.siswa.nama.charAt(0)}
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">{sanggahan.siswa.nama}</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Hash size={14} className="text-amber-500" /> {sanggahan.siswa.nisn} <span className="opacity-30">|</span> <GraduationCap size={14} className="text-blue-500" /> Kelas {sanggahan.siswa.kelas}
              </p>
            </div>
          </div>

          {/* ANALYSIS GRID */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 bg-red-50/50 rounded-[2.5rem] border-2 border-dashed border-red-100 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2 leading-none italic">Original Record</p>
                <h4 className="text-2xl font-black text-slate-800 leading-tight uppercase">{sanggahan.mataPelajaran}</h4>
              </div>
              <div className="mt-10">
                <p className="text-[10px] font-black text-red-300 uppercase tracking-widest mb-1">Sistem Nilai</p>
                <p className="text-7xl font-black text-red-500 tracking-tighter opacity-80">{sanggahan.nilaiLama}</p>
              </div>
            </div>

            <div className="p-8 bg-emerald-50/50 rounded-[2.5rem] border-2 border-emerald-100 flex flex-col justify-between relative overflow-hidden">
              <Sparkles className="absolute top-6 right-6 text-emerald-200" size={32} />
              <div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 leading-none italic">Student Claim</p>
                <h4 className="text-2xl font-black text-slate-800 leading-tight uppercase">{sanggahan.mataPelajaran}</h4>
              </div>
              <div className="mt-10">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Bukti Klaim</p>
                <p className="text-7xl font-black text-emerald-600 tracking-tighter">{sanggahan.nilaiBaru}</p>
              </div>
            </div>
          </div>

          {/* BUKTI RAPOR PREVIEW */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <ImageIcon size={18} /> Verifikasi Visual Bukti Rapor
              </h3>
              <a href={sanggahan.buktiRapor} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:underline">
                <ExternalLink size={12} /> Open High-Res
              </a>
            </div>
            <div className="bg-slate-900 rounded-[3rem] p-4 shadow-inner relative group">
              <img src={sanggahan.buktiRapor} alt="Evidence" className="w-full h-auto rounded-[2rem] object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_0_100px_rgba(0,0,0,0.2)] pointer-events-none" />
            </div>
          </div>

          {/* ACTION BUTTONS (CLAYMORPHISM) */}
          <div className="space-y-6">
            {!showRejectForm ? (
              <div className="flex flex-col md:flex-row gap-6">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={onApprove}
                  className="flex-[2] h-24 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2rem] font-black text-2xl shadow-[0_12px_0_0_#059669] active:shadow-none active:translate-y-3 transition-all flex items-center justify-center gap-4 group"
                >
                  SETUJUI PERUBAHAN <CheckCircle2 size={28} className="group-hover:rotate-12 transition-transform" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowRejectForm(true)}
                  className="flex-1 h-24 bg-slate-100 text-slate-400 rounded-[2rem] font-black text-xl hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  TOLAK
                </motion.button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-red-400 ml-2">Alasan Penolakan (Wajib)</label>
                  <textarea
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    placeholder="Contoh: Bukti foto tidak jelas atau buram..."
                    rows={4}
                    className="w-full p-8 rounded-[2rem] bg-slate-50 border-none focus:ring-4 focus:ring-red-500/10 transition-all font-bold text-slate-700 shadow-inner"
                  />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => { if(keterangan.trim()) onReject(keterangan); else alert('Alasan harus diisi'); }} className="flex-[2] py-6 bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_8px_0_0_#b91c1c] active:shadow-none active:translate-y-2 transition-all">Kirim Penolakan</button>
                  <button onClick={() => setShowRejectForm(false)} className="flex-1 py-6 bg-slate-100 text-slate-400 rounded-2xl font-black text-sm uppercase tracking-widest">Batal</button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}