import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// Interface untuk template mapping
interface TemplateMapping {
  kolomSistem: string;
  kolomEkspor: string;
  tipeData: string;
  wajib: boolean;
  defaultValue?: string;
}

interface TemplateConfig {
  id?: string;
  nama: string;
  tipe: string; // 'PDSS', 'SPAN-PTKIN', 'Custom'
  mapping: TemplateMapping[];
  isActive: boolean;
}

// GET: Ambil semua template
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'guru_bk')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Sementara return static templates sampai schema DB ditambahkan
    const templates: TemplateConfig[] = [
      {
        id: 'pdss-2026',
        nama: 'PDSS SNPMB 2026',
        tipe: 'PDSS',
        isActive: true,
        mapping: [
          { kolomSistem: 'nisn', kolomEkspor: 'NISN', tipeData: 'string', wajib: true },
          { kolomSistem: 'nama', kolomEkspor: 'NAMA_SISWA', tipeData: 'string', wajib: true },
          { kolomSistem: 'kelas', kolomEkspor: 'KELAS', tipeData: 'string', wajib: true },
          { kolomSistem: 'jurusan', kolomEkspor: 'JURUSAN', tipeData: 'string', wajib: true },
          { kolomSistem: 'rataRata', kolomEkspor: 'RATA_RATA', tipeData: 'number', wajib: true },
          { kolomSistem: 'ranking', kolomEkspor: 'RANKING', tipeData: 'number', wajib: false },
        ]
      },
      {
        id: 'span-ptkin-2026',
        nama: 'SPAN-PTKIN 2026',
        tipe: 'SPAN-PTKIN',
        isActive: true,
        mapping: [
          { kolomSistem: 'nisn', kolomEkspor: 'NISN', tipeData: 'string', wajib: true },
          { kolomSistem: 'nama', kolomEkspor: 'NAMA_LENGKAP', tipeData: 'string', wajib: true },
          { kolomSistem: 'kelas', kolomEkspor: 'KELAS', tipeData: 'string', wajib: true },
          { kolomSistem: 'jurusan', kolomEkspor: 'PROGRAM_STUDI', tipeData: 'string', wajib: true },
          { kolomSistem: 'rataRata', kolomEkspor: 'NILAI_RAPOR', tipeData: 'number', wajib: true },
          { kolomSistem: 'statusKIPK', kolomEkspor: 'KIP_KULIAH', tipeData: 'boolean', wajib: false },
        ]
      }
    ];

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Simpan/update template
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: TemplateConfig = await request.json();
    
    // Validasi
    if (!body.nama || !body.tipe || !body.mapping || body.mapping.length === 0) {
      return NextResponse.json(
        { error: 'Data template tidak lengkap' },
        { status: 400 }
      );
    }

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.userId,
        userType: session.user.role,
        action: 'update_template_export',
        description: `Update template: ${body.nama}`
      }
    });

    // Return template yang disimpan (sementara hanya return back)
    return NextResponse.json({
      ...body,
      id: body.id || `template-${Date.now()}`,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Hapus template
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
    }

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.userId,
        userType: session.user.role,
        action: 'delete_template_export',
        description: `Hapus template ID: ${id}`
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
