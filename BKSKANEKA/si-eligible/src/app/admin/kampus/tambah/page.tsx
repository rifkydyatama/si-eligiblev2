'use client';

/**
 * ============================================================
 * SI-ELIGIBLE CAMPUS INFRASTRUCTURE v2.0
 * ============================================================
 * Module: Admin Add New Campus
 * Style: Alpha-Gen Professional 3D (Vibrant Edition)
 * Feature: Smart Form, 3D Depth Buttons, Ambient Background
 * ============================================================
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  School, 
  ArrowLeft, 
  Save, 
  Hash, 
  Building2, 
  Globe, 
  MapPin, 
  Award, 
  Zap, 
  Cpu, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  Sparkles,
  Link as LinkIcon,
  Search
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function TambahKampusPage() {
  const router = useRouter();
  
  // --- LOGIC STATES ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [academicYear, setAcademicYear] = useState("");

  const [formData, setFormData] = useState({
    kodeKampus: '',
    namaKampus: '',
    jenisKampus: '',
    kategoriJalur: '',
    akreditasi: '',
    provinsi: '',
    kota: '',
    website: '',
    logoUrl: ''
  });

  // --- AUTO SYNC ENGINE ---
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    setAcademicYear(month >= 7 ? `${year}/${year + 1}` : `${year - 1}/${year}`);
  }, []);

  // --- SMART SUBMIT HANDLER (LOGIKA TETAP SAMA) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/kampus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push('/admin/kampus');
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal sinkronisasi data kampus');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi anomali pada sistem pusat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-8 font-sans text-slate-900 relative overflow-x-hidden">
      
      {/* 1. AMBIENT BACKGROUND ENGINE (ALPHA BLOBS) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-400/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[140px] animate-pulse delay-1000" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto">
        
        {/* 2. HEADER NAVIGATION */}
        <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-600 rounded-2xl text-white shadow-xl shadow-purple-500/30 transform hover:rotate-12 transition-transform">
                <School size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600">Infrastructure Lab</span>
                <span className="text-xs font-bold text-slate-400">Pendaftaran Institusi Baru</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-none">
              Registrasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 italic">Kampus.</span>
            </h1>
            <p className="text-slate-400 font-bold mt-4 flex items-center gap-2 italic">
              <Clock size={16} /> Aktif pada Periode TA {academicYear}
            </p>
          </motion.div>

          <motion.button 
            whileHover={{ x: -5 }} onClick={() => router.back()}
            className="flex items-center gap-3 px-8 py-5 bg-white border border-slate-100 rounded-[2rem] font-black text-xs uppercase tracking-widest text-slate-400 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <ArrowLeft size={18} /> Kembali
          </motion.button>
        </section>

        {/* 3. MAIN BENTO FORM CONTAINER */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-2xl border border-white rounded-[4rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden"
        >
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="bg-red-50 p-6 flex items-center gap-4 text-red-600 border-b border-red-100 font-bold"
              >
                <AlertCircle /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="p-10 md:p-16">
            <div className="grid md:grid-cols-2 gap-12">
              
              {/* --- SECTION 1: IDENTITY --- */}
              <div className="space-y-10">
                <div className="flex items-center gap-4 border-l-4 border-purple-500 pl-6">
                  <Cpu className="text-purple-500" size={24} />
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Identitas Institusi</h3>
                </div>

                <div className="space-y-8">
                  <SmartInput 
                    label="Kode Identifikasi (KODE)" 
                    icon={<Hash size={20} />}
                    value={formData.kodeKampus}
                    onChange={(val) => setFormData({ ...formData, kodeKampus: val })}
                    placeholder="Contoh: UB-MLG-01"
                    required
                  />

                  <SmartInput 
                    label="Nama Resmi Perguruan Tinggi" 
                    icon={<Building2 size={20} />}
                    value={formData.namaKampus}
                    onChange={(val) => setFormData({ ...formData, namaKampus: val })}
                    placeholder="Masukkan Nama Lengkap Kampus"
                    required
                  />

                  <div className="grid grid-cols-1 gap-8">
                    <SmartSelect 
                      label="Jenis Institusi"
                      icon={<Zap size={20} />}
                      value={formData.jenisKampus}
                      onChange={(val) => setFormData({ ...formData, jenisKampus: val })}
                      options={[
                        { v: 'PTN', l: 'PTN (Negeri)' },
                        { v: 'PTKIN', l: 'PTKIN (Agama)' },
                        { v: 'PTS', l: 'PTS (Swasta)' },
                        { v: 'Kedinasan', l: 'Kedinasan' }
                      ]}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* --- SECTION 2: CATEGORY & GEOLOCATION --- */}
              <div className="space-y-10">
                <div className="flex items-center gap-4 border-l-4 border-blue-500 pl-6">
                  <MapPin className="text-blue-500" size={24} />
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Kategori & Lokasi</h3>
                </div>

                <div className="space-y-8">
                  <SmartSelect 
                    label="Kategori Jalur Masuk"
                    icon={<Sparkles size={20} />}
                    value={formData.kategoriJalur}
                    onChange={(val) => setFormData({ ...formData, kategoriJalur: val })}
                    options={[
                      { v: 'SNPMB', l: 'SNPMB (SNBP/SNBT)' },
                      { v: 'PTKIN', l: 'PTKIN (SPAN/UM)' },
                      { v: 'Mandiri', l: 'Mandiri / Lokal' }
                    ]}
                    required
                  />

                  <SmartSelect 
                    label="Akreditasi Nasional"
                    icon={<Award size={20} />}
                    value={formData.akreditasi}
                    onChange={(val) => setFormData({ ...formData, akreditasi: val })}
                    options={[
                      { v: 'A', l: 'A (Unggul)' },
                      { v: 'B', l: 'B (Baik Sekali)' },
                      { v: 'C', l: 'C (Baik)' }
                    ]}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <SmartInput 
                      label="Provinsi" 
                      value={formData.provinsi}
                      onChange={(val) => setFormData({ ...formData, provinsi: val })}
                      placeholder="Contoh: Jawa Timur"
                      required
                    />
                    <SmartInput 
                      label="Kota/Kab" 
                      value={formData.kota}
                      onChange={(val) => setFormData({ ...formData, kota: val })}
                      placeholder="Contoh: Malang"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* --- SECTION 3: DIGITAL PRESENCE (FULL WIDTH) --- */}
              <div className="md:col-span-2 space-y-10 pt-6">
                <div className="flex items-center gap-4 border-l-4 border-emerald-500 pl-6">
                  <Globe className="text-emerald-500" size={24} />
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Presensi Digital</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <SmartInput 
                    label="Website Resmi (URL)" 
                    icon={<LinkIcon size={20} />}
                    value={formData.website}
                    onChange={(val) => setFormData({ ...formData, website: val })}
                    placeholder="https://kampus.ac.id"
                  />
                  <SmartInput 
                    label="URL Asset Logo (.png/.jpg)" 
                    icon={<ImageIcon size={20} />}
                    value={formData.logoUrl}
                    onChange={(val) => setFormData({ ...formData, logoUrl: val })}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
            </div>

            {/* --- ACTION BUTTONS (CLAYMORPHISM 3D) --- */}
            <div className="mt-20 flex flex-col md:flex-row gap-8">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}
                className="flex-[2] h-24 bg-purple-600 hover:bg-purple-700 text-white rounded-[2.5rem] font-black text-2xl shadow-[0_15px_0_0_#581c87] active:shadow-none active:translate-y-4 transition-all flex items-center justify-center gap-5 disabled:opacity-50 group"
              >
                {loading ? (
                  <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    MENDAFTARKAN KAMPUS <CheckCircle2 size={32} className="group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </motion.button>
              
              <motion.button
                type="button"
                onClick={() => router.back()}
                whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}
                className="flex-1 h-24 bg-slate-100 text-slate-400 rounded-[2.5rem] font-black text-xl hover:bg-slate-200 hover:text-slate-600 transition-all shadow-[0_15px_0_0_#e2e8f0] active:shadow-none active:translate-y-4"
              >
                BATALKAN
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* 4. FOOTER INFO */}
        <footer className="mt-16 py-8 text-center opacity-30">
          <div className="flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-slate-400">
            <Info size={16} /> Data akan divalidasi oleh sistem algoritma pusat
          </div>
        </footer>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS (ALPHA DESIGN SYSTEM) ---

