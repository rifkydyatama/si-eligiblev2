'use client';

/**
 * ==============================================================================
 * SI-ELIGIBLE GRADE VERIFICATION v5.0 - ALPHA GEN PRO
 * ==============================================================================
 * Style       : Alpha-Gen Professional 3D (Neat & Calibrated)
 * Logic       : Intelligent Dispute (Sanggahan) System
 * Calibration : Optimized for 100% Desktop Scaling
 * Theme       : Purple-Indigo Neural Interface
 * ==============================================================================
 */

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  X, 
  MessageSquare, 
  TrendingUp, 
  Cpu, 
  ChevronRight, 
  Layers,
  Zap,
  ShieldCheck
} from 'lucide-react';

// --- INTERFACES ---
interface Nilai {
  id: string;
  semester: number;
  mataPelajaran: string;
  nilai: number;
  isVerified: boolean;
}

interface ApiResponse {
  success: boolean;
  data: {
    siswa: { nisn: string; nama: string; kelas: string; jurusan: string };
    nilaiPerSemester: Record<number, Nilai[]>;
    statsPerSemester: Record<number, any>;
    totalStats: any;
  };
}

export default function VerifikasiNilaiPage() {
  const { data: session } = useSession();
  const [nilaiData, setNilaiData] = useState<ApiResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSanggahModal, setShowSanggahModal] = useState(false);
  const [selectedNilai, setSelectedNilai] = useState<Nilai | null>(null);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [sanggahForm, setSanggahForm] = useState({ nilaiBaru: '', keterangan: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchNilai = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/siswa/nilai`);
      if (res.ok) {
        const response: ApiResponse = await res.json();
        setNilaiData(response.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) fetchNilai();
  }, [session, fetchNilai]);

  const handleSanggah = (n: Nilai) => {
    setSelectedNilai(n);
    setSanggahForm({ nilaiBaru: '', keterangan: '' });
    setShowSanggahModal(true);
  };

  const handleSubmitSanggahan = async () => {
    if (!selectedNilai || !sanggahForm.nilaiBaru) return alert('Mohon isi nilai baru');
    const nilaiBaru = parseFloat(sanggahForm.nilaiBaru);
    if (isNaN(nilaiBaru) || nilaiBaru < 0 || nilaiBaru > 100) return alert('Nilai tidak valid');

    setSubmitting(true);
    try {
      const res = await fetch('/api/siswa/sanggahan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nilaiId: selectedNilai.id,
          nilaiBaru,
          keterangan: sanggahForm.keterangan
        })
      });
      if (res.ok) {
        setShowSanggahModal(false);
        fetchNilai();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFEFF] flex flex-col items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-[6px] border-slate-100 border-t-purple-600 rounded-full" />
        <p className="mt-6 font-black text-slate-300 uppercase tracking-[0.3em] text-[10px] italic animate-pulse">Synchronizing Neural Rapor...</p>
      </div>
    );
  }

  const currentSemesterData = nilaiData?.nilaiPerSemester[selectedSemester] || [];
  const currentStats = nilaiData?.statsPerSemester[selectedSemester];

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-10 font-sans relative overflow-x-hidden">
      
      {/* 1. AMBIENT BACKGROUND blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-5%] right-[-5%] w-[50%] h-[50%] bg-purple-400/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto">
        
        {/* --- 2. HEADER: ALPHA COMMAND --- */}
        <header className="mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-600 rounded-2xl text-white shadow-xl transform hover:rotate-12 transition-all">
                <FileText size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600 leading-none mb-1">Neural Verification v5.0</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter italic">Data Status: Ready to Audit</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
              Verifikasi <span className="text-purple-600 underline decoration-8 underline-offset-4">Nilai.</span>
            </h1>
            <p className="text-slate-400 font-bold mt-4 uppercase tracking-widest text-xs flex items-center gap-2">
              <Cpu size={14} /> {nilaiData?.siswa.nama} <span className="text-slate-200">/</span> {nilaiData?.siswa.kelas}
            </p>
          </motion.div>
        </header>

        {/* --- 3. BENTO STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatBento label="Total Entry" value={nilaiData?.totalStats.totalNilai} icon={<Layers />} color="slate" />
          <StatBento label="Verified" value={nilaiData?.totalStats.verified} icon={<CheckCircle2 />} color="emerald" />
          <StatBento label="Pending" value={nilaiData?.totalStats.unverified} icon={<AlertCircle />} color="orange" />
          <StatBento label="Average GPA" value={nilaiData?.totalStats.rataRataKeseluruhan.toFixed(2)} icon={<TrendingUp />} color="purple" />
        </div>

        {/* --- 4. NEURAL INSTRUCTION BOX --- */}
        <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white mb-12 border-b-[10px] border-purple-600 shadow-2xl relative overflow-hidden group">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-purple-400 group-hover:rotate-12 transition-all duration-500">
                    <ShieldCheck size={32} />
                 </div>
                 <div>
                    <h4 className="text-lg font-black uppercase italic tracking-tighter">Prosedur Verifikasi</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Pastikan nilai sesuai dengan Rapor Fisik. Jika terdapat anomali, gunakan tombol sanggah.</p>
                 </div>
              </div>
              <div className="flex gap-2">
                 {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 bg-purple-500/30 rounded-full" />)}
              </div>
           </div>
           <div className="absolute top-0 right-0 w-32 h-full bg-purple-600/10 blur-3xl" />
        </div>

        {/* --- 5. SEMESTER NAVIGATION --- */}
        <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar">
          {[1, 2, 3, 4, 5].map(sem => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-8 py-5 rounded-3xl font-black uppercase tracking-widest text-[11px] transition-all whitespace-nowrap flex items-center gap-3 ${
                selectedSemester === sem
                  ? 'bg-purple-600 text-white shadow-[0_12px_24px_rgba(147,51,234,0.3)] scale-105'
                  : 'bg-white text-slate-400 border-4 border-slate-50 hover:border-purple-100'
              }`}
            >
              Semester {sem}
              {selectedSemester === sem && <Zap size={14} fill="white" />}
            </button>
          ))}
        </div>

        {/* --- 6. GRADE LIST BENTO --- */}
        <div className="bg-white rounded-[3.5rem] p-8 md:p-12 border-4 border-white shadow-[0_40px_80px_rgba(0,0,0,0.04)] mb-20">
          <div className="flex justify-between items-end mb-10 px-4">
             <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Detailed Report</span>
                <h2 className="text-3xl font-black text-slate-950 uppercase italic tracking-tighter leading-none mt-1">
                   Audit List.
                </h2>
             </div>
             {currentStats && (
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mean Score</p>
                   <p className="text-4xl font-black text-purple-600 italic tracking-tighter">{currentStats.rataRata.toFixed(2)}</p>
                </div>
             )}
          </div>

          <div className="space-y-4">
            {currentSemesterData.length === 0 ? (
              <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border-4 border-dashed border-slate-100">
                <Layers className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No Data Injected for this Semester</p>
              </div>
            ) : (
              currentSemesterData.map((nilai, idx) => (
                <motion.div
                  key={nilai.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                  className="group relative bg-white p-6 md:p-8 rounded-[2.5rem] border-4 border-slate-50 hover:border-purple-100 transition-all hover:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-6">
                     <div className="w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center font-black italic text-lg shadow-xl group-hover:rotate-12 transition-transform">
                        {nilai.mataPelajaran.charAt(0)}
                     </div>
                     <div>
                        <h3 className="font-black text-slate-800 uppercase italic tracking-tighter text-xl leading-none mb-2">{nilai.mataPelajaran}</h3>
                        <div className="flex items-center gap-3">
                           <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${nilai.isVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                              {nilai.isVerified ? 'Verified' : 'Pending'}
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-12">
                     <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest leading-none mb-2">Neural Grade</p>
                        <p className="text-4xl font-black text-slate-950 italic tracking-tighter leading-none">{nilai.nilai}</p>
                     </div>
                     
                     {!nilai.isVerified && (
                        <button
                          onClick={() => handleSanggah(nilai)}
                          className="px-6 py-4 bg-red-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-[0_8px_0_0_#b91c1c] active:translate-y-2 active:shadow-none transition-all flex items-center gap-2"
                        >
                          <MessageSquare size={16} /> Sanggah
                        </button>
                     )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* --- 7. DISPUTE MODAL: ALPHA STYLE --- */}
        <AnimatePresence>
          {showSanggahModal && selectedNilai && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[3.5rem] p-10 md:p-14 max-w-2xl w-full shadow-2xl relative overflow-hidden">
                
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Dispute Terminal</span>
                    <h3 className="text-4xl font-black uppercase italic tracking-tighter text-slate-950 mt-2">Audit <span className="text-red-500">Request.</span></h3>
                  </div>
                  <button onClick={() => setShowSanggahModal(false)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="p-6 bg-slate-50 rounded-3xl border-4 border-slate-100">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Current Grade</p>
                        <p className="text-5xl font-black text-slate-950 italic">{selectedNilai.nilai}</p>
                     </div>
                     <div className="p-6 bg-red-50 rounded-3xl border-4 border-red-100 flex flex-col justify-center">
                        <label className="text-[10px] font-black uppercase text-red-400 mb-2">Proposed Grade</label>
                        <input
                          type="number" step="0.01" value={sanggahForm.nilaiBaru}
                          onChange={(e) => setSanggahForm({ ...sanggahForm, nilaiBaru: e.target.value })}
                          className="bg-transparent border-none p-0 text-5xl font-black text-red-600 focus:ring-0 placeholder:text-red-200"
                          placeholder="0.00"
                        />
                     </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">Neural Justification (Reason)</label>
                    <textarea
                      value={sanggahForm.keterangan}
                      onChange={(e) => setSanggahForm({ ...sanggahForm, keterangan: e.target.value })}
                      className="w-full h-32 px-6 py-5 rounded-[2rem] border-4 border-slate-50 focus:border-purple-200 font-bold text-slate-800 placeholder:text-slate-200 resize-none shadow-inner"
                      placeholder="Explain why this grade needs audit..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button onClick={() => setShowSanggahModal(false)} className="flex-1 h-20 bg-slate-100 text-slate-400 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-slate-200 transition-all">
                      Abort
                    </button>
                    <button
                      onClick={handleSubmitSanggahan} disabled={submitting || !sanggahForm.nilaiBaru}
                      className="flex-1 h-20 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_12px_24px_rgba(0,0,0,0.2)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {submitting ? 'Processing...' : <><Zap size={18} fill="currentColor" className="text-purple-500" /> Execute Audit</>}
                    </button>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[80px] pointer-events-none" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatBento({ label, value, icon, color }: any) {
  const colorMap: any = {
    slate: "text-slate-950 border-slate-100",
    emerald: "text-emerald-600 border-emerald-100",
    orange: "text-orange-600 border-orange-100",
    purple: "text-purple-600 border-purple-100"
  };

  return (
    <motion.div whileHover={{ y: -5 }} className={`bg-white rounded-[2.5rem] p-8 border-4 shadow-xl flex flex-col justify-between group ${colorMap[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{label}</span>
        <div className="p-2 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
      </div>
      <p className="text-4xl font-black italic tracking-tighter leading-none">{value || 0}</p>
    </motion.div>
  );
}