'use client';

/**
 * ==============================================================================
 * SI-ELIGIBLE ADMIN: STUDENT INTELLIGENCE DETAIL v5.0
 * ==============================================================================
 * Style       : Alpha-Gen Professional 3D (Bento-Grid)
 * Logic       : Integrated Data Analytics & History Tracking
 * Calibration : Optimized for 100% Desktop Scaling
 * ==============================================================================
 */

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  User, 
  Fingerprint, 
  Mail, 
  Phone, 
  Calendar, 
  Cpu, 
  GraduationCap, 
  Target, 
  LineChart, 
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  Layers
} from 'lucide-react';

// --- INTERFACES (UNCHANGED LOGIC) ---
interface JurusanSekolah { id: string; kode: string; nama: string; tingkat: string; isActive: boolean; }
interface SiswaData {
  id: string; nisn: string; nama: string; tanggalLahir: string; kelas: string;
  jurusanSekolah: JurusanSekolah | null; email: string | null; noTelepon: string | null;
  statusKIPK: boolean; mendaftarKIPK: boolean;
  nilaiRapor: Array<{ id: string; semester: number; mataPelajaran: string; nilai: number; isVerified: boolean; }>;
  peminatan: Array<{ id: string; kampus: { namaKampus: string; }; jurusan: { namaJurusan: string; }; }>;
  kelulusan: Array<{ id: string; status: string; jalur: string; createdAt: string; kampus: { namaKampus: string; } | null; jurusan: { namaJurusan: string; } | null; }>;
}

