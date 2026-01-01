'use client';

/**
 * ============================================================
 * SI-ELIGIBLE INTELLIGENT IMPORT SYSTEM v2.0
 * ============================================================
 * Module: Admin Student Excel Importer
 * Style: Alpha-Gen Professional 3D (Light Mode)
 * Logic: Auto-Mapping Dapodik Compatibility
 * ============================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  FileSpreadsheet, 
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
  FileText,
  Clock,
  LayoutGrid,
  History,
  MousePointer2,
  Database,
  Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ImportSiswaPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [academicYear, setAcademicYear] = useState("");

  // --- LOGIKA TAHUN OTOMATIS (REAL-TIME) ---
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    setAcademicYear(month >= 7 ? `${year}/${year + 1}` : `${year - 1}/${year}`);
  }, []);

  // --- HANDLERS ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Pilih file Excel terlebih dahulu sebelum melakukan transmisi data.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/siswa/import', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
        if (data.successCount > 0) {
          // Vibrasi visual sukses
          setTimeout(() => {
            router.push('/admin/siswa');
          }, 5000);
        }
      } else {
        setError(data.error || 'Terjadi anomali saat proses integrasi data.');
      }
    } catch (err: any) {
      setError('Gagal terhubung ke pusat data. Periksa koneksi jaringan Anda.');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = `NISN,Nama,Tanggal Lahir,Kelas,Jurusan,Email,No Telepon,Status KIP-K
0012345678,Contoh Siswa,2007-05-15,12,IPA,email@example.com,081234567890,Ya
0012345679,Contoh Siswa 2,2007-06-20,12,IPS,email2@example.com,081234567891,Tidak`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_si_eligible_${academicYear.replace('/', '_')}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-8 font-sans text-slate-900 relative overflow-hidden selection:bg-blue-500 selection:text-white">
      
      {/* 1. ADVANCED BACKGROUND ENGINE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-400/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-400/10 rounded-full blur-[140px] animate-pulse delay-1000" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto">
        
        {/* 2. HEADER SMART NAVIGATION */}
        <section className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-500/30 transform hover:rotate-12 transition-transform">
                <Database size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Smart Data Sync</span>
                <span className="text-xs font-bold text-slate-400">Integrasi Excel & Dapodik</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-none">
              Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 italic">Integration.</span>
            </h1>
            <p className="text-slate-400 font-bold mt-4 flex items-center gap-2 italic">
              <Clock size={16} /> Update Sistem: TA {academicYear}
            </p>
          </motion.div>

          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="h-16 px-10 rounded-3xl border-slate-100 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <ArrowLeft size={18} className="mr-3" /> Kembali ke Database
          </Button>
        </section>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: INTERACTIVE UPLOAD (3D CLAYMORPHISM) */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); if(e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); }}
              className={`relative group bg-white border-4 border-dashed rounded-[4rem] p-16 transition-all duration-500 flex flex-col items-center justify-center text-center ${
                dragActive ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-slate-100 hover:border-blue-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)]'
              }`}
            >
              <input type="file" id="dropzone" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
              <label htmlFor="dropzone" className="cursor-pointer w-full h-full">
                <div className={`w-32 h-32 rounded-[2.5rem] mx-auto flex items-center justify-center mb-10 transition-all duration-700 shadow-2xl ${
                  file ? 'bg-emerald-500 text-white rotate-[360deg] shadow-emerald-500/20' : 'bg-blue-50 text-blue-600 group-hover:scale-110 shadow-blue-500/10'
                }`}>
                  {file ? <ShieldCheck size={60} /> : <UploadCloud size={60} />}
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-3 uppercase tracking-tighter">
                  {file ? 'File Terdeteksi' : 'Import Dokumen'}
                </h3>
                <p className="text-slate-400 font-bold text-sm italic max-w-xs mx-auto">
                  {file ? file.name : 'Tarik file Excel Dapodik Anda ke sini atau klik untuk memilih manual.'}
                </p>
              </label>

              {file && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-10 pt-10 border-t border-slate-50 w-full flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Metadata Ukuran</p>
                    <p className="font-black text-slate-600">{(file.size / 1024).toFixed(2)} KB</p>
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
              className="w-full h-24 bg-blue-600 hover:bg-blue-700 text-white rounded-[2.5rem] font-black text-2xl shadow-[0_15px_0_0_#1e40af] active:shadow-none active:translate-y-4 transition-all flex items-center justify-center gap-5 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <RefreshCcw className="animate-spin" size={32} /> 
                  <span className="tracking-tighter">MENGANALISIS DATA...</span>
                </>
              ) : (
                <>
                  PROSES INTEGRASI <ChevronRight size={32} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </motion.button>
          </div>

          {/* RIGHT COLUMN: SMART INFO & RESULTS (BENTO BOXES) */}
          <div className="lg:col-span-5 space-y-8">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div 
                  key="guide"
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="space-y-8"
                >
                  {/* BENTO BOX 1: SMART MAPPING INFO */}
                  <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-3">
                        <Cpu className="text-blue-400" /> Auto-Mapper
                      </h3>
                      <Sparkles className="text-amber-400 animate-pulse" />
                    </div>
                    <ul className="space-y-6">
                      <GuideItem num="01" title="Format Bebas" desc="Gunakan file Excel Dapodik langsung tanpa merubah urutan kolom." />
                      <GuideItem num="02" title="Deteksi Cerdas" desc="AI mendeteksi header 'NISN', 'Nama', dan 'Tgl Lahir' secara otomatis." />
                      <GuideItem num="03" title="Validasi Lapis" desc="Sistem otomatis memfilter NISN ganda dan format tanggal tidak valid." />
                    </ul>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
                  </div>

                  {/* BENTO BOX 2: TEMPLATE DOWNLOAD */}
                  <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm group hover:border-blue-200 transition-colors">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Butuh Struktur Data?</h4>
                    <button 
                      onClick={downloadTemplate}
                      className="w-full py-6 bg-[#F8FAFC] hover:bg-blue-600 hover:text-white rounded-[2rem] flex items-center justify-center gap-4 transition-all duration-300 group"
                    >
                      <Download className="text-blue-500 group-hover:text-white" />
                      <span className="font-black text-xs uppercase tracking-widest">Download Template CSV</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="result"
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="bg-emerald-50 border-4 border-emerald-100 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden"
                >
                  <div className="flex items-center gap-5 mb-12 relative z-10">
                    <div className="w-20 h-20 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-emerald-500/30 animate-bounce">
                      <CheckCircle2 size={40} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-emerald-900 leading-none tracking-tighter uppercase">Sinkronisasi Berhasil</h3>
                      <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest mt-2 italic">Database Terintegrasi Penuh</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 relative z-10">
                    <ResultCard label="Siswa Baru" value={result.successCount} color="emerald" />
                    <ResultCard label="Data Duplikat" value={result.duplicateCount} color="amber" />
                  </div>

                  <div className="mt-12 p-6 bg-white/50 rounded-3xl border border-emerald-100 relative z-10">
                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest text-center mb-1">Status Sesi</p>
                    <p className="text-xs font-bold text-emerald-600 text-center italic leading-relaxed">
                      Sistem sedang meregenerasi indeks ranking. <br /> Pengalihan otomatis dalam 5 detik...
                    </p>
                  </div>
                  
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ERROR ALERT (ALPHA STYLE) */}
            {error && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-red-50 border-2 border-red-100 p-8 rounded-[2.5rem] flex gap-5 text-red-600 shadow-xl">
                <AlertTriangle className="shrink-0" size={32} />
                <div>
                  <p className="font-black text-sm uppercase tracking-wider mb-1">Mapping Integrity Error</p>
                  <p className="text-xs font-bold opacity-80 leading-relaxed italic">{error}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* 3. SYSTEM FOOTER */}
        <footer className="mt-24 py-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            &copy; {new Date().getFullYear()} SMKN 1 Kademangan - Professional Data Center v2.0
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <MousePointer2 size={16} className="animate-bounce" />
          </div>
        </footer>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function GuideItem({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <li className="flex gap-5 group">
      <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-black text-xs text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
        {num}
      </div>
      <div>
        <p className="font-black text-sm uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors">{title}</p>
        <p className="text-xs font-bold text-slate-500 leading-relaxed italic">{desc}</p>
      </div>
    </li>
  );
}

function ResultCard({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 text-center transform hover:scale-105 transition-transform duration-500">
      <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] mb-2">{label}</p>
      <p className={`text-5xl font-black ${color === 'emerald' ? 'text-emerald-600' : 'text-amber-500'} tracking-tighter`}>
        {value}
      </p>
    </div>
  );
}