import { NextRequest, NextResponse } from 'next/server';

/**
 * ==============================================================================
 * PDDIKTI NEURAL PROXY v4.9 - OFFICIAL KEMDIKBUD STABLE ENGINE
 * ==============================================================================
 * Solusi: Menghindari RTO dari API pihak ketiga dengan menembak langsung
 * ke infrastruktur utama Kemdikbud.
 * ==============================================================================
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query'); // Untuk cari list kampus
    const ptId = searchParams.get('ptId');   // Untuk cari list prodi (jurusan)

    // --- JALUR A: DISCOVERY KAMPUS (SEARCH) ---
    if (query && !ptId) {
      console.log(`[Neural Link] Scanning Database for: ${query}`);
      
      const response = await fetch(`https://api-frontend.kemdikbud.go.id/hit_mhs/${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store' // Biar data selalu segar
      });

      if (!response.ok) return NextResponse.json([]);

      const rawData = await response.json();
      
      // Ambil array 'pt' (Perguruan Tinggi)
      if (!rawData.pt || rawData.pt.length === 0) return NextResponse.json([]);

      const cleanColleges = rawData.pt.map((item: any) => ({
        id: item.id, 
        nama: item.nama.replace(/<\/?[^>]+(>|$)/g, ""), // Bersihkan tag <b>
        kode: item.npsn || 'N/A'
      }));

      return NextResponse.json(cleanColleges);
    }

    // --- JALUR B: EXTRACTION PRODI (JURUSAN) ---
    if (ptId) {
      console.log(`[Neural Link] Extracting Majors for PT: ${ptId}`);

      const response = await fetch(`https://api-frontend.kemdikbud.go.id/v2/detail_pt/${ptId}`, {
        cache: 'no-store'
      });

      if (!response.ok) return NextResponse.json([]);

      const rawDetail = await response.json();

      if (!rawDetail.prodi) return NextResponse.json([]);

      // Map data prodi resmi
      const cleanMajors = rawDetail.prodi.map((p: any) => ({
        nama: p.nama,
        jenjang: p.jenjang,
        akreditasi: p.akreditasi || 'N/A'
      }));

      return NextResponse.json(cleanMajors);
    }

    return NextResponse.json([]);

  } catch (error) {
    console.error('[CRITICAL] Neural Bridge Error:', error);
    // Return array kosong agar Frontend tidak meledak (crash)
    return NextResponse.json([]);
  }
}