// Quick check untuk data siswa
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    const totalSiswa = await prisma.siswa.count();
    const totalNilai = await prisma.nilaiRapor.count();
    const totalKelulusan = await prisma.kelulusan.count();
    const totalPeminatan = await prisma.peminatan.count();
    
    console.log('='.repeat(60));
    console.log('📊 STATUS DATA SAAT INI:');
    console.log('='.repeat(60));
    console.log(`👥 Total Siswa      : ${totalSiswa}`);
    console.log(`📝 Total Nilai Rapor: ${totalNilai}`);
    console.log(`🎓 Total Kelulusan  : ${totalKelulusan}`);
    console.log(`🎯 Total Peminatan  : ${totalPeminatan}`);
    console.log('='.repeat(60));
    
    if (totalSiswa === 0) {
      console.log('⚠️  WARNING: Database kosong! Data mungkin terhapus saat migration reset.');
      console.log('💡 Solusi: Restore dari backup atau import ulang data siswa.');
    } else {
      console.log('✅ Data masih ada di database!');
      
      // Cek beberapa sample
      const samples = await prisma.siswa.findMany({
        take: 5,
        select: {
          nisn: true,
          nama: true,
          kelas: true
        }
      });
      
      console.log('\n📋 Sample 5 Data Siswa:');
      samples.forEach((s, i) => {
        console.log(`   ${i+1}. ${s.nisn} - ${s.nama} (${s.kelas})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
