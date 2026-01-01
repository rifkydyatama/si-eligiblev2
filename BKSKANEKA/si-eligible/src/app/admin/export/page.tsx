'use client';

/**
 * ==============================================================================
 * SI-ELIGIBLE DATA EXPORT TERMINAL v3.7 - REFINED STABLE
 * ==============================================================================
 * Module      : Multi-Format Data Extraction
 * Style       : Alpha-Gen Professional 3D (Neat & Calibrated)
 * Calibration : Optimized for 100% Desktop Scaling
 * Fixed       : CLIENT_FETCH_ERROR Resilience & JSON Parsing Guard
 * Logic       : Advanced AbortController with Content-Type Validation
 * ==============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONOGRAPHY ENGINE (CONSOLIDATED & VERIFIED) ---
import { 
  FileSpreadsheet, 
  Download, 
  ShieldCheck, 
  Database, 
  Zap, 
  Clock, 
  FileText, 
  LayoutDashboard, 
  Code2, 
  Sparkles, 
  ChevronRight, 
  Info, 
  Activity, 
  CheckCircle2, 
  FileJson,
  Layers,
  ArrowRightLeft,
  Share2,
  BarChart4, 
  School,
  RefreshCcw,
  ArrowUpRight,
  Cpu,
  Image as ImageIcon
} from 'lucide-react';

// --- UI COMPONENTS ---
import { Button } from "@/components/ui/button";

export default function ExportDataPage() {
  // 1. CORE STATE MANAGEMENT
  const [loading, setLoading] = useState(false);
  const [selectedJalur, setSelectedJalur] = useState('SNBP');
  const [academicYear, setAcademicYear] = useState("");
  const [exportHistory, setExportHistory] = useState<string[]>([]);

  // 2. INITIALIZATION ENGINE
  useEffect(() => {
    const now = new Date();
    const period = now.getMonth() + 1 >= 7 
      ? `${now.getFullYear()}/${now.getFullYear() + 1}` 
      : `${now.getFullYear() - 1}/${now.getFullYear()}`;
    setAcademicYear(period);
  }, []);

  // 3. LOGIC: SECURE EXPORT PROTOCOL (V3.7 IMPROVED)
  const handleExport = async (format: string) => {
    setLoading(true);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort("Request Timeout"), 60000); 

    try {
      const res = await fetch('/api/admin/export', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json, application/octet-stream'
        },
        body: JSON.stringify({
          jalur: selectedJalur,
          format: format
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // --- CRITICAL GUARD: CEK CONTENT-TYPE SEBELUM PARSING ---
      const contentType = res.headers.get("content-type") || "";
      
      // Jika server mengirim HTML (Redirect Login/Error 404), hentikan segera
      if (contentType.includes("text/html")) {
        throw new Error("Protokol dihentikan: Server merespon dengan halaman (HTML), bukan data. Silakan cek status login Anda.");
      }

      if (!res.ok) {
        // Hanya parsing JSON jika kontennya benar-benar JSON
        if (contentType.includes("application/json")) {
          const errData = await res.json();
          throw new Error(errData.error || "Gagal memproses permintaan ekstraksi.");
        }
        throw new Error(`Server merespon dengan status: ${res.status}`);
      }

      // Prosedur Download File (Blob)
      const blob = await res.blob();
      
      if (blob.size < 50) { // Validasi file terlalu kecil
         throw new Error("Dataset kosong atau tidak valid untuk parameter ini.");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      
      const extension = format === 'csv' ? 'csv' : 'xlsx';
      const fileName = `SI_ELIGIBLE_${selectedJalur}_${format.toUpperCase()}_${Date.now()}.${extension}`;
      
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup & Sync History
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setExportHistory(prev => [fileName, ...prev].slice(0, 3));

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn("Operation aborted by system.");
        return; 
      }
      console.error('Extraction Protocol Failure:', error);
      alert(error.message || "Terjadi anomali transmisi pada jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-8 lg:p-10 font-sans text-slate-900 relative overflow-x-hidden selection:bg-purple-600 selection:text-white">
      
      {/* 4. KINETIC AMBIENT ENGINE */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-[-5%] right-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-purple-400/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto">
        
        {/* --- HEADER: ALPHA COMMAND --- */}
        <header className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-4 mb-5">
              <div className="p-4 bg-purple-600 rounded-2xl text-white shadow-2xl shadow-purple-500/20 transform hover:rotate-12 transition-all">
                <ArrowRightLeft size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-600 leading-none mb-1">Infrastructure v3.7</span>
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-2 uppercase">
                  <Code2 size={12} /> Secure Extraction Link Active
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-950 leading-none uppercase italic">
              Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 underline decoration-4">Exporter.</span>
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="px-6 py-2 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-100 flex items-center gap-3">
                <ShieldCheck size={16} /> Registry TA {academicYear}
              </div>
              <div className="px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                <Database size={16} className="text-purple-400" /> High-Density Query Mode
              </div>
            </div>
          </motion.div>

          <Button 
            onClick={() => window.print()}
            className="h-16 px-10 bg-white border-2 border-slate-100 text-slate-800 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-[0_10px_0_0_#e2e8f0] active:shadow-none active:translate-y-2 transition-all flex items-center gap-3 group"
          >
            <FileText size={18} className="text-purple-600 group-hover:rotate-12 transition-transform" /> Print Extract
          </Button>
        </header>

        {/* --- SECTION: TARGET NODE --- */}
        <section className="mb-12">
           <div className="flex items-center gap-3 mb-8">
              <Layers size={18} className="text-purple-600" />
              <h2 className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">Filter Target Node</h2>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['SNBP', 'SNBT', 'SPAN-PTKIN', 'UM-PTKIN'].map((jalur) => (
                <motion.button
                  key={jalur}
                  whileHover={{ y: -5, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedJalur(jalur)}
                  className={`p-8 rounded-[2.5rem] border-4 transition-all flex flex-col items-center gap-4 relative overflow-hidden group ${
                    selectedJalur === jalur
                      ? 'border-purple-600 bg-white shadow-2xl'
                      : 'border-white bg-white/60 text-slate-400 hover:bg-white hover:shadow-xl'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    selectedJalur === jalur ? 'bg-purple-600 text-white rotate-12 shadow-lg' : 'bg-slate-100 text-slate-300'
                  }`}>
                    <Zap size={22} fill={selectedJalur === jalur ? "currentColor" : "none"} />
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest ${selectedJalur === jalur ? 'text-slate-950' : 'text-slate-400'}`}>
                    {jalur}
                  </span>
                  {selectedJalur === jalur && (
                    <motion.div layoutId="activeMark" className="absolute top-4 right-4 text-purple-600">
                      <CheckCircle2 size={16} />
                    </motion.div>
                  )}
                </motion.button>
              ))}
           </div>
        </section>

        {/* --- SECTION: PROTOCOLS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          
          <div className="lg:col-span-8 space-y-8">
             <div className="flex items-center gap-3">
                <FileSpreadsheet size={18} className="text-blue-600" />
                <h2 className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">Metode Ekstraksi</h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ExportOption 
                  title="Format PDSS SNPMB"
                  desc="Sync file khusus upload ke portal PDSS Kemendikbud."
                  icon={<BarChart4 size={28} />}
                  color="blue"
                  disabled={selectedJalur !== 'SNBP' && selectedJalur !== 'SNBT'}
                  loading={loading}
                  onExport={() => handleExport('pdss_snpmb')}
                />
                
                <ExportOption 
                  title="Format SPAN-PTKIN"
                  desc="Sync file khusus portal pendaftaran UIN/IAIN/STAIN."
                  icon={<School size={28} />}
                  color="emerald"
                  disabled={selectedJalur !== 'SPAN-PTKIN' && selectedJalur !== 'UM-PTKIN'}
                  loading={loading}
                  onExport={() => handleExport('span_ptkin')}
                />

                <ExportOption 
                  title="Internal Reporting"
                  desc="Analisis lengkap berisi ranking dan detail nilai siswa."
                  icon={<FileSpreadsheet size={28} />}
                  color="purple"
                  loading={loading}
                  onExport={() => handleExport('internal')}
                />

                <ExportOption 
                  title="Raw Database CSV"
                  desc="Ekstraksi data mentah untuk pengolahan eksternal."
                  icon={<FileJson size={28} />}
                  color="slate"
                  loading={loading}
                  onExport={() => handleExport('csv')}
                />
             </div>
          </div>

          {/* SIDEBAR: INFO & LOGS */}
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-slate-950 rounded-[3.5rem] p-10 text-white relative overflow-hidden group border-b-[12px] border-purple-600 shadow-2xl">
                <div className="flex items-center gap-4 mb-8 relative z-10">
                   <Info size={24} className="text-purple-400" />
                   <h3 className="text-xl font-black tracking-tighter uppercase italic">Safety Manual</h3>
                </div>
                <div className="space-y-4 relative z-10 opacity-70">
                  <div className="flex gap-3 items-start italic">
                    <CheckCircle2 size={16} className="text-emerald-400 mt-1 shrink-0" />
                    <p className="text-xs font-bold leading-relaxed">Filter node otomatis mengunci template yang tidak kompatibel.</p>
                  </div>
                  <div className="flex gap-3 items-start italic">
                    <CheckCircle2 size={16} className="text-emerald-400 mt-1 shrink-0" />
                    <p className="text-xs font-bold leading-relaxed">Ekstraksi menggunakan stream blob untuk integritas data.</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-[50%] h-full bg-purple-600/10 blur-[80px] pointer-events-none" />
             </div>

             <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl group">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8 text-center">Session Log</h3>
                <div className="space-y-4">
                  {exportHistory.length === 0 ? (
                    <div className="py-6 text-center opacity-30 italic font-bold text-xs uppercase tracking-widest leading-loose">Waiting for neural <br /> data extraction...</div>
                  ) : (
                    exportHistory.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-[#F8FAFC] rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-right-4 duration-500">
                        <Activity size={14} className="text-purple-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-500 truncate uppercase tracking-tighter italic">{item}</span>
                      </div>
                    ))
                  )}
                </div>
             </div>
          </div>
        </div>

        {/* --- GLOBAL FOOTER --- */}
        <footer className="mt-32 py-20 border-t-4 border-slate-900/5 flex flex-col md:flex-row items-center justify-between opacity-30 text-center md:text-left gap-10">
          <div className="space-y-2">
            <p className="text-[14px] font-black uppercase tracking-[0.8em] text-slate-950 leading-none">SMKN 1 KADEMANGAN</p>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.4em] uppercase italic leading-none">Extraction Core Engine v3.7 Final</p>
          </div>
          <div className="flex gap-16">
             <div className="flex flex-col items-center gap-3"><Cpu size={24} className="text-purple-600"/> <span className="text-[10px] font-black uppercase tracking-widest text-purple-900">Neural-Core</span></div>
             <div className="flex flex-col items-center gap-3"><ShieldCheck size={24} className="text-blue-600"/> <span className="text-[10px] font-black uppercase tracking-widest text-blue-900">Titan-Shield</span></div>
          </div>
        </footer>
      </main>

      {/* FLOAT SYNC WIDGET */}
      <div className="fixed bottom-12 right-12 z-50 hidden lg:block">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}
            className="bg-white/90 backdrop-blur-3xl border-4 border-white p-6 rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.15)] flex items-center gap-8 group cursor-pointer"
        >
            <div className="w-14 h-14 bg-purple-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-2xl animate-bounce">
                <Share2 size={24} />
            </div>
            <div className="pr-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1 italic">Protocol Integrity</p>
                <p className="text-sm font-black text-slate-950 uppercase italic tracking-tighter leading-none">Safe-Bridge Online</p>
            </div>
        </motion.div>
      </div>

    </div>
  );
}

// --- SUB-COMPONENT ---

function ExportOption({ title, desc, icon, color, disabled, loading, onExport }: any) {
  const colorMap: any = {
    blue: "bg-blue-600 shadow-blue-500/30",
    emerald: "bg-emerald-500 shadow-emerald-500/30",
    purple: "bg-purple-600 shadow-purple-500/30",
    slate: "bg-slate-700 shadow-slate-500/30",
  };

  return (
    <motion.div 
      whileHover={!disabled ? { y: -8 } : {}}
      className={`bg-white rounded-[3.5rem] p-10 border-4 transition-all flex flex-col justify-between h-full relative overflow-hidden group ${
        disabled ? 'opacity-30 grayscale cursor-not-allowed border-slate-100' : 'border-white shadow-xl hover:shadow-2xl hover:border-purple-100'
      }`}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-10">
           <div className={`w-16 h-16 ${colorMap[color]} text-white rounded-3xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-500`}>
              {icon}
           </div>
           {disabled && <div className="p-3 bg-slate-50 text-slate-300 rounded-2xl"><Zap size={20} /></div>}
        </div>
        <h3 className={`text-2xl font-black tracking-tighter uppercase italic leading-none mb-4 ${disabled ? 'text-slate-300' : 'text-slate-950 group-hover:text-purple-600'}`}>
          {title}
        </h3>
        <p className="text-[11px] font-bold text-slate-400 leading-relaxed mb-12 italic">{desc}</p>
      </div>
      <div className="relative z-10">
        <motion.button
          onClick={onExport}
          disabled={disabled || loading}
          whileTap={{ scale: 0.95 }}
          className={`w-full h-20 rounded-[2.25rem] font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 ${
            disabled 
              ? 'bg-slate-50 text-slate-200 border-2 border-dashed border-slate-100' 
              : `bg-slate-950 text-white shadow-[0_12px_0_0_#000000] active:shadow-none active:translate-y-2`
          }`}
        >
          {loading ? <RefreshCcw className="animate-spin" size={20} /> : <>RUN PROTOCOL <Download size={20} /></>}
        </motion.button>
      </div>
      <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:scale-150 transition-all duration-1000 pointer-events-none group-hover:text-purple-600">
        {icon}
      </div>
    </motion.div>
  );
}