'use client';

/**
 * ==============================================================================
 * SI-ELIGIBLE PEMINATAN & KIP-K TERMINAL v5.0 - STABLE BUILD
 * ==============================================================================
 * Style       : Alpha-Gen Professional 3D (Neat & Calibrated)
 * Logic       : Local Database Campus & Major Discovery
 * Calibration : Optimized for 100% Desktop Scaling
 * ==============================================================================
 */

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONOGRAPHY ENGINE (ALL REGISTERED & VERIFIED) ---
import { 
  Target, 
  GraduationCap, 
  Search, 
  Building2, 
  BookOpen, 
  Fingerprint, 
  ShieldCheck, 
  Zap, 
  RefreshCcw, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  Sparkles,
  ArrowRight,
  Code2, // FIX: Sekarang sudah di-import dengan benar
  Plus
} from 'lucide-react';

// --- INTERFACES ---
interface Peminatan {
  id: string;
  pilihan: number;
  jalur: string;
  kampusNama: string;
  jurusanNama: string;
  jenjang: string;
}

export default function PeminatanTerminal() {
  const { data: session } = useSession();
  
  // Data States
  const [peminatan, setPeminatan] = useState<Peminatan[]>([]);
  const [mendaftarKIPK, setMendaftarKIPK] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Search & Sync States
  const [searchQuery, setSearchQuery] = useState("");
  const [campusResults, setCampusResults] = useState<any[]>([]);
  const [prodiList, setProdiList] = useState<any[]>([]);
  const [showProdiList, setShowProdiList] = useState(false);
  const [activePilihan, setActivePilihan] = useState<number | null>(null);
  const [loadingCampus, setLoadingCampus] = useState(false);
  const [loadingProdi, setLoadingProdi] = useState(false);

  // Form State Temporary
  const [tempChoice, setTempChoice] = useState({
    jenisKampus: '', // PTN, PTS, PTKIN
    jalur: '',
    kampusNama: '',
    jurusanNama: '',
    jenjang: ''
  });

  // --- LOGIC: FETCH CORE DATA ---
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [peminatanRes, profileRes] = await Promise.all([
        fetch('/api/siswa/peminatan'),
        fetch('/api/siswa/profile')
      ]);

      if (peminatanRes.ok) setPeminatan(await peminatanRes.json());
      if (profileRes.ok) {
        const profile = await profileRes.json();
        setMendaftarKIPK(profile.mendaftarKIPK || false);
      }
    } catch (error) {
      console.error('Database Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) fetchData();
  }, [session, fetchData]);

  // --- LOGIC: LOCAL DATABASE DISCOVERY ---
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 3 && tempChoice.jenisKampus) {
        setLoadingCampus(true);
        try {
          const res = await fetch(`/api/siswa/search-kampus?query=${searchQuery}&jenisKampus=${tempChoice.jenisKampus}`);
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
  }, [searchQuery, tempChoice.jenisKampus]);

  const handleSelectCampus = async (campus: any) => {
    setTempChoice({ ...tempChoice, kampusNama: campus.namaKampus, jurusanNama: '', jenjang: '' });
    setCampusResults([]);
    setSearchQuery("");
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
  const handleSavePilihan = async (num: number) => {
    if (!tempChoice.kampusNama || !tempChoice.jurusanNama) return alert("Lengkapi data kampus dan jurusan!");
    
    setSaving(true);
    try {
      const res = await fetch('/api/siswa/peminatan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tempChoice, pilihan: num })
      });

      if (res.ok) {
        setActivePilihan(null);
        setTempChoice({ jenisKampus: '', jalur: '', kampusNama: '', jurusanNama: '', jenjang: '' });
        fetchData();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (num: number) => {
    if (!confirm(`Hapus Pilihan ${num}?`)) return;
    const res = await fetch(`/api/siswa/peminatan?pilihan=${num}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  const handleKipkSync = async (checked: boolean) => {
    setMendaftarKIPK(checked);
    await fetch('/api/siswa/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mendaftarKIPK: checked })
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFEFF] flex flex-col items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-[8px] border-slate-100 border-t-blue-600 rounded-full shadow-2xl" />
        <p className="mt-8 font-black text-slate-300 uppercase tracking-[0.4em] text-[10px] animate-pulse italic">Loading System Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-10 font-sans text-slate-900 relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-5%] right-[-5%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-purple-400/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto">
        
        <header className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-4 mb-5">
              <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-2xl transform hover:rotate-12 transition-all">
                <Target size={26} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 leading-none mb-1">Targeting System v4.5</span>
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-2 uppercase tracking-tighter">
                  <Code2 size={12} /> Database Connected
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-950 leading-none uppercase italic">
              Major <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 underline decoration-8">Peminatan.</span>
            </h1>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-[2rem] p-6 border-4 border-white shadow-xl flex items-center gap-6 group relative overflow-hidden">
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl ${mendaftarKIPK ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                <Fingerprint size={28} />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none italic">Scholarship Node</p>
                <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter leading-none">KIP-Kuliah Status</h3>
                <div className="flex items-center gap-3 mt-2">
                   <input 
                      type="checkbox" checked={mendaftarKIPK} 
                      onChange={(e) => handleKipkSync(e.target.checked)}
                      className="w-5 h-5 rounded-lg border-2 border-slate-200 text-amber-500 focus:ring-amber-500 cursor-pointer"
                   />
                   <span className={`text-[10px] font-black uppercase tracking-tighter ${mendaftarKIPK ? 'text-amber-600' : 'text-slate-400'}`}>
                      {mendaftarKIPK ? 'Registered for Intake' : 'Standard Intake'}
                   </span>
                </div>
             </div>
          </motion.div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
           <InfoCard icon={<GraduationCap />} label="Limit" desc="Maksimal 4 Pilihan Strategis" color="blue" />
           <InfoCard icon={<Cpu />} label="Engine" desc="Local Database System" color="purple" />
           <InfoCard icon={<ShieldCheck />} label="Integrity" desc="Validasi S1/D3 Distribution" color="emerald" />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          {[1, 2, 3, 4].map((num) => {
            const data = peminatan.find(p => p.pilihan === num);
            const isActive = activePilihan === num;

            return (
              <motion.div key={num} layout className={`bg-white rounded-[3.5rem] border-4 border-white shadow-2xl overflow-hidden relative group transition-all duration-700 ${isActive ? 'ring-8 ring-blue-500/5' : ''}`}>
                <div className={`p-8 flex items-center justify-between border-b border-slate-50 ${data ? 'bg-slate-50/50' : ''}`}>
                   <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white shadow-2xl transition-transform duration-500 group-hover:rotate-12 ${num <= 2 ? 'bg-blue-600 shadow-blue-500/30' : 'bg-indigo-600 shadow-indigo-500/30'}`}>
                        {num}
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Extraction Slot</p>
                         <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Pilihan {num}</h3>
                      </div>
                   </div>
                   {data && (
                      <button onClick={() => handleDelete(num)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-inner">
                         <Trash2 size={20} />
                      </button>
                   )}
                </div>

                <div className="p-8">
                  {data ? (
                    <div className="space-y-6">
                       <div className="flex items-center gap-4">
                          <Building2 className="text-blue-500" size={24} />
                          <span className="font-black text-slate-800 uppercase italic tracking-tighter text-lg">{data.kampusNama}</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <BookOpen className="text-indigo-500" size={24} />
                          <span className="font-bold text-slate-600 uppercase tracking-widest text-sm">{data.jurusanNama} ({data.jenjang})</span>
                       </div>
                    </div>
                  ) : isActive ? (
                    <div className="space-y-6">
                       {/* Step 1: Select Jenis Kampus */}
                       <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Tipe Kampus</label>
                          <div className="grid grid-cols-3 gap-2">
                             {['PTN', 'PTS', 'PTKIN'].map(jenis => (
                                <button key={jenis} onClick={() => setTempChoice({...tempChoice, jenisKampus: jenis, jalur: '', kampusNama: '', jurusanNama: '', jenjang: ''})}
                                   className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tempChoice.jenisKampus === jenis ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                >{jenis}</button>
                             ))}
                          </div>
                       </div>

                       {/* Step 2: Select Jalur (based on Jenis Kampus) */}
                       {tempChoice.jenisKampus && (
                          <div>
                             <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Jalur Masuk</label>
                             <div className="flex flex-wrap gap-2">
                                {tempChoice.jenisKampus === 'PTN' && ['SNBP', 'SNBT', 'Mandiri'].map(j => (
                                   <button key={j} onClick={() => setTempChoice({...tempChoice, jalur: j})}
                                      className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tempChoice.jalur === j ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                   >{j}</button>
                                ))}
                                {tempChoice.jenisKampus === 'PTKIN' && ['SPAN-PTKIN', 'UM-PTKIN', 'Mandiri'].map(j => (
                                   <button key={j} onClick={() => setTempChoice({...tempChoice, jalur: j})}
                                      className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tempChoice.jalur === j ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                   >{j}</button>
                                ))}
                                {tempChoice.jenisKampus === 'PTS' && ['Mandiri', 'Beasiswa'].map(j => (
                                   <button key={j} onClick={() => setTempChoice({...tempChoice, jalur: j})}
                                      className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tempChoice.jalur === j ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                   >{j}</button>
                                ))}
                             </div>
                          </div>
                       )}

                       {/* Step 3: Search Kampus (only if Jenis & Jalur selected) */}
                       {tempChoice.jenisKampus && tempChoice.jalur && (
                       <div className="relative">
                          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                             {loadingCampus ? <RefreshCcw size={20} className="animate-spin" /> : <Search size={20} />}
                          </div>
                          <input type="text" placeholder="Scan Campus Name (min. 3 chars)..."
                             value={tempChoice.kampusNama || searchQuery}
                             onChange={(e) => { setSearchQuery(e.target.value); setTempChoice({...tempChoice, kampusNama: ''}); }}
                             className="w-full h-16 pl-14 pr-6 rounded-2xl bg-[#F8FAFC] border-none font-black text-slate-800 placeholder:text-slate-300 shadow-inner focus:ring-4 focus:ring-blue-500/10 transition-all"
                          />
                          <AnimatePresence>
                            {campusResults.length > 0 && (
                              <motion.div className="absolute top-20 left-0 w-full bg-white rounded-[2rem] shadow-2xl z-50 border border-slate-100 overflow-hidden">
                                 {campusResults.map(c => (
                                    <button key={c.id} onClick={() => handleSelectCampus(c)} className="w-full p-5 text-left hover:bg-blue-50 transition-all flex items-center justify-between border-b border-slate-50 last:border-none group">
                                       <span className="font-black text-slate-700 uppercase italic tracking-tighter text-sm">{c.namaKampus}</span>
                                       <ArrowRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                 ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                       </div>
                       )}

                       {/* Step 4: Select Jurusan (only if Kampus selected) */}
                       {tempChoice.kampusNama && (
                          <div>
                             <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Pilih Program Studi</label>
                             {loadingProdi ? (
                                <div className="flex items-center justify-center py-12">
                                   <RefreshCcw className="animate-spin text-blue-500" size={32} />
                                </div>
                             ) : prodiList.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                   {prodiList.map((p, idx) => (
                                      <motion.button 
                                         key={idx}
                                         onClick={() => setTempChoice({...tempChoice, jurusanNama: p.namaJurusan, jenjang: p.jenjang})}
                                         whileHover={{ x: 5 }}
                                         whileTap={{ scale: 0.98 }}
                                         className={`p-5 rounded-2xl text-left transition-all group border-2 ${
                                            tempChoice.jurusanNama === p.namaJurusan 
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-2xl shadow-blue-500/30' 
                                            : 'bg-white hover:bg-blue-50 border-slate-100 hover:border-blue-200 shadow-sm'
                                         }`}
                                      >
                                         <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                               <h4 className={`font-black text-sm uppercase tracking-tight leading-tight mb-2 ${
                                                  tempChoice.jurusanNama === p.namaJurusan ? 'text-white' : 'text-slate-800'
                                               }`}>
                                                  {p.namaJurusan}
                                               </h4>
                                               <div className="flex flex-wrap gap-2">
                                                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                                                     tempChoice.jurusanNama === p.namaJurusan 
                                                     ? 'bg-white/20 text-white' 
                                                     : 'bg-blue-50 text-blue-600'
                                                  }`}>
                                                     {p.jenjang}
                                                  </span>
                                                  {p.fakultas && (
                                                     <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                                                        tempChoice.jurusanNama === p.namaJurusan 
                                                        ? 'bg-white/20 text-white' 
                                                        : 'bg-slate-50 text-slate-600'
                                                     }`}>
                                                        {p.fakultas}
                                                     </span>
                                                  )}
                                                  {p.akreditasi && (
                                                     <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                                                        tempChoice.jurusanNama === p.namaJurusan 
                                                        ? 'bg-yellow-400/30 text-yellow-100' 
                                                        : 'bg-yellow-50 text-yellow-700'
                                                     }`}>
                                                        Akreditasi {p.akreditasi}
                                                     </span>
                                                  )}
                                               </div>
                                            </div>
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                                               tempChoice.jurusanNama === p.namaJurusan 
                                               ? 'bg-white/20' 
                                               : 'bg-slate-50 group-hover:bg-blue-100'
                                            }`}>
                                               {tempChoice.jurusanNama === p.namaJurusan ? (
                                                  <CheckCircle2 size={18} className="text-white" />
                                               ) : (
                                                  <ArrowRight size={18} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                               )}
                                            </div>
                                         </div>
                                      </motion.button>
                                   ))}
                                </div>
                             ) : (
                                <div className="py-12 text-center">
                                   <AlertCircle size={32} className="mx-auto text-slate-300 mb-3" />
                                   <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tidak ada program studi tersedia</p>
                                </div>
                             )}
                          </div>
                       )}

                       {/* Step 5: Save Actions */}
                       <div className="flex gap-4">
                          <button onClick={() => handleSavePilihan(num)} disabled={saving || !tempChoice.jurusanNama} className="flex-1 h-16 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                             {saving ? <RefreshCcw className="animate-spin" /> : <Zap size={16} fill="white" />} INJECT MODULE
                          </button>
                          <button onClick={() => setActivePilihan(null)} className="px-8 h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]">CANCEL</button>
                       </div>
                    </div>
                  ) : (
                    <button onClick={() => setActivePilihan(num)} className="w-full py-12 border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:border-blue-200 transition-all group">
                       <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:text-blue-500 transition-all">
                          <Plus size={24} />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Authorize New Choice</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <footer className="mt-20 py-20 border-t-8 border-slate-900/5 flex flex-col md:flex-row items-center justify-between opacity-30 text-center md:text-left gap-10">
          <div className="space-y-4">
            <p className="text-[18px] font-black uppercase tracking-[1em] text-slate-950 leading-none">SMKN 1 KADEMANGAN</p>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.4em] uppercase italic leading-none">Extraction Intelligence Monitoring Infrastructure v4.5.1 Stable Build</p>
          </div>
        </footer>

      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function InfoCard({ icon, label, desc, color }: any) {
  const colors: any = { blue: "bg-blue-600", purple: "bg-indigo-600", emerald: "bg-emerald-600" };
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
       <div className={`w-14 h-14 ${colors[color]} text-white rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-12`}>{icon}</div>
       <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
          <p className="text-sm font-black text-slate-800 uppercase italic tracking-tighter">{desc}</p>
       </div>
    </div>
  );
}