function SmartInput({ label, icon, value, onChange, placeholder, required = false, maxLength }: any) {
  return (
    <div className="space-y-4 group">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 group-focus-within:text-purple-500 transition-colors">
        {label} {required && <span className="text-red-400 font-bold">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          className={`w-full h-18 ${icon ? 'pl-16' : 'px-8'} pr-6 rounded-[1.75rem] bg-[#F8FAFC] border-none focus:ring-4 focus:ring-purple-500/10 transition-all font-bold text-slate-700 shadow-inner placeholder:text-slate-300 placeholder:italic`}
        />
      </div>
    </div>
  );
}

function SmartSelect({ label, icon, value, onChange, options, required = false }: any) {
  return (
    <div className="space-y-4 group">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 group-focus-within:text-blue-500 transition-colors">
        {label} {required && <span className="text-red-400 font-bold">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
          {icon}
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full h-18 pl-16 pr-10 rounded-[1.75rem] bg-[#F8FAFC] border-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700 shadow-inner cursor-pointer appearance-none"
        >
          <option value="">Pilih Opsi...</option>
          {options.map((opt: any) => (
            <option key={opt.v} value={opt.v}>{opt.l}</option>
          ))}
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
          <ArrowLeft className="-rotate-90" size={16} />
        </div>
      </div>
    </div>
  );
}