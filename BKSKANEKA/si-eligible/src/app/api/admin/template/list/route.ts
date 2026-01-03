import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET: List semua template yang sudah diupload
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'PDSS' or 'PTKIN' or 'all'

    let templatesPDSS = [];
    let templatesPTKIN = [];

    if (!type || type === 'PDSS' || type === 'all') {
      templatesPDSS = await prisma.templateNilaiPDSS.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10
      });
    }

    if (!type || type === 'PTKIN' || type === 'all') {
      templatesPTKIN = await prisma.templateNilaiPTKIN.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10
      });
    }

    // Get mapping count
    const mappingCount = await prisma.mapelMapping.count({
      where: { isActive: true }
    });

    return NextResponse.json({
      success: true,
      data: {
        pdss: templatesPDSS.map(t => ({
          id: t.id,
          nama: t.namaTemplate,
          semester: t.semester,
          isActive: t.isActive,
          totalKolom: Array.isArray(t.strukturTemplate) ? t.strukturTemplate.length : 0,
          totalMapel: Array.isArray(t.mappingMapel) ? t.mappingMapel.length : 0,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt
        })),
        ptkin: templatesPTKIN.map(t => ({
          id: t.id,
          nama: t.namaTemplate,
          semester: t.semester,
          isActive: t.isActive,
          totalKolom: Array.isArray(t.strukturTemplate) ? t.strukturTemplate.length : 0,
          totalMapel: Array.isArray(t.mappingMapel) ? t.mappingMapel.length : 0,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt
        })),
        mappingCount,
        syncStatus: {
          pdss: templatesPDSS.some(t => t.isActive),
          ptkin: templatesPTKIN.some(t => t.isActive),
          lastSync: templatesPDSS[0]?.updatedAt || templatesPTKIN[0]?.updatedAt || null
        }
      }
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

// PUT: Activate/deactivate template
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, type, isActive } = body;

    if (type === 'PDSS') {
      await prisma.templateNilaiPDSS.update({
        where: { id },
        data: { isActive }
      });
    } else if (type === 'PTKIN') {
      await prisma.templateNilaiPTKIN.update({
        where: { id },
        data: { isActive }
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: session.user.userId,
        userType: session.user.role,
        action: 'toggle_template_status',
        description: `${isActive ? 'Activate' : 'Deactivate'} template ${type}: ${id}`,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        metadata: {
          templateId: id,
          type,
          isActive
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}
