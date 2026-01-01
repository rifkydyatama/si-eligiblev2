'use client';

/**
 * ==============================================================================
 * SI-ELIGIBLE ACADEMIC SYSTEM v2.0 - PROFESSIONAL ANALYTICS
 * ==============================================================================
 * Module      : Campus Infrastructure Management
 * Component   : Add Program Studi (Jurusan) Interface
 * Design Style: Alpha-Gen Professional 3D (Claymorphism & Bento)
 * Logic       : Integrated with Prisma API & Framer Motion Engine
 * Developer   : Rifky Smart Innovation Team
 * ==============================================================================
 */

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONOGRAPHY ASSETS (Lucide Engine) ---
import { 
  BookOpen, 
  ArrowLeft, 
  Plus, 
  Hash, 
  Layers, 
  GraduationCap, 
  Award, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  Zap, 
  Clock, 
  ShieldCheck,
  Sparkles,
  Search,
  Building,
  ToggleLeft,
  ChevronRight,
  Info, // Fixed: Import explicitly added
  Activity,
  Database
} from 'lucide-react';

import { Button } from "@/components/ui/button";

// --- TYPE DEFINITIONS ---
interface Kampus {
  id: string;
  namaKampus: string;
  kodeKampus: string;
}

/**
 * PAGE COMPONENT: TambahJurusanPage
 * Provides a high-fidelity form for registering new academic programs.
 */
