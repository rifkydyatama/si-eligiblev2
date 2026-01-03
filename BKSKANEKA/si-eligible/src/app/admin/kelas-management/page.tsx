'use client';

/**
 * ============================================================
 * KELAS MANAGEMENT SYSTEM - Admin Control Panel
 * ============================================================
 * Features:
 * 1. Auto-promote students (X→XI, XI→XII)
 * 2. Cleanup alumni data (remove XII graduates)
 * 3. Real-time statistics & logs
 * ============================================================
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpCircle,
  Trash2,
  AlertCircle,
  Users,
  TrendingUp,
  Database,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  GraduationCap,
  RefreshCw
} from 'lucide-react';

export default function KelasManagementPage() {
  const [loading, setLoading] = useState(false);
  const [promoteResult, setPromoteResult] = useState<any>(null);
  const [cleanupResult, setCleanupResult] = useState<any>(null);
  const [tahunAjaranLama, setTahunAjaranLama] = useState('');
  const [showPromoteConfirm, setShowPromoteConfirm] = useState(false);
  const [showCleanupConfirm, setShowCleanupConfirm] = useState(false);

  // Auto-generate tahun ajaran lama (tahun lalu)
  const generateTahunAjaranLama = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    if (month >= 7) {
      // Jika bulan >= Juli, tahun ajaran lama adalah tahun kemarin
      return `${year - 1}/${year}`;
    } else {
      // Jika bulan < Juli, tahun ajaran lama adalah 2 tahun lalu
      return `${year - 2}/${year - 1}`;
    }
  };

  const handlePromoteKelas = async () => {
    try {
      setLoading(true);
      setPromoteResult(null);
      
      const res = await fetch('/api/admin/kelas-management/promote', {
        method: 'POST'
      });

      const data = await res.json();

      if (res.ok) {
        setPromoteResult(data);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error promoting students:', error);
      alert('Gagal memproses kenaikan kelas');
    } finally {
      setLoading(false);
      setShowPromoteConfirm(false);
    }
  };

  const handleCleanupAlumni = async () => {
    if (!tahunAjaranLama) {
      alert('Tahun ajaran lama harus diisi!');
      return;
    }

    try {
      setLoading(true);
      setCleanupResult(null);

      const res = await fetch('/api/admin/kelas-management/cleanup-alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tahunAjaranLama })
      });

      const data = await res.json();

      if (res.ok) {
        setCleanupResult(data);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error cleaning up alumni:', error);
      alert('Gagal membersihkan data alumni');
    } finally {
      setLoading(false);
      setShowCleanupConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl text-white shadow-xl">
              <GraduationCap size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tight">
                Manajemen Kelas
              </h1>
              <p className="text-slate-500 font-semibold mt-1">
                Sistem Otomatis Kenaikan Kelas & Pembersihan Data Alumni
              </p>
            </div>
          </div>
        </motion.div>

        {/* Alert Box - Important Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 bg-amber-50 border-l-4 border-amber-500 rounded-xl"
        >
          <div className="flex gap-4">
            <AlertCircle className="text-amber-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-black text-amber-900 mb-2">⚠️ PENTING - Baca Sebelum Menggunakan</h3>
              <ul className="text-sm text-amber-800 space-y-1 font-semibold">
                <li>• <strong>Login Restriction:</strong> Hanya siswa kelas XII yang bisa login ke sistem</li>
                <li>• <strong>Kenaikan Kelas:</strong> Otomatis menaikkan X→XI dan XI→XII untuk semua siswa</li>
                <li>• <strong>Cleanup Alumni:</strong> Menghapus PERMANEN semua data siswa kelas XII tahun lalu</li>
                <li>• <strong>Waktu Eksekusi:</strong> Lakukan di akhir tahun ajaran (Juni/Juli)</li>
                <li>• <strong>Backup:</strong> Pastikan backup database sebelum cleanup!</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Auto-Promote Kelas */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-xl">
                <ArrowUpCircle className="text-green-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Kenaikan Kelas</h2>
                <p className="text-slate-500 text-sm font-semibold">Otomatis naik tingkat</p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-green-50 rounded-xl">
              <h3 className="font-bold text-green-800 mb-3">Proses yang Akan Dilakukan:</h3>
              <div className="space-y-2 text-sm text-green-700 font-semibold">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} />
                  <span>Kelas X → Kelas XI</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} />
                  <span>Kelas XI → Kelas XII</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>Data nilai, peminatan tetap tersimpan</span>
                </div>
              </div>
            </div>

            {!showPromoteConfirm ? (
              <button
                onClick={() => setShowPromoteConfirm(true)}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-black uppercase tracking-wide hover:shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw size={20} />
                  Proses Kenaikan Kelas
                </span>
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-center font-bold text-red-600 bg-red-50 p-3 rounded-lg">
                  ⚠️ Yakin ingin menaikkan kelas semua siswa?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowPromoteConfirm(false)}
                    className="py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handlePromoteKelas}
                    disabled={loading}
                    className="py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Ya, Proses'}
                  </button>
                </div>
              </div>
            )}

            {/* Result Display */}
            {promoteResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl"
              >
                <h3 className="font-bold text-green-800 mb-3">✅ Hasil Kenaikan Kelas:</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-slate-500 font-semibold">Total Diproses</p>
                    <p className="text-2xl font-black text-slate-800">{promoteResult.stats.totalProcessed}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-slate-500 font-semibold">Berhasil Naik</p>
                    <p className="text-2xl font-black text-green-600">{promoteResult.stats.promoted}</p>
                  </div>
                </div>
                {promoteResult.stats.notMapped > 0 && (
                  <p className="mt-3 text-xs text-amber-700 bg-amber-50 p-2 rounded">
                    ⚠️ {promoteResult.stats.notMapped} siswa tidak dapat dipetakan (format kelas tidak standar)
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Card 2: Cleanup Alumni */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 rounded-xl">
                <Trash2 className="text-red-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Cleanup Alumni</h2>
                <p className="text-slate-500 text-sm font-semibold">Hapus data lulusan lama</p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-red-50 rounded-xl">
              <h3 className="font-bold text-red-800 mb-3">⚠️ Data yang Akan Dihapus:</h3>
              <div className="space-y-2 text-sm text-red-700 font-semibold">
                <div className="flex items-center gap-2">
                  <XCircle size={16} />
                  <span>Semua siswa kelas XII</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} />
                  <span>Nilai rapor siswa tersebut</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} />
                  <span>Peminatan & kelulusan</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} />
                  <span>Sanggahan nilai</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Tahun Ajaran Lama (yang akan dihapus)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tahunAjaranLama}
                  onChange={(e) => setTahunAjaranLama(e.target.value)}
                  placeholder="Contoh: 2023/2024"
                  className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl font-bold focus:border-red-500 focus:outline-none"
                />
                <button
                  onClick={() => setTahunAjaranLama(generateTahunAjaranLama())}
                  className="px-4 py-3 bg-slate-200 rounded-xl font-bold hover:bg-slate-300"
                  title="Generate otomatis tahun lalu"
                >
                  <Calendar size={20} />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                💡 Klik ikon kalender untuk auto-generate tahun ajaran lalu
              </p>
            </div>

            {!showCleanupConfirm ? (
              <button
                onClick={() => setShowCleanupConfirm(true)}
                disabled={loading || !tahunAjaranLama}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-black uppercase tracking-wide hover:shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <span className="flex items-center justify-center gap-2">
                  <Trash2 size={20} />
                  Hapus Data Alumni
                </span>
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-center font-bold text-red-600 bg-red-50 p-3 rounded-lg">
                  🚨 PERINGATAN: Data akan dihapus PERMANEN!
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowCleanupConfirm(false)}
                    className="py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleCleanupAlumni}
                    disabled={loading}
                    className="py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Ya, Hapus'}
                  </button>
                </div>
              </div>
            )}

            {/* Result Display */}
            {cleanupResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <h3 className="font-bold text-red-800 mb-3">✅ Hasil Cleanup:</h3>
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-slate-500 font-semibold">Siswa Dihapus</p>
                    <p className="text-2xl font-black text-red-600">{cleanupResult.deleted}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-slate-500 font-semibold">Nilai Dihapus</p>
                    <p className="text-2xl font-black text-slate-800">{cleanupResult.relatedDataDeleted?.nilaiRapor || 0}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600">
                  Peminatan: {cleanupResult.relatedDataDeleted?.peminatan || 0} | 
                  Kelulusan: {cleanupResult.relatedDataDeleted?.kelulusan || 0} | 
                  Sanggahan: {cleanupResult.relatedDataDeleted?.sanggahan || 0}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Workflow Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-3xl shadow-xl border border-slate-100 p-8"
        >
          <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
            <Database size={28} className="text-indigo-600" />
            Workflow Tahunan yang Disarankan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black mb-3">1</div>
              <h3 className="font-black text-slate-800 mb-2">Akhir Tahun Ajaran</h3>
              <p className="text-sm text-slate-600 font-semibold">Bulan Juni: Backup database, freeze data nilai siswa kelas XII</p>
            </div>

            <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-black mb-3">2</div>
              <h3 className="font-black text-slate-800 mb-2">Cleanup Alumni</h3>
              <p className="text-sm text-slate-600 font-semibold">Bulan Juli: Hapus data alumni (kelas XII tahun lalu)</p>
            </div>

            <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-black mb-3">3</div>
              <h3 className="font-black text-slate-800 mb-2">Kenaikan Kelas</h3>
              <p className="text-sm text-slate-600 font-semibold">Bulan Juli: Proses kenaikan kelas otomatis (X→XI, XI→XII)</p>
            </div>

            <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-100">
              <div className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center font-black mb-3">4</div>
              <h3 className="font-black text-slate-800 mb-2">Import Siswa Baru</h3>
              <p className="text-sm text-slate-600 font-semibold">Agustus: Import data siswa kelas X baru dari PPDB</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
