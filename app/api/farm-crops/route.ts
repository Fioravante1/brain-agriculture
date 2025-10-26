import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/shared/lib/database/prisma';

// Schema de validação para criação
const farmCropSchema = z.object({
  farmId: z.string().min(1, 'ID da fazenda é obrigatório'),
  cropId: z.string().min(1, 'ID da cultura é obrigatório'),
  harvestId: z.string().min(1, 'ID da safra é obrigatório'),
});

// GET /api/farm-crops - Lista todas as associações
export async function GET() {
  try {
    const farmCrops = await prisma.farmCrop.findMany({
      include: {
        farm: {
          include: {
            producer: true,
          },
        },
        crop: true,
        harvest: true,
      },
      orderBy: [
        {
          farm: {
            name: 'asc',
          },
        },
        {
          crop: {
            name: 'asc',
          },
        },
        {
          harvest: {
            year: 'desc',
          },
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: farmCrops,
      count: farmCrops.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 },
    );
  }
}

// POST /api/farm-crops - Cria nova associação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = farmCropSchema.parse(body);

    // Verifica se a associação já existe
    const existingAssociation = await prisma.farmCrop.findFirst({
      where: {
        farmId: validatedData.farmId,
        cropId: validatedData.cropId,
        harvestId: validatedData.harvestId,
      },
    });

    if (existingAssociation) {
      return NextResponse.json(
        {
          success: false,
          error: 'Associação já existe',
          message: 'Esta combinação de fazenda, cultura e safra já está cadastrada',
        },
        { status: 409 },
      );
    }

    const farmCrop = await prisma.farmCrop.create({
      data: validatedData,
      include: {
        farm: {
          include: {
            producer: true,
          },
        },
        crop: true,
        harvest: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: farmCrop,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados inválidos',
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 },
    );
  }
}