export default function TambahJurusanPage() {
  // 1. SYSTEM HOOKS
  const params = useParams();
  const router = useRouter();
  
  // 2. CORE STATE MANAGEMENT
  const [kampus, setKampus] = useState<Kampus | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [academicYear, setAcademicYear] = useState("");

  // 3. FORM STATE (CLAY-DATA SCHEMATICS)
  const [formData, setFormData] = useState({
    kodeJurusan: '',
    namaJurusan: '',
    jenjang: '',
    fakultas: '',
    akreditasi: '',
    deskripsi: '',
    isActive: true,
    tahunUpdate: new Date().getFullYear().toString()
  });

  // 4. INITIALIZATION ENGINE
  useEffect(() => {
    // Sync Academic Year Logic
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const displayYear = currentMonth >= 7 
      ? `${currentYear}/${currentYear + 1}` 
      : `${currentYear - 1}/${currentYear}`;
    
    setAcademicYear(displayYear);
    
    // Fetch Campus Context
    if (params.id) {
      fetchCampusContext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // 5. DATA FETCHING (INTELLIGENT SYNC)
  const fetchCampusContext = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/kampus/${params.id}`);
      
      if (res.ok) {
        const data = await res.json();
        setKampus(data);
      } else {
        setError('Pusat data tidak merespon ID Kampus yang diminta.');
        setTimeout(() => router.push('/admin/kampus'), 3000);
      }
    } catch (err) {
      console.error('Anomali transmisi data:', err);
      setError('Kegagalan sinkronisasi jaringan. Periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  // 6. ACTION HANDLERS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/kampus/${params.id}/jurusan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Success Vibration Effect (Simulated via navigation)
        router.push(`/admin/kampus/${params.id}`);
      } else {
        const responseData = await response.json();
        setError(responseData.error || 'Terjadi anomali saat mengarsipkan program studi.');
      }
    } catch (err) {
      setError('Sistem pusat sibuk. Gagal melakukan integrasi database.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // 7. RENDER: LOADING STATE (3D SPINNER)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFEFF] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent blur-3xl animate-pulse" />
        </div>
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border-[10px] border-slate-100 border-t-purple-600 rounded-full shadow-2xl" 
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Database className="text-purple-600" size={30} />
          </div>
        </div>
        <p className="mt-8 text-2xl font-black text-slate-300 uppercase tracking-[0.4em] italic animate-pulse">
          Synchronizing Data...
        </p>
      </div>
    );
  }

  if (!kampus) return null;

  // 8. RENDER: MAIN INTERFACE
  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-8 font-sans text-slate-900 relative overflow-x-hidden">
      
      {/* BACKGROUND DECORATION ENGINE (ALPHA BLOBS) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-purple-400/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto">
        
        {/* --- SECTION: TOP NAVIGATION & BRANDING --- */}
        <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-purple-600 rounded-3xl text-white shadow-2xl shadow-purple-500/30 transform hover:rotate-12 transition-all">
                <BookOpen size={30} />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-purple-600 leading-none mb-1">Architecture Lab</span>
                <span className="text-sm font-bold text-slate-400">Pusat Registrasi Program Studi</span>
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-none">
              Program <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 italic">Baru.</span>
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <div className="px-6 py-3 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex items-center gap-4">
                <Building size={20} className="text-purple-500" />
                <span className="text-md font-black text-slate-700 uppercase tracking-tight">{kampus.namaKampus}</span>
              </div>
              <div className="px-6 py-3 bg-purple-50 text-purple-600 rounded-[2rem] text-[12px] font-black uppercase tracking-widest border border-purple-100">
                <Clock className="inline-block mr-2" size={14} /> TA {academicYear}
              </div>
            </div>
          </motion.div>

          <Link href={`/admin/kampus/${kampus.id}`}>
            <motion.button 
              whileHover={{ x: -10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-4 px-10 py-6 bg-white border border-slate-100 rounded-[2.5rem] font-black text-xs uppercase tracking-widest text-slate-400 shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              <ArrowLeft size={20} /> Kembali Ke Profil
            </motion.button>
          </Link>
        </section>

        {/* --- SECTION: MAIN BENTO FORM CONTAINER --- */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-3xl border border-white rounded-[4rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden"
        >
          {/* Real-time Status Alert */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }} 
                className="bg-red-50 p-8 flex items-center gap-6 text-red-600 border-b border-red-100 font-bold"
              >
                <div className="p-3 bg-red-100 rounded-2xl">
                  <AlertCircle size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="uppercase text-xs font-black tracking-widest">Database Anomaly</span>
                  <p className="text-lg tracking-tight">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="p-10 md:p-20">
            <div className="grid md:grid-cols-2 gap-16">
              
              {/* --- COLUMN 1: ACADEMIC CORE --- */}
              <div className="space-y-12">
                <div className="flex items-center gap-5 border-l-4 border-purple-500 pl-8">
                  <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                    <Cpu size={24} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400">Core Configuration</h3>
                </div>

                <div className="space-y-10">
                  <SmartInput 
                    label="Kode Identifikasi Program" 
                    name="kodeJurusan"
                    icon={<Hash size={24} />}
                    value={formData.kodeJurusan}
                    onChange={handleInputChange}
                    placeholder="Contoh: SI-001-S1"
                    required
                  />

                  <SmartInput 
                    label="Nama Resmi Program Studi" 
                    name="namaJurusan"
                    icon={<Layers size={24} />}
                    value={formData.namaJurusan}
                    onChange={handleInputChange}
                    placeholder="Contoh: Sistem Informasi"
                    required
                  />

                  <div className="grid grid-cols-2 gap-8">
                    <SmartSelect 
                      label="Jenjang Pendidikan"
                      name="jenjang"
                      icon={<GraduationCap size={22} />}
                      value={formData.jenjang}
                      onChange={handleInputChange}
                      options={[
                        { v: 'D3', l: 'Diploma 3' },
                        { v: 'D4', l: 'Sarjana Terapan' },
                        { v: 'S1', l: 'Sarjana (S1)' },
                        { v: 'S2', l: 'Magister (S2)' }
                      ]}
                      required
                    />
                    <SmartSelect 
                      label="Peringkat Akreditasi"
                      name="akreditasi"
                      icon={<Award size={22} />}
                      value={formData.akreditasi}
                      onChange={handleInputChange}
                      options={[
                        { v: 'A', l: 'A (Unggul)' },
                        { v: 'B', l: 'B (Baik Sekali)' },
                        { v: 'C', l: 'C (Baik)' },
                        { v: 'Internasional', l: 'Internasional' }
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* --- COLUMN 2: FACULTY & METRICS --- */}
              <div className="space-y-12">
                <div className="flex items-center gap-5 border-l-4 border-blue-500 pl-8">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                    <Activity size={24} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400">Status & Affiliation</h3>
                </div>

                <div className="space-y-10">
                  <SmartInput 
                    label="Fakultas / Departemen Induk" 
                    name="fakultas"
                    icon={<Building size={24} />}
                    value={formData.fakultas}
                    onChange={handleInputChange}
                    placeholder="Contoh: Fakultas Teknologi Industri"
                    required
                  />

                  <div className="space-y-4 group">
                    <label className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 group-focus-within:text-purple-500 transition-colors">
                      Narasi Deskripsi Program
                    </label>
                    <textarea
                      name="deskripsi"
                      value={formData.deskripsi}
                      onChange={handleInputChange}
                      placeholder="Garis besar kurikulum dan prospek lulusan..."
                      rows={5}
                      className="w-full p-8 rounded-[3rem] bg-[#F8FAFC] border-none focus:ring-4 focus:ring-purple-500/10 transition-all font-bold text-slate-700 shadow-inner placeholder:text-slate-300 placeholder:italic text-lg"
                    />
                  </div>

                  {/* SMART SWITCH (ALPHA TOGGLE) */}
                  <div className="pt-4">
                    <div 
                      onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                      className={`p-8 rounded-[3rem] border-2 transition-all cursor-pointer flex items-center justify-between group ${
                        formData.isActive 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xl shadow-emerald-500/5' 
                          : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-2xl transition-colors ${formData.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                          <ShieldCheck size={28} />
                        </div>
                        <div>
                          <p className="font-black text-lg uppercase tracking-tight leading-none mb-1">Status Aktivasi</p>
                          <p className="text-[11px] font-bold opacity-70">Izinkan prodi ini dipilih oleh siswa.</p>
                        </div>
                      </div>
                      <div className={`w-16 h-8 rounded-full relative transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                        <motion.div 
                          animate={{ x: formData.isActive ? 32 : 4 }}
                          className="absolute top-1.5 w-5 h-5 bg-white rounded-full shadow-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- ACTION ZONE: THE 3D BUTTONS --- */}
            <div className="mt-24 flex flex-col md:flex-row gap-10">
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02, y: -8 }} 
                whileTap={{ scale: 0.98 }}
                className="flex-[2] h-28 bg-purple-600 hover:bg-purple-700 text-white rounded-[3rem] font-black text-3xl shadow-[0_18px_0_0_#581c87] active:shadow-none active:translate-y-5 transition-all flex items-center justify-center gap-6 disabled:opacity-50 group uppercase italic tracking-tighter"
              >
                {submitting ? (
                  <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Archive Program <CheckCircle2 size={40} className="group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </motion.button>
              
              <Link href={`/admin/kampus/${kampus.id}`} className="flex-1">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02, y: -8 }} 
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-28 bg-slate-100 text-slate-400 rounded-[3rem] font-black text-2xl hover:bg-slate-200 hover:text-slate-600 transition-all shadow-[0_18px_0_0_#e2e8f0] active:shadow-none active:translate-y-5 uppercase italic tracking-tighter"
                >
                  Batal
                </motion.button>
              </Link>
            </div>
          </form>
        </motion.div>

        {/* --- SECTION: INTELLIGENT FOOTER --- */}
        <footer className="mt-20 py-10 text-center relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }} 
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.5em] text-slate-300"
          >
            <Info size={18} className="text-blue-500" /> // Icon fixed
            <span>Automated Integration Protocol Active</span>
          </motion.div>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Si-Eligible Infrastructure Lab
          </p>
        </footer>
      </main>

      {/* Floating Action Hint */}
      <div className="fixed bottom-10 right-10 z-50 pointer-events-none hidden lg:block">
        <div className="bg-slate-900 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-bounce">
          <Sparkles className="text-amber-400" />
          <span className="text-xs font-black uppercase tracking-widest">Bento UI Engine</span>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS: SMART DESIGN SYSTEM ---

/**
 * SmartInput Component
 * Claymorphism styled input with inner shadow and focus micro-animations.
 */
function SmartInput({ label, name, icon, value, onChange, placeholder, required = false }: any) {
  return (
    <div className="space-y-4 group">
      <label className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 group-focus-within:text-purple-500 transition-colors">
        {label} {required && <span className="text-red-500 font-bold">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-500 transition-colors scale-110">
          {icon}
        </div>
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full h-20 pl-20 pr-8 rounded-[3rem] bg-[#F8FAFC] border-none focus:ring-4 focus:ring-purple-500/10 transition-all font-black text-slate-700 shadow-inner placeholder:text-slate-300 placeholder:italic text-lg"
        />
      </div>
    </div>
  );
}

/**
 * SmartSelect Component
 * Enhanced select component with deep shadow and hover effects.
 */
function SmartSelect({ label, name, icon, value, onChange, options, required = false }: any) {
  return (
    <div className="space-y-4 group">
      <label className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 group-focus-within:text-blue-500 transition-colors">
        {label} {required && <span className="text-red-500 font-bold">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors scale-110">
          {icon}
        </div>
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full h-20 pl-20 pr-12 rounded-[3rem] bg-[#F8FAFC] border-none focus:ring-4 focus:ring-blue-500/10 transition-all font-black text-slate-700 shadow-inner cursor-pointer appearance-none text-lg"
        >
          <option value="" className="text-slate-300">Pilih Opsi...</option>
          {options.map((opt: any) => (
            <option key={opt.v} value={opt.v}>{opt.l}</option>
          ))}
        </select>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
          <ChevronRight className="rotate-90 text-slate-500" size={24} />
        </div>
      </div>
    </div>
  );
}