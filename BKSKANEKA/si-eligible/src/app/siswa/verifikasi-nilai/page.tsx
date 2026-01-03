'use client';

/**
 * ==============================================================================
 * SI-ELIGIBLE GRADE VERIFICATION v5.0 - ALPHA GEN PRO
 * ==============================================================================
 * Style       : Alpha-Gen Professional 3D (Neat & Calibrated)
 * Logic       : Intelligent Dispute (Sanggahan) & Direct Verification
 * Calibration : Optimized for 100% Desktop Scaling
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
  Zap, 
  ShieldCheck,
  ChevronRight,
  Layers,
  Upload
} from 'lucide-react';

// --- INTERFACES ---
interface Sanggahan {
  id: string;
  status: string; // pending, approved, rejected
  nilaiBaru: number;
  alasan?: string;
  keterangan?: string;
  createdAt: string;
  reviewedAt?: string;
}

interface Nilai {
  id: string;
  semester: number;
  mataPelajaran: string;
  nilai: number;
  isVerified: boolean;
  sanggahan?: Sanggahan[];
}

interface SiswaInfo {
  nisn: string;
  nama: string;
  kelas: string;
  jurusan: string;
}

interface NilaiResponse {
  success: boolean;
  data: {
    siswa: SiswaInfo;
    nilaiPerSemester: Record<number, Nilai[]>;
    statsPerSemester: Record<number, { totalMapel: number; rataRata: number }>;
    totalStats: { 
        totalNilai: number; 
        verified: number; 
        unverified: number; 
        rataRataKeseluruhan: number 
    };
  };
}

export default function VerifikasiNilaiPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<NilaiResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [showSanggahModal, setShowSanggahModal] = useState(false);
  const [selectedNilai, setSelectedNilai] = useState<Nilai | null>(null);

  const fetchNilai = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/siswa/nilai`);
      if (res.ok) {
        const response: NilaiResponse = await res.json();
        setData(response.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) fetchNilai();
  }, [session, fetchNilai]);

  const handleVerify = async (nilaiId: string) => {
    const res = await fetch(`/api/siswa/nilai/${nilaiId}/verify`, { method: 'POST' });
    if (res.ok) fetchNilai();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFEFF] flex flex-col items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-[6px] border-slate-100 border-t-purple-600 rounded-full" />
        <p className="mt-6 font-black text-slate-300 uppercase tracking-[0.3em] text-[10px] italic">Synchronizing Neural Rapor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-10 font-sans relative overflow-x-hidden">
      
      {/* 1. LAYER AMBIENT */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-5%] right-[-5%] w-[50%] h-[50%] bg-purple-400/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto">
        
        {/* --- 2. HEADER --- */}
        <header className="mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-600 rounded-2xl text-white shadow-xl">
                <FileText size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600 leading-none mb-1">Audit Protocol v5.0</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter italic">Student: {data?.siswa.nisn}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
              Verifikasi <span className="text-purple-600 underline decoration-8 underline-offset-4">Nilai.</span>
            </h1>
          </motion.div>
        </header>

        {/* --- 3. STATS BENTO GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard label="Total Entry" value={data?.totalStats.totalNilai} icon={<Layers />} color="slate" />
          <StatCard label="Verified" value={data?.totalStats.verified} icon={<CheckCircle2 />} color="emerald" />
          <StatCard label="Pending" value={data?.totalStats.unverified} icon={<AlertCircle />} color="orange" />
          <StatCard label="Average GPA" value={data?.totalStats.rataRataKeseluruhan.toFixed(2)} icon={<TrendingUp />} color="purple" />
        </div>

        {/* --- 4. SEMESTER NAVIGATION --- */}
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

        {/* --- 5. DATA TERMINAL --- */}
        <div className="bg-white rounded-[3.5rem] p-8 md:p-12 border-4 border-white shadow-[0_40px_80px_rgba(0,0,0,0.04)] mb-20">
          <div className="flex justify-between items-end mb-10 px-4">
             <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Detailed Report</span>
                <h2 className="text-3xl font-black text-slate-950 uppercase italic tracking-tighter leading-none mt-1">Audit List.</h2>
             </div>
             {data?.statsPerSemester[selectedSemester] && (
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Semester Mean</p>
                   <p className="text-4xl font-black text-purple-600 italic tracking-tighter">
                     {data.statsPerSemester[selectedSemester].rataRata.toFixed(2)}
                   </p>
                </div>
             )}
          </div>

          <div className="space-y-4">
            {!data?.nilaiPerSemester[selectedSemester] || data.nilaiPerSemester[selectedSemester].length === 0 ? (
              <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border-4 border-dashed border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No Data Injected</p>
              </div>
            ) : (
              data.nilaiPerSemester[selectedSemester].map((nilai, idx) => (
                <motion.div
                  key={nilai.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                  className="group bg-white p-6 md:p-8 rounded-[2.5rem] border-4 border-slate-50 hover:border-purple-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-6">
                     <div className="w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center font-black italic text-lg shadow-xl group-hover:rotate-12 transition-transform">
                        {nilai.mataPelajaran.charAt(0)}
                     </div>
                     <div>
                        <h3 className="font-black text-slate-800 uppercase italic tracking-tighter text-xl leading-none mb-2">{nilai.mataPelajaran}</h3>
                        <div className="flex gap-2 flex-wrap">
                           <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${nilai.isVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                              {nilai.isVerified ? 'Verified' : 'Pending'}
                           </span>
                           {nilai.sanggahan && nilai.sanggahan.length > 0 && (
                              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                 nilai.sanggahan[0].status === 'approved' ? 'bg-blue-100 text-blue-600' :
                                 nilai.sanggahan[0].status === 'rejected' ? 'bg-red-100 text-red-600' :
                                 'bg-yellow-100 text-yellow-600'
                              }`}>
                                 Sanggah: {nilai.sanggahan[0].status === 'approved' ? 'Disetujui' : nilai.sanggahan[0].status === 'rejected' ? 'Ditolak' : 'Diproses'}
                              </span>
                           )}
                        </div>
                        {nilai.sanggahan && nilai.sanggahan.length > 0 && nilai.sanggahan[0].status === 'rejected' && nilai.sanggahan[0].alasan && (
                           <div className="mt-2 p-3 bg-red-50 rounded-xl border-2 border-red-100">
                              <p className="text-[9px] font-black uppercase tracking-widest text-red-400 mb-1">Alasan Ditolak:</p>
                              <p className="text-xs text-red-600 font-medium">{nilai.sanggahan[0].alasan}</p>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-12">
                     <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest leading-none mb-2">Neural Grade</p>
                        <p className="text-4xl font-black text-slate-950 italic tracking-tighter leading-none">{nilai.nilai}</p>
                     </div>
                     
                     <div className="flex gap-2">
                        {!nilai.isVerified && (
                          <>
                            {/* Disable buttons jika ada sanggahan pending */}
                            {nilai.sanggahan && nilai.sanggahan.length > 0 && nilai.sanggahan[0].status === 'pending' ? (
                              <div className="px-6 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest cursor-not-allowed">
                                Menunggu Review
                              </div>
                            ) : (
                              <>
                                <button onClick={() => handleVerify(nilai.id)} className="px-6 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-[0_8px_0_0_#059669] active:translate-y-2 active:shadow-none transition-all">
                                   Sesuai
                                </button>
                                <button onClick={() => { setSelectedNilai(nilai); setShowSanggahModal(true); }} className="px-6 py-4 bg-red-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-[0_8px_0_0_#b91c1c] active:translate-y-2 active:shadow-none transition-all">
                                   Sanggah
                                </button>
                              </>
                            )}
                          </>
                        )}
                     </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* --- 6. DISPUTE MODAL (SANGGAHAN) --- */}
        <AnimatePresence>
          {showSanggahModal && selectedNilai && (
            <SanggahModal 
              nilai={selectedNilai} 
              onClose={() => setShowSanggahModal(false)} 
              onSuccess={() => { setShowSanggahModal(false); fetchNilai(); }} 
            />
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ label, value, icon, color }: any) {
  const colorMap: any = {
    slate: "text-slate-950 border-slate-100",
    emerald: "text-emerald-600 border-emerald-100",
    orange: "text-orange-600 border-orange-100",
    purple: "text-purple-600 border-purple-100"
  };

  return (
    <div className={`bg-white rounded-[2.5rem] p-8 border-4 shadow-xl flex flex-col justify-between group ${colorMap[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{label}</span>
        <div className="p-2 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
      </div>
      <p className="text-4xl font-black italic tracking-tighter leading-none">{value || 0}</p>
    </div>
  );
}

function SanggahModal({ nilai, onClose, onSuccess }: any) {
  const [nilaiBaru, setNilaiBaru] = useState(nilai.nilai.toString());
  const [buktiRapor, setBuktiRapor] = useState<File | null>(null);
  const [buktiPreview, setBuktiPreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBuktiRapor(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBuktiPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/siswa/sanggahan', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nilaiId: nilai.id,
          nilaiBaru: parseFloat(nilaiBaru),
          keterangan: `Sanggahan nilai ${nilai.mataPelajaran}`,
          buktiRapor: buktiPreview || null // Send base64 image
        })
      });
      
      if (res.ok) onSuccess();
      else {
        const data = await res.json();
        alert(data.error || 'Gagal submit sanggahan');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[3.5rem] p-10 md:p-14 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        <div className="flex justify-between items-start mb-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Dispute Terminal</span>
            <h3 className="text-4xl font-black uppercase italic tracking-tighter text-slate-950 mt-2">Audit <span className="text-red-500">Request.</span></h3>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
             <div className="p-6 bg-slate-50 rounded-3xl border-4 border-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2">System Grade</p>
                <p className="text-5xl font-black text-slate-950 italic">{nilai.nilai}</p>
             </div>
             <div className="p-6 bg-red-50 rounded-3xl border-4 border-red-100 flex flex-col justify-center">
                <label className="text-[10px] font-black uppercase text-red-400 mb-2">Correct Grade</label>
                <input
                  type="number" step="0.01" value={nilaiBaru} required
                  onChange={(e) => setNilaiBaru(e.target.value)}
                  className="bg-transparent border-none p-0 text-5xl font-black text-red-600 focus:ring-0 placeholder:text-red-200"
                  placeholder="0.00"
                />
             </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">Neural Justification (Upload Evidence)</label>
            {buktiPreview ? (
              <div className="relative rounded-[2rem] overflow-hidden border-4 border-emerald-100 bg-emerald-50 max-h-64">
                <img src={buktiPreview} alt="Preview" className="w-full h-full object-contain max-h-60" />
                <button
                  type="button"
                  onClick={() => { setBuktiRapor(null); setBuktiPreview(''); }}
                  className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-xl"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="relative h-32 rounded-[2rem] border-4 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center gap-2 group hover:border-red-200 transition-all">
                <Upload size={24} className="text-slate-300 group-hover:text-red-500" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Drop Report Photo Here
                </p>
                <input 
                  type="file" accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 h-20 bg-slate-100 text-slate-400 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-slate-200 transition-all">
              Abort
            </button>
            <button
              type="submit" disabled={submitting}
              className="flex-1 h-20 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_12px_24px_rgba(0,0,0,0.2)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {submitting ? 'Processing...' : <><Zap size={18} fill="currentColor" className="text-purple-500" /> Execute Audit</>}
            </button>
          </div>
        </form>

        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[80px] pointer-events-none" />
      </motion.div>
    </motion.div>
  );
}