import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/shared/lib/database/prisma';

// Schema de validação para criação/edição de fazenda
const farmSchema = z
  .object({
    producerId: z.string().min(1, 'ID do produtor é obrigatório'),
    name: z.string().min(1, 'Nome da fazenda é obrigatório'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    state: z.string().min(2, 'Estado é obrigatório'),
    totalArea: z.number().positive('Área total deve ser positiva'),
    arableArea: z.number().min(0, 'Área agricultável não pode ser negativa'),
    vegetationArea: z.number().min(0, 'Área de vegetação não pode ser negativa'),
  })
  .refine(data => data.arableArea + data.vegetationArea <= data.totalArea, {
    message: 'A soma das áreas agricultável e vegetação não pode exceder a área total',
    path: ['totalArea'],
  });

// GET /api/farms - Lista todas as fazendas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const producerId = searchParams.get('producerId');

    let farms;

    if (producerId) {
      // Busca fazendas de um produtor específico
      farms = await prisma.farm.findMany({
        where: { producerId },
        include: {
          producer: true,
          farmCrops: {
            include: {
              crop: true,
              harvest: true,
            },
          },
        },
      });
    } else {
      // Busca todas as fazendas
      farms = await prisma.farm.findMany({
        include: {
          producer: true,
          farmCrops: {
            include: {
              crop: true,
              harvest: true,
            },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: farms,
      count: farms.length,
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

// POST /api/farms - Cria nova fazenda
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Valida dados de entrada
    const validatedData = farmSchema.parse(body);

    // Verifica se o produtor existe
    const producer = await prisma.producer.findUnique({
      where: { id: validatedData.producerId },
    });

    if (!producer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Produtor não encontrado',
          message: 'O produtor especificado não existe',
        },
        { status: 404 },
      );
    }

    // Cria nova fazenda
    const newFarm = await prisma.farm.create({
      data: {
        producerId: validatedData.producerId,
        name: validatedData.name,
        city: validatedData.city,
        state: validatedData.state,
        totalArea: validatedData.totalArea,
        arableArea: validatedData.arableArea,
        vegetationArea: validatedData.vegetationArea,
      },
      include: {
        producer: true,
        farmCrops: {
          include: {
            crop: true,
            harvest: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newFarm,
        message: 'Fazenda criada com sucesso',
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados inválidos',
          message: 'Verifique os dados enviados',
          details: error.issues,
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
