'use client';

/**
 * ============================================================
 * SI-ELIGIBLE STUDENT DATA MODIFIER v2.0
 * ============================================================
 * Module: Admin Student Editor
 * Style: Alpha-Gen Professional (3D, Vibrant, Interactive)
 * Feature: Glass-Form, Real-time Validation UI, Motion Design
 * ============================================================
 */

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  ArrowLeft, 
  Save, 
  X, 
  Hash, 
  Calendar, 
  BookOpen, 
  Mail, 
  Phone, 
  Sparkles, 
  ShieldCheck,
  Cpu,
  GraduationCap,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// --- DATA CONTRACT (SAME AS LOGIC) ---
interface SiswaData {
  id: string;
  nisn: string;
  nama: string;
  tanggalLahir: string;
  kelas: string;
  jurusan: string;
  email: string | null;
  noTelepon: string | null;
  statusKIPK: boolean;
}

export default function EditSiswaPage() {
  const router = useRouter();
  const params = useParams();
  
  // --- LOGIC STATES ---
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [academicYear, setAcademicYear] = useState("");
  
  const [formData, setFormData] = useState({
    nisn: '',
    nama: '',
    tanggalLahir: '',
    kelas: '',
    jurusan: '',
    email: '',
    noTelepon: '',
    statusKIPK: false
  });

  // --- AUTO SYNC ENGINE ---
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    setAcademicYear(month >= 7 ? `${now.getFullYear()}/${now.getFullYear() + 1}` : `${now.getFullYear() - 1}/${now.getFullYear()}`);
    
    if (params.id) {
      fetchSiswaData();
    }
  }, [params.id]);

  // --- DATABASE FETCHING (NO CHANGES IN LOGIC) ---
  const fetchSiswaData = async () => {
    try {
      const res = await fetch(`/api/admin/siswa/${params.id}`);
      if (res.ok) {
        const siswa: SiswaData = await res.json();
        setFormData({
          nisn: siswa.nisn,
          nama: siswa.nama,
          tanggalLahir: siswa.tanggalLahir.split('T')[0],
          kelas: siswa.kelas,
          jurusan: siswa.jurusan,
          email: siswa.email || '',
          noTelepon: siswa.noTelepon || '',
          statusKIPK: siswa.statusKIPK
        });
      } else {
        setError('Gagal memuat profil siswa');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Terjadi anomali pada sinkronisasi data');
    } finally {
      setFetchLoading(false);
    }
  };

  // --- SMART UPDATE HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/siswa/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tanggalLahir: new Date(formData.tanggalLahir).toISOString()
        })
      });

      if (res.ok) {
        router.push('/admin/siswa');
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal sinkronisasi update');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Kesalahan sistem tak terduga');
    } finally {
      setLoading(false);
    }
  };

  // --- LOADING VIEW (3D SPINNER) ---
  if (fetchLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFEFF]">
        <div className="w-20 h-20 border-8 border-slate-100 border-t-blue-600 rounded-full animate-spin mb-6" />
        <p className="text-xl font-black text-slate-300 uppercase tracking-widest italic">Synchronizing Student Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-8 font-sans text-slate-900 relative overflow-x-hidden">
      
      {/* 1. AMBIENT BACKGROUND ENGINE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-400/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto">
        
        {/* 2. HEADER NAVIGATION */}
        <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
                <Cpu size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Student Profile Editor</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-none">
              Edit <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 italic">Identitas.</span>
            </h1>
            <div className="mt-4 flex items-center gap-3">
              <div className="px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-400">
                TA {academicYear}
              </div>
              <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                ID: {params.id}
              </div>
            </div>
          </motion.div>

          <motion.button 
            whileHover={{ x: -5 }} onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-slate-400 shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeft size={18} /> Kembali
          </motion.button>
        </section>

        {/* 3. MAIN FORM CONTAINER (3D CARD) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-2xl border border-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden"
        >
          {error && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="bg-red-50 p-6 flex items-center gap-4 text-red-600 border-b border-red-100 font-bold">
              <AlertCircle /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10">
              
              {/* LEFT COLUMN: CORE IDENTITY */}
              <div className="space-y-8">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-2">
                  <User size={14} /> Informasi Personal
                </h3>

                <div className="space-y-6">
                  {/* NISN */}
                  <SmartInput 
                    label="Nomor Induk Siswa Nasional (NISN)" 
                    icon={<Hash size={20} />}
                    value={formData.nisn}
                    onChange={(val) => setFormData({ ...formData, nisn: val })}
                    placeholder="Wajib 10 Digit"
                    maxLength={10}
                    required
                  />

                  {/* NAMA */}
                  <SmartInput 
                    label="Nama Lengkap Berdasarkan Ijazah" 
                    icon={<User size={20} />}
                    value={formData.nama}
                    onChange={(val) => setFormData({ ...formData, nama: val })}
                    placeholder="Masukkan Nama Lengkap"
                    required
                  />

                  {/* TANGGAL LAHIR */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Tanggal Lahir</label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <Calendar size={20} />
                      </div>
                      <input
                        type="date"
                        value={formData.tanggalLahir}
                        onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                        required
                        className="w-full h-16 pl-14 pr-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700 shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: ACADEMIC & CONTACT */}
              <div className="space-y-8">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-2">
                  <GraduationCap size={14} /> Akademik & Kontak
                </h3>

                <div className="space-y-6">
                  {/* KELAS & JURUSAN GRID */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Kelas</label>
                      <select
                        value={formData.kelas}
                        onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                        required
                        className="w-full h-16 px-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700 shadow-inner cursor-pointer"
                      >
                        <option value="">Pilih</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Jurusan</label>
                      <select
                        value={formData.jurusan}
                        onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                        required
                        className="w-full h-16 px-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700 shadow-inner cursor-pointer"
                      >
                        <option value="">Pilih</option>
                        <option value="IPA">IPA</option>
                        <option value="IPS">IPS</option>
                        <option value="Bahasa">Bahasa</option>
                      </select>
                    </div>
                  </div>

                  {/* CONTACT INFO */}
                  <SmartInput 
                    label="Alamat Email (Opsional)" 
                    icon={<Mail size={20} />}
                    value={formData.email}
                    onChange={(val) => setFormData({ ...formData, email: val })}
                    placeholder="nama@contoh.com"
                    type="email"
                  />

                  <SmartInput 
                    label="Nomor WhatsApp" 
                    icon={<Phone size={20} />}
                    value={formData.noTelepon}
                    onChange={(val) => setFormData({ ...formData, noTelepon: val })}
                    placeholder="08xxxxxxxxxx"
                  />

                  {/* KIP-K STATUS (ALPHA TOGGLE) */}
                  <div className="pt-4">
                    <div 
                      onClick={() => setFormData({ ...formData, statusKIPK: !formData.statusKIPK })}
                      className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center justify-between group ${
                        formData.statusKIPK 
                          ? 'bg-orange-50 border-orange-200 text-orange-700 shadow-lg shadow-orange-500/5' 
                          : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl transition-colors ${formData.statusKIPK ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                          <Sparkles size={20} />
                        </div>
                        <div>
                          <p className="font-black text-sm uppercase tracking-tight">Status KIP-Kuliah</p>
                          <p className="text-[10px] font-bold opacity-70">Siswa Penerima Program Bantuan</p>
                        </div>
                      </div>
                      <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.statusKIPK ? 'bg-orange-500' : 'bg-slate-300'}`}>
                        <motion.div 
                          animate={{ x: formData.statusKIPK ? 24 : 4 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS (CLAYMORPHISM) */}
            <div className="mt-16 flex flex-col md:flex-row gap-6">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex-[2] h-20 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black text-xl shadow-[0_12px_0_0_#1e40af] active:shadow-none active:translate-y-3 transition-all flex items-center justify-center gap-4 disabled:opacity-50 group"
              >
                {loading ? (
                  <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>PERBARUI DATA <CheckCircle2 className="group-hover:rotate-12 transition-transform" /></>
                )}
              </motion.button>
              
              <motion.button
                type="button"
                onClick={() => router.back()}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex-1 h-20 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-[0_12px_0_0_#0f172a] active:shadow-none active:translate-y-3 transition-all"
              >
                BATAL
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* 4. FOOTER NOTE */}
        <footer className="mt-12 text-center opacity-40">
          <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            <Info size={14} /> Perubahan data akan dicatat ke dalam AuditLog sistem
          </div>
        </footer>
      </main>
    </div>
  );
}

// --- SMART REUSABLE INPUT COMPONENT ---
function SmartInput({ label, icon, value, onChange, placeholder, type = "text", required = false, maxLength }: any) {
  return (
    <div className="space-y-3 group">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 group-focus-within:text-blue-500 transition-colors">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          className="w-full h-16 pl-14 pr-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700 shadow-inner placeholder:text-slate-300"
        />
      </div>
    </div>
  );
}