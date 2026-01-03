'use client';

/**
 * ==============================================================================
 * SI-ELIGIBLE GRADUATION REPORTING v5.0 - LOCAL DATABASE SYSTEM
 * ==============================================================================
 * Style       : Alpha-Gen Professional 3D (Neat & Calibrated)
 * Logic       : Local Database Campus & Major Search + Proof of Acceptance Upload
 * Calibration : Optimized for 100% Desktop Scaling
 * Feature     : Automated Campus & Major Discovery
 * ==============================================================================
 */

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Search, 
  Upload, 
  CheckCircle2, 
  RefreshCcw, 
  Building2, 
  BookOpen, 
  Zap, 
  ArrowRight, 
  FileText,
  AlertCircle,
  ShieldCheck,
  XCircle,
  Cpu
} from 'lucide-react';

// --- INTERFACES ---
interface Kelulusan {
  id: string;
  status: string;
  jalur: string;
  buktiPenerimaan: string | null;
  kampusNama?: string;
  jurusanNama?: string;
  createdAt: string;
  kampus?: {
    namaKampus: string;
  };
  jurusan?: {
    namaJurusan: string;
  };
}

export default function LaporKelulusanPage() {
  const { data: session } = useSession();
  
  // States
  const [kelulusanList, setKelulusanList] = useState<Kelulusan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // PDDIKTI States
  const [searchCampusQuery, setSearchCampusQuery] = useState("");
  const [campusResults, setCampusResults] = useState<any[]>([]);
  const [prodiList, setProdiList] = useState<any[]>([]);
  const [loadingCampus, setLoadingCampus] = useState(false);
  const [loadingProdi, setLoadingProdi] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    status: '',
    jenisKampus: '', // PTN, PTS, PTKIN
    jalur: '',
    kampusNama: '',
    jurusanNama: '',
    buktiPenerimaan: null as File | null
  });

  // --- LOGIC: FETCH INITIAL DATA ---
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/siswa/kelulusan');
      if (res.ok) {
        const data = await res.json();
        setKelulusanList(data || []);
      }
    } catch (error) {
      console.error('Fetch Protocol Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) fetchData();
  }, [session, fetchData]);

  // --- LOGIC: LOCAL DATABASE SEARCH KAMPUS ---
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchCampusQuery.length >= 3 && formData.jenisKampus) {
        setLoadingCampus(true);
        try {
          const res = await fetch(`/api/siswa/search-kampus?query=${searchCampusQuery}&jenisKampus=${formData.jenisKampus}`);
          const data = await res.json();
          setCampusResults(data);
        } finally {
          setLoadingCampus(false);
        }
      } else {
        setCampusResults([]);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [searchCampusQuery, formData.jenisKampus]);

  // --- LOGIC: FETCH PRODI SETELAH KAMPUS DIPILIH ---
  const handleSelectCampus = async (campus: any) => {
    setFormData({ ...formData, kampusNama: campus.namaKampus, jurusanNama: '' });
    setCampusResults([]);
    setSearchCampusQuery("");
    setLoadingProdi(true);
    try {
      const res = await fetch(`/api/siswa/search-jurusan?kampusId=${campus.id}`);
      const data = await res.json();
      setProdiList(data);
    } finally {
      setLoadingProdi(false);
    }
  };

  // --- LOGIC: SAVE ACTION ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.status) return alert('Pilih status kelulusan!');
    if (!formData.jalur) return alert('Pilih jalur masuk!');
    
    // Validasi untuk status lulus
    if (formData.status === 'lulus') {
      if (!formData.kampusNama || !formData.jurusanNama) {
        return alert('Kampus dan jurusan wajib diisi untuk status lulus!');
      }
      if (!formData.buktiPenerimaan) {
        return alert('Bukti penerimaan wajib diupload untuk status lulus!');
      }
    }
    
    setSaving(true);
    try {
      const submitData = new FormData();
      submitData.append('status', formData.status);
      submitData.append('jalur', formData.jalur);
      
      if (formData.status === 'lulus') {
        submitData.append('kampusNama', formData.kampusNama);
        submitData.append('jurusanNama', formData.jurusanNama);
        if (formData.buktiPenerimaan) {
          submitData.append('buktiPenerimaan', formData.buktiPenerimaan);
        }
      }

      const res = await fetch('/api/siswa/kelulusan', {
        method: 'POST',
        body: submitData
      });

      if (res.ok) {
        alert('Data Kelulusan Berhasil Disimpan!');
        // Reset form
        setFormData({
          status: '',
          jenisKampus: '',
          jalur: '',
          kampusNama: '',
          jurusanNama: '',
          buktiPenerimaan: null
        });
        setSearchCampusQuery('');
        setCampusResults([]);
        setProdiList([]);
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || 'Gagal Menyimpan Data Kelulusan');
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan saat menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFEFF] flex flex-col items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-[8px] border-slate-100 border-t-purple-600 rounded-full shadow-2xl" />
        <p className="mt-8 font-black text-slate-300 uppercase tracking-[0.4em] text-[10px] animate-pulse italic">Loading Graduation Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-10 font-sans text-slate-900 relative overflow-x-hidden selection:bg-purple-600 selection:text-white">
      
      {/* 1. AMBIENT BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-5%] right-[-5%] w-[50%] h-[50%] bg-purple-400/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto">
        
        {/* --- 2. HEADER: ALPHA COMMAND --- */}
        <header className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-purple-600 rounded-2xl text-white shadow-[0_15px_30px_rgba(147,51,234,0.3)] transform hover:rotate-12 transition-all">
                <GraduationCap size={24} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600 leading-none mb-1">Graduation Terminal v5.0</span>
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-2 uppercase tracking-tighter">
                  <Cpu size={12} /> Database System Reporting
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 leading-none uppercase italic">
              Lapor <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 underline decoration-8">Kelulusan.</span>
            </h1>
          </motion.div>

          <div className="hidden xl:flex flex-col items-end opacity-30">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Sync Status</p>
             <p className="text-base font-black text-slate-950 italic leading-none uppercase">Ready for Ingest</p>
          </div>
        </header>

        {/* --- 3. SMART INFO BENTO --- */}
        <div className="bg-slate-950 rounded-[3rem] p-10 text-white mb-12 relative overflow-hidden group border-b-[15px] border-purple-600 shadow-2xl">
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center text-purple-400 shadow-inner group-hover:rotate-12 transition-all duration-700">
                 <ShieldCheck size={40} />
              </div>
              <div className="flex-1 text-center md:text-left">
                 <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">Petunjuk Pelaporan</h3>
                 <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest opacity-80">
                   Gunakan fitur <span className="text-purple-400">Smart Search</span> untuk mencari kampus tujuan. Data ditarik secara live dari PDDIKTI untuk akurasi statistik alumni SMKN 1 Kademangan.
                 </p>
              </div>
           </div>
           <div className="absolute top-0 right-0 w-[50%] h-full bg-purple-600/10 blur-[100px] pointer-events-none" />
        </div>

        {/* --- 4. FORM ARCHITECTURE --- */}
        <section className="bg-white rounded-[4rem] border-4 border-white shadow-[0_30px_60px_rgba(0,0,0,0.05)] p-10 md:p-14 mb-20 relative overflow-hidden">
          
          <form onSubmit={handleSave} className="space-y-12 relative z-10">
            
            {/* STATUS SELECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => setFormData({...formData, status: 'lulus'})}
                className={`p-10 rounded-[3rem] border-4 transition-all cursor-pointer flex flex-col items-center text-center gap-5 group ${formData.status === 'lulus' ? 'border-emerald-500 bg-emerald-50 shadow-emerald-500/10' : 'border-slate-50 bg-[#F8FAFC] hover:border-emerald-200'}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${formData.status === 'lulus' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:rotate-12'}`}>
                  <CheckCircle2 size={32} />
                </div>
                <p className={`font-black uppercase tracking-widest text-sm ${formData.status === 'lulus' ? 'text-emerald-700' : 'text-slate-400'}`}>Lulus / Diterima</p>
              </div>

              <div 
                onClick={() => setFormData({...formData, status: 'tidak_lulus'})}
                className={`p-10 rounded-[3rem] border-4 transition-all cursor-pointer flex flex-col items-center text-center gap-5 group ${formData.status === 'tidak_lulus' ? 'border-red-500 bg-red-50 shadow-red-500/10' : 'border-slate-50 bg-[#F8FAFC] hover:border-red-200'}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${formData.status === 'tidak_lulus' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:rotate-12'}`}>
                  <XCircle size={32} />
                </div>
                <p className={`font-black uppercase tracking-widest text-sm ${formData.status === 'tidak_lulus' ? 'text-red-700' : 'text-slate-400'}`}>Tidak Lulus</p>
              </div>
            </div>

            {/* CONDITIONAL FORM: LULUS */}
            <AnimatePresence mode="wait">
              {formData.status === 'lulus' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                  
                  {/* Step 1: SELECT JENIS KAMPUS */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 mb-4 block italic">Pilih Tipe Kampus</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['PTN', 'PTS', 'PTKIN'].map((jenis) => (
                        <button 
                          key={jenis} type="button" 
                          onClick={() => setFormData({...formData, jenisKampus: jenis, jalur: '', kampusNama: '', jurusanNama: ''})}
                          className={`px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${formData.jenisKampus === jenis ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                          {jenis}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: SELECT JALUR MASUK (based on jenisKampus) */}
                  {formData.jenisKampus && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 mb-4 block italic">Pilih Jalur Masuk</label>
                    <div className="flex flex-wrap gap-4">
                      {formData.jenisKampus === 'PTN' && ['SNBP', 'SNBT', 'Mandiri'].map((j) => (
                        <button 
                          key={j} type="button" onClick={() => setFormData({...formData, jalur: j})}
                          className={`px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${formData.jalur === j ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                          {j}
                        </button>
                      ))}
                      {formData.jenisKampus === 'PTKIN' && ['SPAN-PTKIN', 'UM-PTKIN', 'Mandiri'].map((j) => (
                        <button 
                          key={j} type="button" onClick={() => setFormData({...formData, jalur: j})}
                          className={`px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${formData.jalur === j ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                          {j}
                        </button>
                      ))}
                      {formData.jenisKampus === 'PTS' && ['Mandiri', 'Beasiswa'].map((j) => (
                        <button 
                          key={j} type="button" onClick={() => setFormData({...formData, jalur: j})}
                          className={`px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${formData.jalur === j ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                          {j}
                        </button>
                      ))}
                    </div>
                  </div>
                  )}

                  {/* Step 3: KAMPUS SMART SEARCH (only if jenisKampus & jalur selected) */}
                  {formData.jenisKampus && formData.jalur && (
                  <div className="relative">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 mb-4 block italic">Cari Perguruan Tinggi (Database Lokal)</label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                        {loadingCampus ? <RefreshCcw size={22} className="animate-spin" /> : <Building2 size={22} />}
                      </div>
                      <input 
                        type="text" placeholder="Ketik minimal 3 huruf nama kampus..."
                        value={formData.kampusNama || searchCampusQuery}
                        onChange={(e) => {
                          setSearchCampusQuery(e.target.value);
                          setFormData({...formData, kampusNama: ''});
                        }}
                        className="w-full h-20 pl-16 pr-8 rounded-[2rem] bg-[#F8FAFC] border-none font-black text-slate-800 placeholder:text-slate-300 shadow-inner focus:ring-8 focus:ring-purple-500/5 transition-all"
                      />
                    </div>

                    {/* Dropdown Results */}
                    <AnimatePresence>
                      {campusResults.length > 0 && (
                        <motion.div className="absolute top-24 left-0 w-full bg-white rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.15)] z-50 overflow-hidden border border-slate-100">
                          {campusResults.map((campus) => (
                            <button key={campus.id} type="button" onClick={() => handleSelectCampus(campus)}
                              className="w-full p-6 text-left hover:bg-purple-50 flex items-center justify-between group transition-all"
                            >
                              <span className="font-black text-slate-700 uppercase italic tracking-tighter">{campus.namaKampus}</span>
                              <ArrowRight size={18} className="text-slate-300 group-hover:translate-x-2 transition-all" />
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  )}

                  {/* Step 4: JURUSAN SMART SELECT */}
                  {formData.kampusNama && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 mb-4 block italic">Pilih Program Studi</label>
                      <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                          {loadingProdi ? <RefreshCcw size={22} className="animate-spin" /> : <BookOpen size={22} />}
                        </div>
                        <select 
                          value={formData.jurusanNama}
                          onChange={(e) => setFormData({...formData, jurusanNama: e.target.value})}
                          className="w-full h-20 pl-16 pr-8 rounded-[2rem] bg-[#F8FAFC] border-none font-black text-slate-800 shadow-inner appearance-none cursor-pointer focus:ring-8 focus:ring-purple-500/5 transition-all"
                        >
                          <option value="">{loadingProdi ? "Loading Programs..." : "Pilih Jurusan"}</option>
                          {prodiList.map((prodi, idx) => (
                            <option key={idx} value={prodi.namaJurusan}>{prodi.namaJurusan} ({prodi.jenjang})</option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* UPLOAD EVIDENCE */}
                  <div className="pt-6 border-t border-slate-50">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 mb-4 block italic">Upload Bukti Penerimaan (PDF/Image)</label>
                    <div className={`relative h-40 rounded-[2.5rem] border-4 border-dashed transition-all flex flex-col items-center justify-center gap-3 group ${formData.buktiPenerimaan ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50 hover:border-purple-200'}`}>
                       <Upload size={32} className={`${formData.buktiPenerimaan ? 'text-emerald-500' : 'text-slate-300'}`} />
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                         {formData.buktiPenerimaan ? formData.buktiPenerimaan.name : "Drop File or Click to Upload"}
                       </p>
                       <input 
                         type="file" accept="image/*,.pdf" 
                         onChange={(e) => setFormData({...formData, buktiPenerimaan: e.target.files?.[0] || null})}
                         className="absolute inset-0 opacity-0 cursor-pointer" 
                       />
                    </div>
                  </div>

                </motion.div>
              )}

              {/* CONDITIONAL FORM: TIDAK LULUS */}
              {formData.status === 'tidak_lulus' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                  <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8">
                    <div className="flex items-start gap-4">
                      <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
                      <div>
                        <h4 className="font-black text-red-700 uppercase text-sm mb-2">Informasi Pelaporan Tidak Lulus</h4>
                        <p className="text-xs text-red-600 leading-relaxed">
                          Anda dapat melaporkan hasil seleksi yang tidak lulus untuk setiap jalur yang Anda ikuti. 
                          Data ini membantu sekolah dalam monitoring statistik alumni.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* JALUR SELECTION FOR TIDAK LULUS */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 mb-4 block italic">Pilih Jalur Yang Tidak Lulus</label>
                    <div className="flex flex-wrap gap-4">
                      {['SNBP', 'SNBT', 'SPAN-PTKIN', 'UM-PTKIN', 'Mandiri', 'Beasiswa'].map((j) => (
                        <button 
                          key={j} type="button" onClick={() => setFormData({...formData, jalur: j})}
                          className={`px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${formData.jalur === j ? 'bg-red-600 text-white shadow-xl shadow-red-500/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                          {j}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={saving}
              className="w-full h-20 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {saving ? <RefreshCcw size={22} className="animate-spin" /> : <Zap size={22} fill="currentColor" className="text-purple-400" />}
              {saving ? 'INJECTING DATA...' : 'SUBMIT REPORT'}
            </motion.button>

          </form>

          <div className="absolute -bottom-20 -right-20 opacity-[0.03] pointer-events-none">
             <Cpu size={400} />
          </div>
        </section>

        {/* --- 5. SUBMISSION HISTORY --- */}
        {kelulusanList.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-20">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-1 bg-purple-600 rounded-full" />
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Riwayat Laporan</h3>
             </div>
             <div className="space-y-6">
               {kelulusanList.map((item, index) => (
                 <div key={item.id} className="bg-white rounded-[3rem] p-8 border-4 border-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                       <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl flex-shrink-0 ${item.status === 'lulus' ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-red-500 shadow-red-500/30'}`}>
                          {item.status === 'lulus' ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                       </div>
                       <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl font-black text-slate-950 uppercase italic tracking-tighter leading-none">
                              {item.status === 'lulus' ? 'Diterima' : 'Tidak Lulus'}
                            </h4>
                            <span className="px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-[9px] font-black uppercase tracking-wider">
                              {item.jalur}
                            </span>
                          </div>
                          {item.status === 'lulus' && item.kampus && item.jurusan && (
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide leading-none">
                              {item.kampus.namaKampus} • {item.jurusan.namaJurusan}
                            </p>
                          )}
                          <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wider">
                            {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          </motion.div>
        )}

        <footer className="mt-32 py-16 text-center opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
            Infrastructure Intelligence Reporting v4.2 Stable Build
          </p>
        </footer>

      </main>

    </div>
  );
}