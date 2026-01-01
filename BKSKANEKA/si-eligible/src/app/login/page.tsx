'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Lock, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Cpu, 
  Globe,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';

/**
 * LoginPage - Alpha-Gen Professional Edition
 * Design: Rifky Smart Innovation
 */
export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [role, setRole] = useState<'siswa' | 'admin'>('siswa');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [academicYear, setAcademicYear] = useState("");

const [currentYear] = useState(new Date().getFullYear()); 

  const [formData, setFormData] = useState({
    identifier: '', 
    password: '' 
  });

  // Logika Tahun Ajaran Otomatis (Smart Real-time)
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const displayYear = month >= 7 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
    setAcademicYear(displayYear);

    if (session?.user?.role) {
      router.push(session.user.role === 'siswa' ? '/siswa/dashboard' : '/admin/dashboard');
    }
  }, [session, router]);

  // LogikahandleSubmit TIDAK BERUBAH (Sesuai permintaan)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn(
        role === 'siswa' ? 'siswa-login' : 'admin-login',
        {
          redirect: false,
          callbackUrl: role === 'siswa' ? '/siswa/dashboard' : '/admin/dashboard',
          ...(role === 'siswa' 
            ? { nisn: formData.identifier, tanggalLahir: formData.password }
            : { username: formData.identifier, password: formData.password }
          )
        }
      );

      if (result?.error) {
        setError(result.error);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF] text-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* --- 1. LAYER DEKORASI 3D (BACKGROUND ENGINE) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Mesh Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-400/10 rounded-full blur-[120px] animate-pulse delay-700" />
        
        {/* Floating Icons (Alpha 3D Style) */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-[15%] left-[10%] opacity-20 hidden lg:block"
        >
          <Cpu size={120} className="text-blue-600" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-[20%] right-[10%] opacity-20 hidden lg:block"
        >
          <Globe size={100} className="text-indigo-600" />
        </motion.div>
      </div>

      {/* --- 2. TOMBOL KEMBALI (SMART FLOATING) --- */}
      <div className="absolute top-8 left-8 z-50">
        <Link href="/">
          <motion.div 
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/50 backdrop-blur-md border border-slate-200 rounded-2xl font-bold text-slate-600 shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeft size={18} />
            Kembali
          </motion.div>
        </Link>
      </div>

      {/* --- 3. CONTAINER UTAMA (THE 3D BOX) --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-xl z-10"
      >
        <div className="bg-white/70 backdrop-blur-3xl rounded-[3rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-10 md:p-14 relative overflow-hidden">
          
          {/* Header Section */}
          <div className="flex flex-col items-center mb-12">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1 }}
              className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[1.75rem] flex items-center justify-center text-white font-black text-3xl shadow-[0_12px_24px_rgba(37,99,235,0.3)] mb-6"
            >
              SE
            </motion.div>
            
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">
                Si-Eligible Portal
              </h1>
              <motion.div 
                initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest"
              >
                <Sparkles size={12} /> SNBP {academicYear}
              </motion.div>
            </div>
          </div>

          {/* Role Switcher (3D Alpha Style) */}
          <div className="grid grid-cols-2 gap-5 mb-10">
            <RoleCard 
              active={role === 'siswa'} 
              onClick={() => setRole('siswa')}
              icon="👨‍🎓"
              label="Siswa"
              desc="Verifikasi & Perangkingan"
            />
            <RoleCard 
              active={role === 'admin'} 
              onClick={() => setRole('admin')}
              icon="👨‍💼"
              label="Admin/BK"
              desc="Manajemen & Konfigurasi"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              {error && (
                <motion.div 
                  initial={{ height: 0 }} animate={{ height: 'auto' }}
                  className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3"
                >
                  <Zap size={18} /> {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Input Identifier */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                    {role === 'siswa' ? 'NISN (Nomor Induk)' : 'ID Administrator'}
                  </label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <User size={20} />
                    </div>
                    <input
                      type="text"
                      value={formData.identifier}
                      onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                      placeholder={role === 'siswa' ? 'Contoh: 0012345678' : 'Masukkan username...'}
                      className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                      required
                    />
                  </div>
                </div>

                {/* Input Password/DOB */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                    {role === 'siswa' ? 'Tanggal Lahir' : 'Kata Sandi Portal'}
                  </label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      {role === 'siswa' ? <Calendar size={20} /> : <Lock size={20} />}
                    </div>
                    <input
                      type={role === 'siswa' ? 'date' : (showPassword ? 'text' : 'password')}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full h-16 pl-14 pr-14 rounded-2xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700 uppercase"
                      required
                    />
                    {role === 'admin' && (
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Submit Button (Claymorphism 3D) */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-18 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-xl shadow-[0_10px_0_0_#1e40af] active:shadow-none active:translate-y-2 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Akses Masuk <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </AnimatePresence>

          {/* Footer Card */}
          <div className="mt-12 text-center space-y-4">
            <p className="text-slate-400 text-sm font-medium italic">
              &copy; {currentYear} SMKN 1 Kademangan <br />
              <span className="font-black text-blue-500/50 not-italic">v2.0 Professional Analytics</span>
            </p>
          </div>
        </div>

        {/* Demo Badge (Floating Bottom) */}
        <div className="mt-8 flex justify-center">
          <div className="px-6 py-3 bg-white/40 backdrop-blur-sm rounded-2xl border border-white border-white/20 shadow-sm flex items-center gap-4">
            <div className="p-2 bg-blue-500 rounded-lg text-white"><ShieldCheck size={16} /></div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Sistem Terverifikasi Mandiri
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Sub-komponen Role Card (3D Interaction)
 */
function RoleCard({ active, onClick, icon, label, desc }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative p-6 rounded-[2rem] border-2 text-left transition-all duration-300 group ${
        active 
          ? 'bg-white border-blue-500 shadow-[0_12px_24px_rgba(59,130,246,0.1)] translate-y-[-4px]' 
          : 'bg-slate-50/50 border-transparent text-slate-400 grayscale hover:grayscale-0 hover:bg-white hover:border-slate-200'
      }`}
    >
      <div className={`text-4xl mb-4 transition-transform duration-500 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <div>
        <div className={`font-black text-lg leading-none mb-1 ${active ? 'text-slate-900' : ''}`}>{label}</div>
        <div className="text-[10px] font-bold leading-tight opacity-70">{desc}</div>
      </div>
      {active && (
        <motion.div 
          layoutId="active-dot"
          className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,1)]" 
        />
      )}
    </button>
  );
}