"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  BarChart3, 
  ShieldCheck, 
  GraduationCap, 
  LockKeyhole, 
  Sparkles,
  Zap,
  Award,
  TrendingUp,
  ChevronDown,
  Globe,
  Star,
  CheckCircle2,
  MousePointer2
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// --- MAIN COMPONENT ---
export default function HomePage() {
  const [stats, setStats] = useState({
    totalSiswa: 0,
    totalNilaiVerified: 0,
    totalSanggahanPending: 0,
    totalKelulusan: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentYear] = useState(new Date().getFullYear());
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Sinkronisasi data real-time
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Gagal sinkronisasi statistik:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-slate-900 selection:bg-blue-500 selection:text-white">
      
      {/* 1. BACKGROUND ENGINE (Vibrant 3D Space) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[100%] h-[80%] bg-gradient-to-br from-cyan-300/20 to-blue-600/10 rounded-full blur-[160px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            y: [0, -100, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-5%] w-[70%] h-[70%] bg-gradient-to-tl from-purple-500/20 to-pink-400/10 rounded-full blur-[140px]" 
        />
      </div>

      {/* 2. FLOATING NAVIGATION BAR */}
      <nav className="sticky top-6 z-[100] max-w-6xl mx-auto px-4">
        <motion.div 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[2.5rem] px-8 py-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3 group cursor-pointer">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.8 }}
              className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-[0_8px_20px_rgba(37,99,235,0.3)]"
            >
              SE
            </motion.div>
            <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-900">
              Si-Eligible
            </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 font-bold text-slate-500">
            <a href="#features" className="hover:text-blue-600 transition-colors">Fitur</a>
            <a href="#stats" className="hover:text-blue-600 transition-colors">Statistik</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">Bantuan</a>
          </div>

          <Link href="/login">
            <Button className="px-7 py-6 bg-slate-900 text-white rounded-2xl flex items-center gap-2 hover:bg-blue-600 hover:shadow-[0_10px_25px_rgba(79,70,229,0.3)] transition-all active:scale-95 text-md font-bold">
              <LockKeyhole size={18} />
              Portal Sistem
            </Button>
          </Link>
        </motion.div>
      </nav>

      {/* 3. HERO SECTION */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 overflow-hidden">
        <section ref={targetRef} className="pt-24 pb-32 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 px-6 py-2 rounded-full bg-blue-600/10 border border-blue-200 text-blue-700 text-xs md:text-sm font-black uppercase tracking-widest flex items-center gap-2 shadow-sm"
          >
            <Sparkles size={16} className="text-orange-500 animate-pulse" /> 
            Smart Ranking SNBP {currentYear}
          </motion.div>

          <motion.div style={{ opacity, scale }} className="relative">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-[9.5rem] font-black tracking-tighter leading-[0.8] mb-12"
            >
              UKUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">PRESTASIMU.</span>
            </motion.h1>
            
            {/* Floating Icons for Hero */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-10 -left-10 hidden md:block"
            >
              <div className="p-4 bg-white shadow-xl rounded-2xl rotate-12"><TrendingUp className="text-blue-500" /></div>
            </motion.div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl text-xl md:text-2xl text-slate-500 font-bold mb-16 leading-relaxed"
          >
            Platform analisis data cerdas untuk perangkingan otomatis dan verifikasi mandiri 
            demi masa depan cerah siswa <span className="text-blue-600 font-black underline decoration-blue-200 underline-offset-8">SMKN 1 Kademangan</span>.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-8 items-center"
          >
            <Link href="/login">
              <Button className="h-24 px-16 text-3xl font-black rounded-[2.5rem] bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_15px_0_0_#312e81] active:shadow-none active:translate-y-4 transition-all flex gap-4 group">
                MULAI ANALISIS <ArrowRight size={36} className="group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-14 h-14 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-lg">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" />
                </div>
              ))}
              <div className="w-14 h-14 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                +1k
              </div>
            </div>
          </motion.div>
        </section>

        {/* 4. LIVE DATABASE STATS SECTION */}
        <section id="stats" className="py-20 relative">
          <div className="absolute inset-0 bg-blue-50/50 -skew-y-3 rounded-[5rem] -z-10" />
          
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight text-slate-900">Statistik Real-Time</h2>
            <p className="font-bold text-slate-400">Data terupdate langsung dari database pusat</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            <StatCard label="Total Siswa" value={stats.totalSiswa} icon={<TrendingUp size={30} />} color="from-blue-500 to-cyan-400" />
            <StatCard label="Terverifikasi" value={stats.totalNilaiVerified} icon={<ShieldCheck size={30} />} color="from-emerald-500 to-teal-400" />
            <StatCard label="Sanggahan" value={stats.totalSanggahanPending} icon={<Zap size={30} />} color="from-orange-500 to-amber-400" />
            <StatCard label="Lolos PTN" value={stats.totalKelulusan} icon={<Award size={30} />} color="from-purple-600 to-pink-500" />
          </motion.div>
        </section>

        {/* 5. INNOVATIVE BENTO GRID FEATURES */}
        <section id="features" className="py-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="text-left">
              <h2 className="text-5xl font-black tracking-tighter text-slate-900">TEKNOLOGI <br /> UNGGULAN</h2>
              <p className="text-lg font-bold text-slate-400 mt-4">Dirancang untuk transparansi dan akurasi total.</p>
            </div>
            <Link href="/about">
              <Button variant="outline" className="rounded-2xl border-2 h-14 font-bold hover:bg-slate-50">Lihat Semua Fitur</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Large Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="md:col-span-8 p-12 rounded-[4rem] bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-2xl relative overflow-hidden group cursor-pointer"
            >
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <BarChart3 size={70} className="mb-8 text-blue-200 group-hover:scale-110 transition-transform" />
                  <h3 className="text-6xl font-black mb-6 italic tracking-tighter">Real-Time <br /> Ranking</h3>
                </div>
                <p className="text-xl font-bold opacity-80 max-w-md">Algoritma perangkingan otomatis yang mematuhi regulasi SNPMB terbaru, memberikan hasil instan tanpa manipulasi.</p>
              </div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
            </motion.div>
            
            {/* Small Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="md:col-span-4 p-12 rounded-[4rem] bg-white border border-slate-100 shadow-xl flex flex-col justify-between group cursor-pointer"
            >
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform">
                <ShieldCheck size={45} />
              </div>
              <div>
                <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Data <br /> Aman</h3>
                <p className="text-slate-500 font-bold leading-tight">Enkripsi SHA-256 melindungi data nilai rapor Anda agar tetap privat dan valid.</p>
              </div>
            </motion.div>

            {/* Middle Cards */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="md:col-span-5 p-12 rounded-[4rem] bg-slate-900 text-white shadow-xl flex flex-col justify-between group cursor-pointer overflow-hidden relative"
            >
              <Zap size={60} className="text-yellow-400 mb-10 group-hover:scale-125 transition-transform" />
              <h3 className="text-4xl font-black tracking-tight mb-4 leading-none">Verifikasi <br /> Instan</h3>
              <p className="text-slate-400 font-bold">Lakukan sanggahan dan verifikasi nilai hanya dalam hitungan detik.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="md:col-span-7 p-12 rounded-[4rem] bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-xl group cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <GraduationCap size={80} className="opacity-40" />
                <div className="text-right">
                  <Star className="text-white fill-white inline-block mr-2" />
                  <span className="font-black text-2xl tracking-widest">BEST UI</span>
                </div>
              </div>
              <div className="mt-10">
                <h3 className="text-5xl font-black tracking-tighter mb-4 italic leading-none">Monitoring Alumni</h3>
                <p className="text-xl font-bold opacity-80">Pantau sebaran alumni di berbagai PTN favorit secara komprehensif untuk referensi Anda.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 6. SUCCESS BANNER */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="my-32 p-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[3rem] shadow-2xl"
        >
          <div className="bg-white rounded-[2.9rem] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12 text-left">
            <div className="flex-1">
              <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-6">Siap Menjadi <br /> Bagian dari Kami?</h2>
              <p className="text-xl font-bold text-slate-400 mb-8 max-w-lg">Bergabunglah dengan ribuan siswa yang telah berhasil memantau kelayakan mereka secara transparan.</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2"><CheckCircle2 className="text-blue-600" /> <span className="font-bold">Gratis</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="text-blue-600" /> <span className="font-bold">Akurat</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="text-blue-600" /> <span className="font-bold">Resmi</span></div>
              </div>
            </div>
            <div className="flex-shrink-0">
               <Link href="/login">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-24 px-16 bg-blue-600 text-white rounded-[2.5rem] text-2xl font-black shadow-2xl shadow-blue-500/40"
                  >
                    Daftar Sekarang
                  </motion.button>
               </Link>
            </div>
          </div>
        </motion.section>
      </main>

      {/* 7. DYNAMIC MODERN FOOTER */}
      <footer className="py-24 border-t border-slate-100 bg-white/50 backdrop-blur-md relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20 text-left">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">SE</div>
                <span className="text-2xl font-black tracking-tighter">Si-Eligible</span>
              </div>
              <p className="text-slate-500 font-bold leading-relaxed">Solusi cerdas perangkingan siswa untuk kelancaran seleksi nasional perguruan tinggi negeri.</p>
            </div>
            <div>
              <h4 className="text-xl font-black mb-8 uppercase tracking-widest text-slate-400">Navigasi</h4>
              <ul className="space-y-4 font-bold text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Tentang Sistem</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Pusat Bantuan</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-black mb-8 uppercase tracking-widest text-slate-400">Kontak Kami</h4>
              <p className="text-slate-500 font-bold mb-4 italic">Jl. Raya Kademangan No. 01, Blitar, Jawa Timur</p>
              <p className="text-slate-900 font-black text-xl">bk@smkn1kademangan.sch.id</p>
            </div>
          </div>
          
          <div className="text-center pt-10 border-t border-slate-100">
            <p className="text-xl font-black text-slate-400 flex flex-col md:flex-row justify-center items-center gap-2">
              <span>&copy; {currentYear} SMKN 1 KADEMANGAN</span>
              <span className="hidden md:inline">|</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 uppercase tracking-tighter">
                PROFESSIONAL ANALYTICS v2.0
              </span>
            </p>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-8 inline-block"
            >
              <MousePointer2 className="text-slate-300" />
            </motion.div>
          </div>
        </div>
      </footer>

      {/* --- FLOATING SPARKLE ANIMATION --- */}
      <AnimatePresence>
        <motion.div 
          className="fixed bottom-10 right-10 z-[1000]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl cursor-pointer hover:rotate-12 active:scale-90 transition-all">
            <Sparkles size={32} />
          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ label, value, icon, color }: any) {
  return (
    <motion.div 
      variants={fadeInUp}
      whileHover={{ y: -15, scale: 1.02 }}
      className="p-10 rounded-[3.5rem] bg-white border border-slate-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06)] flex flex-col items-center gap-6 group overflow-hidden relative border-b-8 border-transparent hover:border-blue-500 transition-all duration-500"
    >
      <div className={`p-6 rounded-[2.5rem] bg-gradient-to-br ${color} text-white shadow-2xl group-hover:rotate-[15deg] transition-transform duration-500`}>
        {icon}
      </div>
      <div className="text-center">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-7xl font-black text-slate-900 tracking-tighter mb-2"
        >
          {value}
        </motion.div>
        <div className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">{label}</div>
      </div>
      {/* Dynamic Background Blur on Hover */}
      <div className={`absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity`} />
    </motion.div>
  );
}