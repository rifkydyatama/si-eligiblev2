'use client';

/**
 * ==============================================================================
 * SI-ELIGIBLE CAMPUS MODIFIER v3.2 - ALPHA PREX (STABLE)
 * ==============================================================================
 * Module      : Campus Profile Editor
 * Style       : Alpha-Gen Professional 3D (Extreme Visuals)
 * Logic       : Secure Fetch & Put Protocol
 * Feature     : Hard Shadows, Concave Inputs, Kinetic Motion
 * Calibrated  : Optimized for 100% Desktop Scaling
 * ==============================================================================
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONOGRAPHY ENGINE ---
import { 
  Building2, 
  ArrowLeft, 
  Save, 
  MapPin, 
  Award, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Clock, 
  Globe, 
  PencilLine, 
  AlertCircle, 
  CheckCircle2,
  Database, 
  Sparkles, 
  LayoutDashboard,
  Code2,
  Hash,
  Link as LinkIcon
} from 'lucide-react';

import { Button } from "@/components/ui/button";

export default function EditKampusPage() {
  // 1. CORE SYSTEM HOOKS
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  // 2. STATE ARCHITECTURE
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [academicYear, setAcademicYear] = useState("");

  const [form, setForm] = useState({ 
    kodeKampus: "",
    namaKampus: "", 
    jenisKampus: "",
    kategoriJalur: "",
    akreditasi: "",
    kota: "", 
    provinsi: "",
    website: "",
    logoUrl: ""
  });

  // 3. INTERNAL UTILS: Academic Year Sync
  const syncAcademicPeriod = useCallback(() => {
    const now = new Date();
    const period = now.getMonth() + 1 >= 7 
      ? `${now.getFullYear()}/${now.getFullYear() + 1}` 
      : `${now.getFullYear() - 1}/${now.getFullYear()}`;
    setAcademicYear(period);
  }, []);

  // 4. DATA FETCHING (SAFE-FETCH PROTOCOL)
  useEffect(() => {
    if (!id) return;
    let mounted = true;
    
    const fetchCurrentData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/kampus/${id}`);
        
        // Mencegah parsing jika response bukan JSON (mencegah "Unexpected token <")
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Server returned non-JSON response.");
        }

        if (res.ok) {
          const data = await res.json();
          if (mounted) {
            setForm({
              kodeKampus: data.kodeKampus || "",
              namaKampus: data.namaKampus || "",
              jenisKampus: data.jenisKampus || "",
              kategoriJalur: data.kategoriJalur || "",
              akreditasi: data.akreditasi || "",
              kota: data.kota || "",
              provinsi: data.provinsi || "",
              website: data.website || "",
              logoUrl: data.logoUrl || ""
            });
          }
        } else {
          setError("Gagal melakukan sinkronisasi data awal.");
        }
      } catch (e) {
        setError("Anomali Database: Gagal memuat metadata.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    syncAcademicPeriod();
    fetchCurrentData();

    return () => { mounted = false; };
  }, [id, syncAcademicPeriod]);

  // 5. ACTION HANDLERS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/kampus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Update protocol failed.");
      
      router.push(`/admin/kampus/${id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Gagal mengarsipkan perubahan ke database.");
    } finally {
      setSaving(false);
    }
  };

  // 6. RENDER: LOADING STATE (NEURAL SPINNER)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFEFF] flex flex-col items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-[5px] border-slate-100 border-t-blue-600 rounded-full shadow-xl" 
        />
        <p className="mt-6 font-black text-slate-300 uppercase tracking-[0.3em] text-sm animate-pulse">Syncing Metadata...</p>
      </div>
    );
  }

  // 7. MAIN INTERFACE (ALPHA-LEVEL)
  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-10 font-sans text-slate-900 relative overflow-x-hidden">
      
      {/* KINETIC BACKGROUND ENGINE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[50%] h-[50%] bg-blue-400/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-purple-400/5 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto">
        
        {/* --- HEADER: ALPHA COMMAND CENTER --- */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-500/20 transform hover:rotate-12 transition-all">
                <Settings2 size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-600 leading-none mb-1">Configuration Mode</span>
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                    <Code2 size={12} /> Profiling Master Entity
                </span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 leading-none uppercase italic">
              Modify <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Profile.</span>
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Cpu size={14} className="text-blue-400" /> Session ID: {id.substring(0,8)}...
              </div>
              <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                TA {academicYear}
              </div>
            </div>
          </motion.div>

          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="h-14 px-8 rounded-2xl border-2 border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all shadow-sm"
          >
            <ArrowLeft size={16} className="mr-2" /> Batal & Kembali
          </Button>
        </header>

        {/* --- MAIN BENTO FORM --- */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-2xl border border-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden"
        >
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                className="bg-red-50 p-6 flex items-center gap-4 text-red-600 border-b border-red-100 font-bold italic"
              >
                <AlertCircle size={20} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
            
            {/* GRID SECTION 1: IDENTITY */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 ml-2">
                  <Hash size={14} /> Identity Core
                </h3>
                
                <SmartInput 
                  label="Nama Resmi Institusi" 
                  name="namaKampus" 
                  value={form.namaKampus} 
                  onChange={handleChange} 
                  icon={<Building2 size={20} />}
                  placeholder="Contoh: Universitas Brawijaya"
                />

                <div className="grid grid-cols-2 gap-4">
                  <SmartSelect 
                    label="Jenis" 
                    name="jenisKampus" 
                    value={form.jenisKampus} 
                    onChange={handleChange}
                    options={["PTN", "PTKIN", "PTS", "Kedinasan"]}
                  />
                  <SmartSelect 
                    label="Akreditasi" 
                    name="akreditasi" 
                    value={form.akreditasi || ""} 
                    onChange={handleChange}
                    options={["A", "B", "C", "Unggul", "Baik Sekali"]}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 ml-2">
                  <MapPin size={14} /> Regional Deployment
                </h3>
                
                <SmartInput 
                  label="Kota / Kabupaten" 
                  name="kota" 
                  value={form.kota} 
                  onChange={handleChange} 
                  icon={<MapPin size={20} />}
                  placeholder="Contoh: Malang"
                />
                
                <SmartInput 
                  label="Provinsi" 
                  name="provinsi" 
                  value={form.provinsi} 
                  onChange={handleChange} 
                  icon={<Globe size={20} />}
                  placeholder="Contoh: Jawa Timur"
                />
              </div>
            </div>

            {/* GRID SECTION 2: DIGITAL HUB */}
            <div className="pt-6 border-t border-slate-50 space-y-6">
              <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 ml-2">
                <Zap size={14} /> Neural Presence
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <SmartInput 
                  label="Official Website URL" 
                  name="website" 
                  value={form.website} 
                  onChange={handleChange} 
                  icon={<LinkIcon size={20} />}
                  placeholder="https://..."
                />
                <SmartInput 
                  label="Institutional Logo Path" 
                  name="logoUrl" 
                  value={form.logoUrl} 
                  onChange={handleChange} 
                  icon={<ImageIcon size={20} />}
                  placeholder="https://image-server.com/logo.png"
                />
              </div>
            </div>

            {/* ACTION ZONE: 3D BUTTONS */}
            <div className="pt-8 flex flex-col sm:flex-row gap-6">
              <motion.button
                type="submit"
                disabled={saving}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="flex-[2] h-20 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black text-lg uppercase tracking-[0.2em] shadow-[0_12px_0_0_#1e40af] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCcw className="animate-spin" size={24} />
                ) : (
                  <>COMMIT CHANGES <Save size={24} /></>
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => router.back()}
                whileHover={{ scale: 1.02 }}
                className="flex-1 h-20 bg-slate-100 text-slate-400 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                DISCARD
              </motion.button>
            </div>

          </form>
        </motion.div>

        {/* --- FOOTER ENGINE --- */}
        <footer className="mt-16 py-10 border-t border-slate-100 opacity-30 flex justify-between items-center">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
                &copy; {new Date().getFullYear()} SMKN 1 Kademangan | Intelligence Profiling
            </p>
            <div className="flex gap-6">
                <Cpu size={18} />
                <ShieldCheck size={18} />
            </div>
        </footer>

      </main>
    </div>
  );
}

// --- SUB-COMPONENTS: SMART DESIGN SYSTEM ---

function SmartInput({ label, name, icon, value, onChange, placeholder }: any) {
  return (
    <div className="space-y-3 group">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-3 group-focus-within:text-blue-500 transition-colors">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
          {icon}
        </div>
        <input
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full h-16 pl-16 pr-6 rounded-2xl bg-[#F8FAFC] border-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700 shadow-inner placeholder:text-slate-300 placeholder:font-medium"
        />
      </div>
    </div>
  );
}

function SmartSelect({ label, name, value, onChange, options }: any) {
  return (
    <div className="space-y-3 group">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-3 group-focus-within:text-indigo-500 transition-colors">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-16 px-6 rounded-2xl bg-[#F8FAFC] border-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-700 shadow-inner cursor-pointer appearance-none"
      >
        <option value="">Pilih {label}</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

// Tambahan Ikon yang tertinggal
function ImageIcon(props: any) {
    return <ImageIconLucide {...props} />;
}
import { Image as ImageIconLucide, RefreshCcw, Settings2 } from 'lucide-react';