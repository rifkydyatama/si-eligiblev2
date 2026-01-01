'use client';

/**
 * ==============================================================================
 * SI-ELIGIBLE SYSTEM CONFIGURATION TERMINAL v3.9 - FINAL STABLE BUILD
 * ==============================================================================
 * Module      : Centralized System Configuration (Yearly Sync & Logic)
 * Style       : Alpha-Gen Professional 3D (Neat & Calibrated)
 * Calibration : Optimized for 100% Desktop Scaling
 * Fixed       : ReferenceError School, Award, RefreshCcw & Duplicate Imports
 * Logic       : Auth-Safe Protocol with Multi-Tab State Engine
 * ==============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONOGRAPHY ENGINE (CONSOLIDATED & VERIFIED) ---
import { 
  Calendar, 
  Clock, 
  BarChart3, 
  Target, 
  FileOutput, 
  Settings2, 
  Code2, 
  ShieldCheck, 
  Cpu, 
  Plus, 
  CheckCircle2,
  Database,
  Activity,
  Zap,
  Layers,
  RefreshCcw,
  Download,
  Award,
  School
} from 'lucide-react';

// --- UI COMPONENTS ---
import { Button } from "@/components/ui/button";

// --- INTERFACES ---
interface TahunAkademik {
  id: string;
  tahun: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  isActive: boolean;
  createdAt: string;
  _count?: {
    periodeJalur: number;
  };
}

interface PeriodeJalur {
  id: string;
  tahunAkademikId: string;
  jalur: string;
  namaJalur: string;
  tanggalBukaPendaftaran: string;
  tanggalTutupPendaftaran: string;
  tanggalPengumuman: string;
  isActive: boolean;
}

// Reserved for future feature: Display existing configurations
interface KonfigurasiNilai {
  id: string;
  tahunAkademikId: string;
  kurikulum: string;
  jalur: string;
  bobotSemester1: number;
  bobotSemester2: number;
  bobotSemester3: number;
  bobotSemester4: number;
  bobotSemester5: number;
}

// Reserved for future feature: Display existing configurations
interface KonfigurasiKuota {
  id: string;
  tahunAkademikId: string;
  jalur: string;
  jurusan: string;
  persenKuotaSekolah: number;
  minimalRataRata: number;
  metodePeRankingan: string;
}

interface TemplateMapping {
  kolomSistem: string;
  kolomEkspor: string;
  tipeData: string;
  wajib: boolean;
  defaultValue?: string;
}

interface TemplateConfig {
  id: string;
  nama: string;
  tipe: string;
  isActive: boolean;
  mapping: TemplateMapping[];
}

interface JurusanSekolah {
  id: string;
  kode: string;
  nama: string;
  tingkat: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    siswa: number;
  };
}

export default function KonfigurasiPage() {
  // 1. CORE STATE MANAGEMENT
  const [activeTab, setActiveTab] = useState('tahun-akademik');
  const [systemUptime, setSystemUptime] = useState("");
  
  // Tabs Definition for Navigation
  const tabs = [
    { id: 'tahun-akademik', label: 'Tahun Akademik', icon: <Calendar size={18} /> },
    { id: 'periode-jalur', label: 'Timeline Jalur', icon: <Clock size={18} /> },
    { id: 'nilai', label: 'Bobot Nilai', icon: <BarChart3 size={18} /> },
    { id: 'kuota', label: 'Kuota Eligible', icon: <Target size={18} /> },
    { id: 'jurusan', label: 'Jurusan Sekolah', icon: <School size={18} /> },
    { id: 'export', label: 'Ekstraksi', icon: <FileOutput size={18} /> },
  ];

  // System Clock Engine
  useEffect(() => {
    const updateTime = () => setSystemUptime(new Date().toLocaleTimeString());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-8 lg:p-10 font-sans text-slate-900 relative overflow-x-hidden selection:bg-purple-600 selection:text-white">
      
      {/* KINETIC AMBIENT BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-400/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[140px] animate-pulse delay-700" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto">
        
        {/* --- HEADER: ALPHA COMMAND CENTER --- */}
        <header className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-4 mb-5">
              <div className="p-4 bg-purple-600 rounded-[1.25rem] text-white shadow-2xl shadow-purple-500/20 transform hover:rotate-12 transition-all">
                <Settings2 size={26} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-600 leading-none mb-1">Central Config v3.9</span>
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-2 uppercase">
                  <Code2 size={12} /> Secure Engine Session Active
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-950 leading-none uppercase italic">
              System <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 underline decoration-8">Settings.</span>
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl">
                <Clock size={16} className="text-purple-400" /> Server Time: {systemUptime}
              </div>
              <div className="px-6 py-2.5 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-100 flex items-center gap-3">
                <ShieldCheck size={16} /> Operational Core Integrated
              </div>
            </div>
          </motion.div>
        </header>

        {/* --- BENTO NAVIGATION TABS --- */}
        <nav className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {tabs.map((tab) => (
                    <motion.button
                        key={tab.id}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab(tab.id)}
                        className={`p-6 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-3 relative overflow-hidden group ${
                            activeTab === tab.id 
                            ? 'border-purple-600 bg-white shadow-2xl' 
                            : 'border-white bg-white/60 text-slate-400 hover:bg-white hover:shadow-xl shadow-sm'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            activeTab === tab.id ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-100 text-slate-300'
                        }`}>
                            {tab.icon}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${activeTab === tab.id ? 'text-slate-950' : 'text-slate-400'}`}>
                            {tab.label}
                        </span>
                        {activeTab === tab.id && (
                            <motion.div layoutId="activeTabMark" className="absolute top-3 right-3 text-purple-600">
                                <CheckCircle2 size={14} />
                            </motion.div>
                        )}
                    </motion.button>
                ))}
            </div>
        </nav>

        {/* --- CONTENT ENGINE: DYNAMIC FORM RENDERING --- */}
        <div className="bg-white rounded-[4rem] p-10 md:p-14 border border-slate-50 shadow-[0_40px_80px_rgba(0,0,0,0.03)] relative overflow-hidden group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="relative z-10"
                >
                    {activeTab === 'tahun-akademik' && <TahunAkademikSection />}
                    {activeTab === 'periode-jalur' && <PeriodeJalurSection />}
                    {activeTab === 'nilai' && <KonfigurasiNilaiSection />}
                    {activeTab === 'kuota' && <KonfigurasiKuotaSection />}
                    {activeTab === 'jurusan' && <JurusanSekolahSection />}
                    {activeTab === 'export' && <TemplateExportSection />}
                </motion.div>
            </AnimatePresence>

            {/* Decorative Background Icon */}
            <div className="absolute -bottom-10 -right-10 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                <Database size={400} />
            </div>
        </div>

        {/* --- GLOBAL FOOTER ARCHITECTURE --- */}
        <footer className="mt-40 py-24 border-t-8 border-slate-950/5 flex flex-col md:flex-row items-center justify-between opacity-30 text-center md:text-left gap-12">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-6">
                <div className="w-16 h-1.5 bg-purple-600 rounded-full" />
                <p className="text-[18px] font-black uppercase tracking-[1em] text-slate-950 leading-none">SMKN 1 KADEMANGAN</p>
            </div>
            <p className="text-[12px] font-bold text-slate-500 tracking-[0.4em] uppercase italic leading-none">Alpha Intelligence Configuration Engine v3.9 Build Stable</p>
          </div>
          <div className="flex gap-16">
             <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-purple-50 rounded-2xl text-purple-600 shadow-inner">
                    <Cpu size={32} /> 
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] leading-none text-purple-900">Neural-Core</span>
             </div>
             <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shadow-inner">
                    <ShieldCheck size={32} /> 
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] leading-none text-blue-900">Titan-Shield</span>
             </div>
          </div>
        </footer>
      </main>

      {/* FLOAT SYNC WIDGET */}
      <div className="fixed bottom-12 right-12 z-50 hidden lg:block">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}
            className="bg-white/90 backdrop-blur-3xl border-4 border-white p-7 rounded-[3.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.15)] flex items-center gap-8 group cursor-pointer"
        >
            <div className="w-14 h-14 bg-purple-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-2xl animate-bounce">
                <Layers size={24} />
            </div>
            <div className="pr-10 border-r border-slate-100">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none mb-2 italic">Protocol Stability</p>
                <p className="text-base font-black text-slate-950 uppercase italic tracking-tighter leading-none">Safe-Bridge Ready</p>
            </div>
        </motion.div>
      </div>

    </div>
  );
}

/**
 * ==============================================================================
 * SECTION SUB-COMPONENTS (ALPHA LEVEL)
 * ==============================================================================
 */

// 1. TAHUN AKADEMIK SECTION
function TahunAkademikSection() {
  const [formData, setFormData] = useState({ tahun: '', tanggalMulai: '', tanggalSelesai: '', isActive: false });
  const [data, setData] = useState<TahunAkademik[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTahunAkademik = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/konfigurasi/tahun-akademik');
      const contentType = res.headers.get("content-type") || "";
      
      if (contentType.includes("text/html")) {
        console.error("Auth Error: API redirected to Login HTML");
        return;
      }

      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) { console.error("Sync Failure", e); }
  }, []);

  useEffect(() => { fetchTahunAkademik(); }, [fetchTahunAkademik]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/konfigurasi/tahun-akademik', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Protokol Berhasil: Tahun Akademik Terintegrasi.");
        setFormData({ tahun: '', tanggalMulai: '', tanggalSelesai: '', isActive: false });
        fetchTahunAkademik();
      } else {
        const err = await res.json();
        alert(`Gagal: ${err.error}`);
      }
    } catch (err) { 
      console.error('Error:', err);
      alert("Anomali Jaringan terdeteksi."); 
    }
    finally { setLoading(false); }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/konfigurasi/tahun-akademik', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus })
      });
      if (res.ok) fetchTahunAkademik();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Tahun Akademik.</h2>
            <p className="text-slate-400 font-bold text-sm mt-3 uppercase tracking-widest italic">Registrasi data periodik sistem utama</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-2xl text-purple-600 shadow-inner">
             <Calendar size={32} />
          </div>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Year Identifier</label>
              <input 
                type="text" placeholder="2025/2026" required
                value={formData.tahun} onChange={e => setFormData({...formData, tahun: e.target.value})}
                className="w-full h-16 px-6 rounded-3xl bg-[#F8FAFC] border-none font-black text-slate-700 shadow-inner focus:ring-4 focus:ring-purple-500/10 transition-all uppercase italic"
              />
          </div>
          <div className="md:col-span-3 space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Start Node</label>
              <input 
                type="date" required
                value={formData.tanggalMulai} onChange={e => setFormData({...formData, tanggalMulai: e.target.value})}
                className="w-full h-16 px-6 rounded-3xl bg-[#F8FAFC] border-none font-bold text-slate-700 shadow-inner focus:ring-4 focus:ring-purple-500/10 transition-all"
              />
          </div>
          <div className="md:col-span-3 space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">End Node</label>
              <input 
                type="date" required
                value={formData.tanggalSelesai} onChange={e => setFormData({...formData, tanggalSelesai: e.target.value})}
                className="w-full h-16 px-6 rounded-3xl bg-[#F8FAFC] border-none font-bold text-slate-700 shadow-inner focus:ring-4 focus:ring-purple-500/10 transition-all"
              />
          </div>
          <div className="md:col-span-2 flex items-end">
              <motion.button 
                whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }} type="submit" disabled={loading}
                className="w-full h-16 bg-purple-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-[0_10px_0_0_#581c87] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-3"
              >
                {loading ? <RefreshCcw size={18} className="animate-spin" /> : <Plus size={20} />} CREATE
              </motion.button>
          </div>
      </form>

      <div className="pt-10 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 ml-2 mb-6">Archive Registry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.map((item) => (
                  <div key={item.id} className="p-8 bg-[#F8FAFC] rounded-[3rem] border border-white shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
                      <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12 ${item.isActive ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-200 text-slate-400 shadow-slate-200/20'}`}>
                              <Zap size={24} fill={item.isActive ? "white" : "none"} />
                          </div>
                          <div>
                              <p className="text-2xl font-black text-slate-800 italic leading-none">{item.tahun}</p>
                              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest italic">{item.tanggalMulai.split('T')[0]} - {item.tanggalSelesai.split('T')[0]}</p>
                          </div>
                      </div>
                      <div className="flex gap-4">
                           <button 
                             onClick={() => handleToggleActive(item.id, item.isActive)}
                             className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${item.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-200 text-slate-500'}`}
                           >
                               {item.isActive ? 'ACTIVE' : 'STANDBY'}
                           </button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}

// 2. PERIODE JALUR SECTION
function PeriodeJalurSection() {
    const [tahunAkademik, setTahunAkademik] = useState<TahunAkademik[]>([]);
    const [periodeData, setPeriodeData] = useState<Record<string, {tanggalBukaPendaftaran: string; tanggalTutupPendaftaran: string; tanggalPengumuman: string; id?: string}>>({});
    const [loading, setLoading] = useState<Record<string, boolean>>({});

    const jalurList = [
        { code: 'SNBP', name: 'SNBP' },
        { code: 'SNBT', name: 'SNBT' },
        { code: 'SPAN-PTKIN', name: 'SPAN-PTKIN' },
        { code: 'UM-PTKIN', name: 'UM-PTKIN' }
    ];

    const fetchData = useCallback(async () => {
        try {
            const [taRes, pjRes] = await Promise.all([
                fetch('/api/konfigurasi/tahun-akademik'),
                fetch('/api/konfigurasi/periode-jalur')
            ]);
            
            if (taRes.ok) {
                const taData = await taRes.json();
                setTahunAkademik(taData);
            }
            if (pjRes.ok) {
                const pjData = await pjRes.json();
                // Pre-fill form dengan data existing
                const dataMap: Record<string, {tanggalBukaPendaftaran: string; tanggalTutupPendaftaran: string; tanggalPengumuman: string; id: string}> = {};
                pjData.forEach((p: PeriodeJalur) => {
                    dataMap[p.jalur] = {
                        tanggalBukaPendaftaran: p.tanggalBukaPendaftaran.split('T')[0],
                        tanggalTutupPendaftaran: p.tanggalTutupPendaftaran.split('T')[0],
                        tanggalPengumuman: p.tanggalPengumuman.split('T')[0],
                        id: p.id
                    };
                });
                setPeriodeData(dataMap);
            }
        } catch (e) { console.error('Fetch error:', e); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSubmit = async (jalur: string, namaJalur: string) => {
        const data = periodeData[jalur];
        if (!data?.tanggalBukaPendaftaran || !data?.tanggalTutupPendaftaran || !data?.tanggalPengumuman) {
            alert('Lengkapi semua tanggal terlebih dahulu!');
            return;
        }

        const activeTA = tahunAkademik.find(ta => ta.isActive);
        if (!activeTA) {
            alert('Tidak ada tahun akademik aktif!');
            return;
        }

        setLoading({ ...loading, [jalur]: true });
        try {
            const res = await fetch('/api/konfigurasi/periode-jalur', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tahunAkademikId: activeTA.id,
                    jalur,
                    namaJalur,
                    tanggalBukaPendaftaran: data.tanggalBukaPendaftaran,
                    tanggalTutupPendaftaran: data.tanggalTutupPendaftaran,
                    tanggalPengumuman: data.tanggalPengumuman
                })
            });
            
            if (res.ok) {
                alert(`Periode ${namaJalur} berhasil disimpan!`);
                fetchData();
            } else {
                const err = await res.json();
                alert(`Gagal: ${err.error}`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Terjadi kesalahan jaringan');
        } finally {
            setLoading({ ...loading, [jalur]: false });
        }
    };

    const updatePeriodeData = (jalur: string, field: string, value: string) => {
        setPeriodeData({
            ...periodeData,
            [jalur]: { ...periodeData[jalur], [field]: value }
        });
    };

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Timeline Protocol.</h2>
                    <p className="text-slate-400 font-bold text-sm mt-3 uppercase tracking-widest italic">Synchronize college selection entrance schedule</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shadow-inner">
                    <Clock size={32} />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {jalurList.map((jalur) => (
                    <div key={jalur.code} className="bg-[#F8FAFC] rounded-[3rem] p-8 border border-white shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black italic text-slate-800">{jalur.name}</h3>
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-all">
                                <Zap size={18} />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <SmartInput 
                                label="Portal Start" 
                                type="date" 
                                value={periodeData[jalur.code]?.tanggalBukaPendaftaran || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePeriodeData(jalur.code, 'tanggalBukaPendaftaran', e.target.value)}
                            />
                            <SmartInput 
                                label="Portal Close" 
                                type="date" 
                                value={periodeData[jalur.code]?.tanggalTutupPendaftaran || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePeriodeData(jalur.code, 'tanggalTutupPendaftaran', e.target.value)}
                            />
                            <SmartInput 
                                label="D-Day Announcement" 
                                type="date" 
                                value={periodeData[jalur.code]?.tanggalPengumuman || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePeriodeData(jalur.code, 'tanggalPengumuman', e.target.value)}
                            />
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => handleSubmit(jalur.code, jalur.name)}
                            disabled={loading[jalur.code]}
                            className="w-full mt-10 h-14 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_8px_0_0_#1e293b] active:shadow-none active:translate-y-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading[jalur.code] ? <RefreshCcw size={16} className="animate-spin" /> : null}
                            UPDATE {jalur.name}
                        </motion.button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 3. KONFIGURASI NILAI SECTION
function KonfigurasiNilaiSection() {
    const [tahunAkademik, setTahunAkademik] = useState<TahunAkademik[]>([]);
    const [kurikulum, setKurikulum] = useState('Kurikulum Merdeka');
    const [jalur, setJalur] = useState('SNBP');
    const [bobotSemester, setBobotSemester] = useState({
        sem1: 0.2,
        sem2: 0.2,
        sem3: 0.2,
        sem4: 0.2,
        sem5: 0.2
    });
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch('/api/konfigurasi/tahun-akademik');
            if (res.ok) {
                const data = await res.json();
                setTahunAkademik(data);
            }
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const totalBobot = Object.values(bobotSemester).reduce((a, b) => a + b, 0);
    const isValid = Math.abs(totalBobot - 1.0) < 0.001;

    const handleSubmit = async () => {
        if (!isValid) {
            alert('Total bobot harus = 100% (1.0)!');
            return;
        }

        const activeTA = tahunAkademik.find(ta => ta.isActive);
        if (!activeTA) {
            alert('Tidak ada tahun akademik aktif!');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/konfigurasi/nilai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tahunAkademikId: activeTA.id,
                    kurikulum,
                    jalur,
                    bobotSemester1: bobotSemester.sem1,
                    bobotSemester2: bobotSemester.sem2,
                    bobotSemester3: bobotSemester.sem3,
                    bobotSemester4: bobotSemester.sem4,
                    bobotSemester5: bobotSemester.sem5,
                    mataPelajaranWajib: [],
                    mataPelajaranPeminatan: [],
                    formulaPerhitungan: 'weighted_average'
                })
            });
            
            if (res.ok) {
                alert('Konfigurasi nilai berhasil disimpan!');
            } else {
                const err = await res.json();
                alert(`Gagal: ${err.error}`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Terjadi kesalahan jaringan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Score Weighting.</h2>
                    <p className="text-slate-400 font-bold text-sm mt-3 uppercase tracking-widest italic">Define algorithmic semester and map weighting</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 shadow-inner">
                    <BarChart3 size={32} />
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <SmartSelect 
                        label="Target Curriculum" 
                        options={["Kurikulum Merdeka", "Kurikulum 2013"]} 
                        value={kurikulum}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setKurikulum(e.target.value)}
                    />
                    <SmartSelect 
                        label="Entrance Path" 
                        options={["SNBP", "SNBT", "SPAN-PTKIN"]} 
                        value={jalur}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setJalur(e.target.value)}
                    />
                </div>
                <div className="lg:col-span-2 bg-[#F8FAFC] rounded-[3.5rem] p-10 border border-white shadow-inner">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8">Semester Load (%)</h3>
                    <div className="grid grid-cols-5 gap-4">
                        {[1,2,3,4,5].map(sem => (
                            <div key={sem} className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase text-center block tracking-widest italic">SEM {sem}</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={bobotSemester[`sem${sem}` as keyof typeof bobotSemester]} 
                                    onChange={(e) => setBobotSemester({...bobotSemester, [`sem${sem}`]: parseFloat(e.target.value) || 0})}
                                    className="w-full h-16 text-center rounded-2xl bg-white border-none shadow-sm font-black text-emerald-600 text-xl focus:ring-4 focus:ring-emerald-500/10" 
                                />
                            </div>
                        ))}
                    </div>
                    <div className={`mt-10 p-6 rounded-2xl flex items-center gap-4 ${isValid ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        <Activity size={20} className={isValid ? 'animate-pulse' : ''} />
                        <p className="text-[10px] font-black uppercase tracking-widest italic leading-none">
                            {isValid ? `Algorithm Status: Total weight validated (${(totalBobot * 100).toFixed(1)}%)` : `WARNING: Total = ${(totalBobot * 100).toFixed(1)}% (harus 100%)`}
                        </p>
                    </div>
                </div>
            </div>
            <Button 
                onClick={handleSubmit}
                disabled={loading || !isValid}
                className="h-18 px-12 bg-emerald-600 rounded-3xl font-black uppercase tracking-widest shadow-[0_10px_0_0_#065f46] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {loading ? <RefreshCcw size={18} className="animate-spin" /> : null}
                COMMIT WEIGHTING
            </Button>
        </div>
    );
}

// 4. KUOTA & RANKING SECTION
function KonfigurasiKuotaSection() {
    const [tahunAkademik, setTahunAkademik] = useState<TahunAkademik[]>([]);
    const [persenKuota, setPersenKuota] = useState(40);
    const [minimalRataRata, setMinimalRataRata] = useState(80);
    const [metodePeRankingan, setMetodePeRankingan] = useState('Per Jurusan');
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch('/api/konfigurasi/tahun-akademik');
            if (res.ok) {
                const data = await res.json();
                setTahunAkademik(data);
            }
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSubmit = async () => {
        const activeTA = tahunAkademik.find(ta => ta.isActive);
        if (!activeTA) {
            alert('Tidak ada tahun akademik aktif!');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/konfigurasi/kuota', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tahunAkademikId: activeTA.id,
                    jalur: 'SNBP',
                    jurusan: 'Semua Jurusan',
                    persenKuotaSekolah: persenKuota / 100,
                    minimalRataRata,
                    metodePeRankingan
                })
            });
            
            if (res.ok) {
                alert('Konfigurasi kuota berhasil disimpan!');
            } else {
                const err = await res.json();
                alert(`Gagal: ${err.error}`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Terjadi kesalahan jaringan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Quota Metrics.</h2>
                    <p className="text-slate-400 font-bold text-sm mt-3 uppercase tracking-widest italic">School eligibility and ranking rule definition</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 shadow-inner">
                    <Target size={32} />
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-slate-950 rounded-[3rem] p-10 text-white relative overflow-hidden group border-b-[15px] border-amber-500">
                    <h3 className="text-xl font-black italic uppercase mb-8 relative z-10">Eligible Quota</h3>
                    <div className="flex items-end gap-2 relative z-10 mb-2">
                        <input 
                            type="number"
                            value={persenKuota}
                            onChange={(e) => setPersenKuota(parseInt(e.target.value) || 0)}
                            className="text-7xl font-black tracking-tighter leading-none text-amber-500 bg-transparent border-none outline-none w-32"
                        />
                        <span className="text-2xl font-black text-slate-400 mb-2">%</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic mb-10 relative z-10">Top Students per Major</p>
                    <div className="absolute top-0 right-0 w-[50%] h-full bg-amber-500/10 blur-[80px]" />
                </div>
                
                <div className="md:col-span-2 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <SmartInput 
                            label="Minimum GPA Threshold" 
                            type="number" 
                            placeholder="80.0" 
                            value={minimalRataRata}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinimalRataRata(parseFloat(e.target.value) || 0)}
                        />
                        <SmartSelect 
                            label="Ranking Method" 
                            options={["Per Jurusan", "Per Kelas", "Global School"]} 
                            value={metodePeRankingan}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMetodePeRankingan(e.target.value)}
                        />
                    </div>
                    <div className="bg-[#F8FAFC] p-8 rounded-[2.5rem] border border-white flex items-center justify-between group">
                         <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm group-hover:rotate-12 transition-transform">
                                <Award size={24} />
                            </div>
                            <p className="text-sm font-black text-slate-800 uppercase italic tracking-tighter">Enable Automated Ranking Integration</p>
                         </div>
                         <div className="w-16 h-8 bg-amber-500 rounded-full flex items-center justify-end px-1 cursor-pointer">
                            <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
                         </div>
                    </div>
                </div>
            </div>
            <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="h-18 px-12 bg-amber-600 rounded-3xl font-black uppercase tracking-widest shadow-[0_10px_0_0_#92400e] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {loading ? <RefreshCcw size={18} className="animate-spin" /> : null}
                APPLY GLOBAL QUOTA
            </Button>
        </div>
    );
}

// 5. JURUSAN SEKOLAH SECTION
function JurusanSekolahSection() {
    const [jurusan, setJurusan] = useState<JurusanSekolah[]>([]);
    const [formData, setFormData] = useState({ kode: '', nama: '', tingkat: 'SMK', isActive: true });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchJurusan = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/konfigurasi/jurusan-sekolah');
            if (res.ok) {
                const data = await res.json();
                setJurusan(data);
            }
        } catch (e) {
            console.error('Error fetching jurusan:', e);
        }
    }, []);

    useEffect(() => {
        fetchJurusan();
    }, [fetchJurusan]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.kode || !formData.nama) {
            alert('Kode dan nama jurusan wajib diisi!');
            return;
        }

        setLoading(true);
        try {
            const url = '/api/admin/konfigurasi/jurusan-sekolah';
            const method = editingId ? 'PUT' : 'POST';
            const body = editingId ? { ...formData, id: editingId } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                alert(editingId ? 'Jurusan berhasil diupdate!' : 'Jurusan berhasil ditambahkan!');
                setFormData({ kode: '', nama: '', tingkat: 'SMK', isActive: true });
                setEditingId(null);
                fetchJurusan();
            } else {
                const err = await res.json();
                alert(`Gagal: ${err.error}`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Terjadi kesalahan jaringan');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: JurusanSekolah) => {
        setFormData({
            kode: item.kode,
            nama: item.nama,
            tingkat: item.tingkat,
            isActive: item.isActive
        });
        setEditingId(item.id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus jurusan ini?')) return;

        try {
            const res = await fetch(`/api/admin/konfigurasi/jurusan-sekolah?id=${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert('Jurusan berhasil dihapus!');
                fetchJurusan();
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Gagal menghapus jurusan');
        }
    };

    const handleToggleActive = async (item: JurusanSekolah) => {
        try {
            const res = await fetch('/api/admin/konfigurasi/jurusan-sekolah', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...item, isActive: !item.isActive })
            });

            if (res.ok) {
                fetchJurusan();
            } else {
                const error = await res.json();
                alert(error.error || 'Gagal mengubah status');
                // Refresh data untuk sinkronisasi
                fetchJurusan();
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Terjadi kesalahan. Silakan refresh halaman.');
            fetchJurusan();
        }
    };

    const cancelEdit = () => {
        setFormData({ kode: '', nama: '', tingkat: 'SMK', isActive: true });
        setEditingId(null);
    };

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Jurusan Sekolah.</h2>
                    <p className="text-slate-400 font-bold text-sm mt-3 uppercase tracking-widest italic">Kelola master data jurusan/program keahlian</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 shadow-inner">
                    <School size={32} />
                </div>
            </div>

            {/* FORM INPUT */}
            <form onSubmit={handleSubmit} className="bg-[#F8FAFC] rounded-[3rem] p-8 md:p-10 border border-white shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-6">
                    {editingId ? 'Edit Jurusan' : 'Tambah Jurusan Baru'}
                </h3>
                <div className="grid md:grid-cols-12 gap-6">
                    <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Kode</label>
                        <input
                            type="text"
                            placeholder="IPA"
                            required
                            value={formData.kode}
                            onChange={e => setFormData({ ...formData, kode: e.target.value.toUpperCase() })}
                            className="w-full h-16 px-6 rounded-3xl bg-white border-none font-black text-slate-700 shadow-inner focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase"
                        />
                    </div>
                    <div className="md:col-span-5 space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Nama Jurusan</label>
                        <input
                            type="text"
                            placeholder="Ilmu Pengetahuan Alam"
                            required
                            value={formData.nama}
                            onChange={e => setFormData({ ...formData, nama: e.target.value })}
                            className="w-full h-16 px-6 rounded-3xl bg-white border-none font-bold text-slate-700 shadow-inner focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Tingkat</label>
                        <select
                            value={formData.tingkat}
                            onChange={e => setFormData({ ...formData, tingkat: e.target.value })}
                            className="w-full h-16 px-6 rounded-3xl bg-white border-none font-bold text-slate-700 shadow-inner focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                        >
                            <option value="SMA">SMA</option>
                            <option value="SMK">SMK</option>
                        </select>
                    </div>
                    <div className="md:col-span-3 flex items-end gap-3">
                        {editingId && (
                            <motion.button
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={cancelEdit}
                                className="flex-1 h-16 bg-slate-200 text-slate-600 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-300 transition-all"
                            >
                                BATAL
                            </motion.button>
                        )}
                        <motion.button
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={loading}
                            className="flex-1 h-16 bg-indigo-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-[0_10px_0_0_#4338ca] active:shadow-none active:translate-y-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {loading ? <RefreshCcw size={18} className="animate-spin" /> : <Plus size={20} />}
                            {editingId ? 'UPDATE' : 'TAMBAH'}
                        </motion.button>
                    </div>
                </div>
            </form>

            {/* LIST JURUSAN */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 ml-2 mb-6">Daftar Jurusan Terdaftar</h3>
                
                {/* Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 pb-4 border-b border-slate-100">
                    <div className="col-span-2 text-[9px] font-black uppercase tracking-wider text-slate-400">Kode</div>
                    <div className="col-span-5 text-[9px] font-black uppercase tracking-wider text-slate-400">Nama Jurusan</div>
                    <div className="col-span-2 text-[9px] font-black uppercase tracking-wider text-slate-400">Tingkat</div>
                    <div className="col-span-1 text-[9px] font-black uppercase tracking-wider text-slate-400">Status</div>
                    <div className="col-span-2 text-[9px] font-black uppercase tracking-wider text-slate-400 text-right">Aksi</div>
                </div>

                {/* Data Rows */}
                <div className="space-y-3">
                    {jurusan.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid md:grid-cols-12 gap-4 items-center bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="md:col-span-2">
                                <span className="inline-block px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-black text-sm">
                                    {item.kode}
                                </span>
                            </div>
                            <div className="md:col-span-5">
                                <p className="text-base font-black text-slate-800">{item.nama}</p>
                                {item._count && item._count.siswa > 0 && (
                                    <p className="text-xs font-bold text-slate-400 mt-1">
                                        {item._count.siswa} siswa terdaftar
                                    </p>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    item.tingkat === 'SMA' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                }`}>
                                    {item.tingkat}
                                </span>
                            </div>
                            <div className="md:col-span-1">
                                <button
                                    onClick={() => handleToggleActive(item)}
                                    className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                                        item.isActive
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                                    }`}
                                >
                                    {item.isActive ? 'Aktif' : 'Nonaktif'}
                                </button>
                            </div>
                            <div className="md:col-span-2 flex gap-2 justify-end">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center"
                                    title="Edit"
                                >
                                    <Award size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                    title="Hapus"
                                >
                                    ✕
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {jurusan.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <School size={40} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Belum ada data jurusan</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// 6. TEMPLATE EXPORT SECTION
function TemplateExportSection() {
    const [templates, setTemplates] = useState<TemplateConfig[]>([]);
    const [editingTemplate, setEditingTemplate] = useState<TemplateConfig | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchTemplates = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/export/template');
            if (res.ok) {
                const data = await res.json();
                setTemplates(data);
            }
        } catch (e) {
            console.error('Error fetching templates:', e);
        }
    }, []);

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    const handleEditMapping = (template: TemplateConfig) => {
        setEditingTemplate({ ...template });
        setShowEditModal(true);
    };

    const handleSaveMapping = async () => {
        if (!editingTemplate) return;
        
        setLoading(true);
        try {
            const res = await fetch('/api/admin/export/template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingTemplate)
            });

            if (res.ok) {
                alert('Mapping berhasil disimpan!');
                setShowEditModal(false);
                fetchTemplates();
            } else {
                const err = await res.json();
                alert(`Gagal: ${err.error}`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Terjadi kesalahan jaringan');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadTemplate = async (template: TemplateConfig) => {
        try {
            // Generate CSV header dari mapping
            const headers = template.mapping.map((m: TemplateMapping) => m.kolomEkspor).join(',');
            const csvContent = `data:text/csv;charset=utf-8,${headers}\n`;
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `${template.nama.replace(/\s+/g, '_')}_Template.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Error downloading:', err);
            alert('Gagal mengunduh template');
        }
    };

    const updateMapping = (index: number, field: string, value: string) => {
        if (!editingTemplate) return;
        const newMapping = [...editingTemplate.mapping];
        newMapping[index] = { ...newMapping[index], [field]: value };
        setEditingTemplate({ ...editingTemplate, mapping: newMapping });
    };

    const addMappingRow = () => {
        if (!editingTemplate) return;
        setEditingTemplate({
            ...editingTemplate,
            mapping: [
                ...editingTemplate.mapping,
                { kolomSistem: '', kolomEkspor: '', tipeData: 'string', wajib: false }
            ]
        });
    };

    const removeMappingRow = (index: number) => {
        if (!editingTemplate) return;
        const newMapping = editingTemplate.mapping.filter((_: TemplateMapping, i: number) => i !== index);
        setEditingTemplate({ ...editingTemplate, mapping: newMapping });
    };

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Extraction Templates.</h2>
                    <p className="text-slate-400 font-bold text-sm mt-3 uppercase tracking-widest italic">Manage mapping for PDSS and SPAN-PTKIN exports</p>
                </div>
                <div className="p-4 bg-slate-100 rounded-2xl text-slate-600 shadow-inner">
                    <FileOutput size={32} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {templates.map(tpl => (
                    <div key={tpl.id} className="bg-[#F8FAFC] rounded-[3.5rem] p-10 border border-white hover:shadow-2xl transition-all group">
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-16 h-16 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-all">
                                {tpl.tipe === 'PDSS' ? <BarChart3 size={28} /> : <School size={28} />}
                            </div>
                            <span className={`px-5 py-2 border rounded-full text-[10px] font-black uppercase tracking-widest ${tpl.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                {tpl.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-2">{tpl.nama}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 italic">{tpl.tipe} Format</p>
                        <div className="mb-6 p-4 bg-white rounded-2xl">
                            <p className="text-[9px] font-black uppercase tracking-wider text-slate-300 mb-2">Mapped Columns</p>
                            <p className="text-sm font-black text-slate-600">{tpl.mapping?.length || 0} Fields Configured</p>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => handleEditMapping(tpl)}
                                className="flex-1 h-14 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-[0_6px_0_0_#e2e8f0] active:shadow-none active:translate-y-1 transition-all hover:bg-slate-50"
                            >
                                EDIT MAPPING
                            </button>
                            <button 
                                onClick={() => handleDownloadTemplate(tpl)}
                                className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-950 hover:text-white transition-all"
                            >
                                <Download size={20}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* EDIT MAPPING MODAL */}
            <AnimatePresence>
                {showEditModal && editingTemplate && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowEditModal(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-[3rem] p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-2">
                                        Edit Mapping
                                    </h3>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">
                                        {editingTemplate.nama}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setShowEditModal(false)}
                                    className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-950 hover:text-white transition-all flex items-center justify-center font-black text-xl"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="grid grid-cols-12 gap-4 px-4">
                                    <div className="col-span-3 text-[9px] font-black uppercase tracking-wider text-slate-400">Kolom Sistem</div>
                                    <div className="col-span-3 text-[9px] font-black uppercase tracking-wider text-slate-400">Kolom Export</div>
                                    <div className="col-span-2 text-[9px] font-black uppercase tracking-wider text-slate-400">Tipe</div>
                                    <div className="col-span-2 text-[9px] font-black uppercase tracking-wider text-slate-400">Wajib</div>
                                    <div className="col-span-2"></div>
                                </div>

                                {editingTemplate.mapping.map((m: TemplateMapping, idx: number) => (
                                    <div key={idx} className="grid grid-cols-12 gap-4 items-center bg-slate-50 p-4 rounded-2xl">
                                        <div className="col-span-3">
                                            <input 
                                                type="text"
                                                value={m.kolomSistem}
                                                onChange={(e) => updateMapping(idx, 'kolomSistem', e.target.value)}
                                                className="w-full h-12 px-4 rounded-xl bg-white border-none shadow-sm font-bold text-sm text-slate-700"
                                                placeholder="nisn"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <input 
                                                type="text"
                                                value={m.kolomEkspor}
                                                onChange={(e) => updateMapping(idx, 'kolomEkspor', e.target.value)}
                                                className="w-full h-12 px-4 rounded-xl bg-white border-none shadow-sm font-bold text-sm text-slate-700"
                                                placeholder="NISN"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <select
                                                value={m.tipeData}
                                                onChange={(e) => updateMapping(idx, 'tipeData', e.target.value)}
                                                className="w-full h-12 px-4 rounded-xl bg-white border-none shadow-sm font-bold text-sm text-slate-700"
                                            >
                                                <option value="string">String</option>
                                                <option value="number">Number</option>
                                                <option value="boolean">Boolean</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <input 
                                                type="checkbox"
                                                checked={m.wajib}
                                                onChange={(e) => updateMapping(idx, 'wajib', e.target.checked.toString())}
                                                className="w-6 h-6 rounded-lg"
                                            />
                                        </div>
                                        <div className="col-span-2 flex justify-end">
                                            <button
                                                onClick={() => removeMappingRow(idx)}
                                                className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center font-black"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={addMappingRow}
                                className="w-full h-14 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-purple-300 hover:text-purple-600 transition-all font-black text-xs uppercase tracking-widest mb-8 flex items-center justify-center gap-2"
                            >
                                <Plus size={18} /> Add Column Mapping
                            </button>

                            <div className="flex gap-4">
                                <Button
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 h-16 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveMapping}
                                    disabled={loading}
                                    className="flex-1 h-16 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-[0_8px_0_0_#7c3aed] active:shadow-none active:translate-y-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? <RefreshCcw size={18} className="animate-spin" /> : null}
                                    Save Mapping
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- SUB-ELEMENTS: ATOMIC UI ---

interface SmartInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function SmartInput({ label, type = "text", placeholder, value, onChange }: SmartInputProps) {
  return (
    <div className="space-y-3 group">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 group-focus-within:text-purple-600 transition-colors">
        {label}
      </label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full h-16 px-6 rounded-3xl bg-white border-2 border-slate-50 focus:border-purple-200 focus:ring-4 focus:ring-purple-500/5 transition-all font-bold text-slate-700 shadow-sm"
      />
    </div>
  );
}

interface SmartSelectProps {
  label: string;
  options: string[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

function SmartSelect({ label, options, value, onChange }: SmartSelectProps) {
    return (
      <div className="space-y-3 group">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 group-focus-within:text-purple-600 transition-colors">
          {label}
        </label>
        <select 
            value={value}
            onChange={onChange}
            className="w-full h-16 px-6 rounded-3xl bg-white border-2 border-slate-50 focus:border-purple-200 shadow-sm font-bold text-slate-700 cursor-pointer appearance-none"
        >
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    );
}