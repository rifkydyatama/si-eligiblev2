'use client';

/**
 * ============================================================
 * SI-ELIGIBLE ACADEMIC ANALYTICS v2.0
 * ============================================================
 * Module: Intelligent Grade Importer (e-Rapor Compatible)
 * Style: Alpha-Gen Professional 3D (Light Edition)
 * ============================================================
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  Zap, 
  Info,
  ChevronRight,
  ShieldCheck,
  Cpu,
  RefreshCcw,
  Download,
  BookOpen,
  Database,
  PieChart,
  Clock,
  Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function DataNilaiPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [academicYear, setAcademicYear] = useState("");

  // Logic Tahun Real-time
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    setAcademicYear(month >= 7 ? `${year}/${year + 1}` : `${year - 1}/${year}`);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Sila pilih berkas Excel e-Rapor Anda terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/nilai/import', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Terjadi anomali saat integrasi data nilai.');
      }
    } catch (err: any) {
      setError('Koneksi sistem terputus. Sila coba beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = `NISN,Semester,Mata Pelajaran,Nilai\n0012345678,1,Matematika,85\n0012345678,1,Bahasa Indonesia,88`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_import_nilai_v2.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-8 font-sans text-slate-900 relative overflow-hidden">
      
      {/* 1. BACKGROUND ENGINE (ALPHA AMBIENT) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-indigo-400/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto">
        
        {/* 2. HEADER SMART NAVIGATION */}
        <section className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-500/30 transform hover:rotate-12 transition-transform">
                <BarChart3 size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Analytics Center</span>
                <span className="text-xs font-bold text-slate-400">Academic Grade Sync</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-none">
              Import <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 italic">Nilai.</span>
            </h1>
            <p className="text-slate-400 font-bold mt-4 flex items-center gap-2 italic">
              <Clock size={16} /> Aktif pada TA {academicYear}
            </p>
          </motion.div>

          <Link href="/admin/dashboard">
            <Button variant="outline" className="h-16 px-10 rounded-3xl border-slate-100 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 shadow-sm hover:shadow-md transition-all active:scale-95">
              <ArrowLeft size={18} className="mr-3" /> Dashboard
            </Button>
          </Link>
        </section>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* LEFT: INTERACTIVE UPLOAD (3D ZONE) */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              className={`relative group bg-white border-4 border-dashed rounded-[4rem] p-16 transition-all duration-500 flex flex-col items-center justify-center text-center border-slate-100 hover:border-indigo-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)] hover:shadow-xl`}
            >
              <input type="file" id="nilai-upload" className="hidden" accept=".xlsx,.xls" onChange={handleFileChange} />
              <label htmlFor="nilai-upload" className="cursor-pointer w-full h-full">
                <div className={`w-32 h-32 rounded-[2.5rem] mx-auto flex items-center justify-center mb-10 transition-all duration-700 shadow-2xl ${
                  file ? 'bg-indigo-500 text-white rotate-[360deg] shadow-indigo-500/20' : 'bg-indigo-50 text-indigo-600 group-hover:scale-110 shadow-indigo-500/10'
                }`}>
                  {file ? <ShieldCheck size={60} /> : <UploadCloud size={60} />}
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-3 uppercase tracking-tighter">
                  {file ? 'Berkas Terbaca' : 'Unggah e-Rapor'}
                </h3>
                <p className="text-slate-400 font-bold text-sm italic max-w-xs mx-auto leading-relaxed">
                  {file ? file.name : 'Letakkan file Excel e-Rapor Anda di sini atau klik untuk mencari manual.'}
                </p>
              </label>

              {file && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-10 pt-10 border-t border-slate-50 w-full flex items-center justify-between">
                  <div className="text-left font-black">
                    <p className="text-[10px] uppercase text-slate-300 tracking-widest">Metadata Size</p>
                    <p className="text-slate-600 italic">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <button onClick={() => setFile(null)} className="px-6 py-3 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm">
                    Batalkan
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* ACTION BUTTON (3D CLICK) */}
            <motion.button
              disabled={!file || loading}
              onClick={handleUpload}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full h-24 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2.5rem] font-black text-2xl shadow-[0_15px_0_0_#3730a3] active:shadow-none active:translate-y-4 transition-all flex items-center justify-center gap-5 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <RefreshCcw className="animate-spin" size={32} /> 
                  <span className="tracking-tighter uppercase">Sinkronisasi Database...</span>
                </>
              ) : (
                <>
                  MULAI INTEGRASI <ChevronRight size={32} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </motion.button>
          </div>

          {/* RIGHT: BENTO BOXES (STATS & INFO) */}
          <div className="lg:col-span-5 space-y-8">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div 
                  key="guide" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="space-y-8"
                >
                  <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-3">
                        <Cpu className="text-indigo-400" /> Auto-Engine
                      </h3>
                      <Sparkles className="text-amber-400 animate-pulse" />
                    </div>
                    <ul className="space-y-8">
                      <li className="flex gap-6 group">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-lg">
                          <BookOpen size={20}/>
                        </div>
                        <div>
                          <p className="font-black text-sm uppercase tracking-tight text-white group-hover:text-indigo-400 transition-colors">Dapodik Compatible</p>
                          <p className="text-xs font-bold text-slate-500 leading-relaxed italic">Sistem mendeteksi header kolom e-Rapor secara otomatis.</p>
                        </div>
                      </li>
                      <li className="flex gap-6 group">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-lg">
                          <RefreshCcw size={20}/>
                        </div>
                        <div>
                          <p className="font-black text-sm uppercase tracking-tight text-white group-hover:text-indigo-400 transition-colors">Auto-Update</p>
                          <p className="text-xs font-bold text-slate-500 leading-relaxed italic">Data nilai yang sudah ada akan diperbarui secara otomatis.</p>
                        </div>
                      </li>
                    </ul>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
                  </div>

                  <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm group hover:border-indigo-200 transition-colors">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 italic text-center">Butuh contoh format?</h4>
                    <button onClick={downloadTemplate} className="w-full py-6 bg-[#F8FAFC] hover:bg-indigo-600 hover:text-white rounded-[2rem] flex items-center justify-center gap-4 transition-all duration-300 group shadow-inner">
                      <Download className="text-indigo-500 group-hover:text-white" />
                      <span className="font-black text-xs uppercase tracking-widest">Unduh Template Nilai</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="bg-indigo-50 border-4 border-indigo-100 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden"
                >
                  <div className="flex items-center gap-5 mb-12 relative z-10">
                    <div className="w-20 h-20 bg-indigo-500 text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-indigo-500/30 animate-bounce">
                      <CheckCircle2 size={40} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black leading-none tracking-tighter uppercase text-indigo-900">Integrasi Valid</h3>
                      <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mt-2 italic">Arsip Nilai Berhasil Dimuat</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6 relative z-10">
                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Terproses</p>
                      <p className="text-5xl font-black text-indigo-600 tracking-tighter">{result.successCount}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">NISN Hilang</p>
                      <p className="text-5xl font-black text-amber-500 tracking-tighter">{result.notFoundCount}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-red-50 border-2 border-red-100 p-8 rounded-[2.5rem] flex gap-5 text-red-600 shadow-xl">
                <AlertTriangle className="shrink-0" size={32} />
                <div>
                  <p className="font-black text-sm uppercase tracking-wider mb-1">Mapping Integrity Error</p>
                  <p className="text-xs font-bold opacity-80 italic">{error}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}