export default function DetailSiswaAlpha() {
  const router = useRouter();
  const params = useParams();
  const [siswa, setSiswa] = useState<SiswaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) fetchSiswaData();
  }, [params.id]);

  const fetchSiswaData = async () => {
    try {
      const res = await fetch(`/api/admin/siswa/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setSiswa(data);
      } else { setError('Data Inaccessible'); }
    } catch (err) { setError('Network Error'); } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Execute Deletion? This action is irreversible.')) return;
    const res = await fetch(`/api/admin/siswa/${params.id}`, { method: 'DELETE' });
    if (res.ok) router.push('/admin/siswa');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FDFEFF] flex flex-col items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-[6px] border-slate-100 border-t-purple-600 rounded-full shadow-2xl" />
      <p className="mt-8 font-black text-slate-300 uppercase tracking-[0.4em] text-[10px] italic animate-pulse">Scanning Student Profile...</p>
    </div>
  );

  if (error || !siswa) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFEFF] p-10">
      <div className="text-center bg-white p-12 rounded-[3rem] shadow-2xl border-4 border-slate-50">
        <AlertCircle size={64} className="mx-auto text-red-500 mb-6" />
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-950 mb-2">Access Denied.</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">{error || 'Record Not Found'}</p>
        <button onClick={() => router.back()} className="px-10 py-4 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">Back to Terminal</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-10 font-sans relative">
      
      {/* 1. AMBIENT BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-5%] right-[-5%] w-[50%] h-[50%] bg-purple-400/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto">
        
        {/* --- 2. HEADER: COMMAND BAR --- */}
        <header className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[10px] mb-6 hover:text-purple-600 transition-colors">
              <ArrowLeft size={14} /> Back to Database
            </button>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-950 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
                <Cpu size={32} fill="currentColor" className="text-purple-500" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600">Student Profile v5.0</span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">{siswa.nama}.</h1>
              </div>
            </div>
          </motion.div>

          <div className="flex gap-4">
            <Link href={`/admin/siswa/${siswa.id}/edit`} className="px-8 h-16 bg-white border-4 border-slate-50 text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-xl hover:border-purple-200 transition-all">
              <Pencil size={16} /> Edit Record
            </Link>
            <button onClick={handleDelete} className="px-8 h-16 bg-red-50 text-red-500 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-inner hover:bg-red-500 hover:text-white transition-all">
              <Trash2 size={16} /> Delete Data
            </button>
          </div>
        </header>

        {/* --- 3. CORE BENTO GRID --- */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* LEFT: PRIMARY INTEL */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* BASIC INFO BENTO */}
            <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border-4 border-white shadow-[0_30px_60px_rgba(0,0,0,0.04)] relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10 text-slate-300">
                  <ShieldCheck size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Basic Identification</span>
                </div>
                <div className="grid md:grid-cols-2 gap-10">
                  <DataNode icon={<Fingerprint />} label="NISN Number" value={siswa.nisn} />
                  <DataNode icon={<Calendar />} label="Birth Date" value={new Date(siswa.tanggalLahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} />
                  <DataNode icon={<Layers />} label="Level / Class" value={siswa.kelas} />
                  <DataNode icon={<Zap />} label="Specialization" value={siswa.jurusanSekolah?.nama || '-'} />
                  <DataNode icon={<Mail />} label="Email" value={siswa.email || 'Belum diisi'} />
                  <DataNode icon={<Phone />} label="Phone Number" value={siswa.noTelepon || 'Belum diisi'} />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 blur-[100px]" />
            </div>

            {/* NEURAL STATS TABLE */}
            <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border-4 border-white shadow-[0_30px_60px_rgba(0,0,0,0.04)]">
              <div className="flex justify-between items-end mb-10">
                <h2 className="text-3xl font-black text-slate-950 uppercase italic tracking-tighter">Grade Audit.</h2>
                <div className="px-4 py-2 bg-slate-50 rounded-xl font-black text-[10px] text-slate-400 uppercase tracking-widest">Total: {siswa.nilaiRapor.length} Entry</div>
              </div>
              
              <div className="space-y-4">
                {siswa.nilaiRapor.length > 0 ? (
                  siswa.nilaiRapor.map((n, idx) => (
                    <div key={n.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-50 hover:border-purple-100 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-purple-600 shadow-sm">S{n.semester}</div>
                        <div>
                          <p className="font-black text-slate-800 uppercase italic tracking-tighter text-lg leading-none mb-1">{n.mataPelajaran}</p>
                          <span className={`text-[9px] font-black uppercase tracking-widest ${n.isVerified ? 'text-emerald-500' : 'text-orange-500'}`}>
                            {n.isVerified ? '✓ Verified' : '⏳ Pending'}
                          </span>
                        </div>
                      </div>
                      <div className="text-4xl font-black text-slate-950 italic tracking-tighter">{n.nilai}</div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center text-slate-300 font-black uppercase tracking-widest text-xs italic">No Grades Injected</div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: SECONDARY INTEL */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            
            {/* STATS OVERVIEW */}
            <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                <LineChart className="text-purple-500" /> Neural Stats
              </h3>
              <div className="space-y-6">
                <MiniStat label="Average Score" value={siswa.nilaiRapor.length > 0 ? (siswa.nilaiRapor.reduce((sum, n) => sum + n.nilai, 0) / siswa.nilaiRapor.length).toFixed(2) : '0.00'} />
                <div className="h-px bg-white/10" />
                <div className="flex justify-between items-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scholarship</p>
                   <div className="flex gap-2">
                     {siswa.statusKIPK && <span className="px-3 py-1 bg-emerald-500 rounded-lg text-[9px] font-black">ACTIVE</span>}
                     {siswa.mendaftarKIPK && <span className="px-3 py-1 bg-blue-500 rounded-lg text-[9px] font-black">APPLIED</span>}
                     {!siswa.statusKIPK && !siswa.mendaftarKIPK && <span className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black text-slate-500">REGULAR</span>}
                   </div>
                </div>
              </div>
              <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-purple-600/10 blur-[80px] pointer-events-none" />
            </div>

            {/* CONTACT BENTO */}
            <div className="bg-white rounded-[3rem] p-10 border-4 border-white shadow-xl">
               <h3 className="text-lg font-black uppercase italic tracking-tighter mb-8">Contact Node</h3>
               <div className="space-y-6">
                  <div className="flex items-center gap-4 text-slate-400">
                     <Mail size={18} />
                     <p className="font-bold text-xs truncate">{siswa.email || 'No Email Record'}</p>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                     <Phone size={18} />
                     <p className="font-bold text-xs">{siswa.noTelepon || 'No Phone Record'}</p>
                  </div>
               </div>
            </div>

            {/* PEMINATAN & KELULUSAN */}
            <div className="bg-white rounded-[3rem] p-10 border-4 border-white shadow-xl">
               <h3 className="text-lg font-black uppercase italic tracking-tighter mb-8 flex items-center justify-between">
                  Pathways <Target size={18} className="text-slate-300" />
               </h3>
               <div className="space-y-4">
                  {siswa.peminatan.length > 0 ? siswa.peminatan.map(p => (
                    <div key={p.id} className="p-4 bg-purple-50 rounded-[1.5rem] border border-purple-100">
                      <p className="font-black text-purple-800 uppercase italic tracking-tighter text-[11px] leading-none mb-1">{p.kampus.namaKampus}</p>
                      <p className="text-[10px] font-bold text-purple-400 truncate">{p.jurusan.namaJurusan}</p>
                    </div>
                  )) : <p className="text-[10px] font-bold text-slate-300 uppercase italic italic">No Target Campus Set</p>}
               </div>
               
               <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Graduation History</p>
                  {siswa.kelulusan.map(item => (
                    <div key={item.id} className={`p-4 rounded-[1.5rem] border ${item.status === 'lulus' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                      <div className="flex justify-between items-center mb-2">
                         <span className={`text-[9px] font-black uppercase tracking-widest ${item.status === 'lulus' ? 'text-emerald-600' : 'text-red-600'}`}>{item.status}</span>
                         <span className="text-[8px] font-bold text-slate-300">{item.jalur}</span>
                      </div>
                      <p className="text-[10px] font-black text-slate-900 uppercase italic leading-none">{item.kampus?.namaKampus || '-'}</p>
                    </div>
                  ))}
               </div>
            </div>

          </div>
        </div>

        {/* --- 4. FOOTER ALPHA --- */}
        <footer className="mt-32 py-12 border-t-4 border-slate-50 opacity-20 flex justify-between items-center">
           <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">SMKN 1 KADEMANGAN / NEURAL DATA ACCESS v5.0</p>
           <Zap size={16} />
        </footer>

      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function DataNode({ icon, label, value }: any) {
  return (
    <div className="flex gap-5">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p className="text-xl font-black text-slate-950 uppercase italic tracking-tighter truncate">{value}</p>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: any) {
  return (
    <div className="flex justify-between items-end">
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
       <p className="text-4xl font-black text-purple-500 italic tracking-tighter leading-none">{value}</p>
    </div>
  );
}