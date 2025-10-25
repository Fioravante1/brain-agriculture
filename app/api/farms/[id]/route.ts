import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/shared/lib/database/prisma';

// Schema de validação para edição de fazenda
const farmUpdateSchema = z
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

// GET /api/farms/[id] - Busca fazenda por ID
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const farm = await prisma.farm.findUnique({
      where: { id },
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

    if (!farm) {
      return NextResponse.json(
        {
          success: false,
          error: 'Fazenda não encontrada',
          message: 'Nenhuma fazenda encontrada com este ID',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: farm,
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

// PUT /api/farms/[id] - Atualiza fazenda
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Valida dados de entrada
    const validatedData = farmUpdateSchema.parse(body);

    // Busca fazenda
    const existingFarm = await prisma.farm.findUnique({
      where: { id },
    });

    if (!existingFarm) {
      return NextResponse.json(
        {
          success: false,
          error: 'Fazenda não encontrada',
          message: 'Nenhuma fazenda encontrada com este ID',
        },
        { status: 404 },
      );
    }

    // Atualiza fazenda
    const updatedFarm = await prisma.farm.update({
      where: { id },
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

    return NextResponse.json({
      success: true,
      data: updatedFarm,
      message: 'Fazenda atualizada com sucesso',
    });
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

// DELETE /api/farms/[id] - Deleta fazenda
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Verifica se a fazenda existe
    const existingFarm = await prisma.farm.findUnique({
      where: { id },
    });

    if (!existingFarm) {
      return NextResponse.json(
        {
          success: false,
          error: 'Fazenda não encontrada',
          message: 'Nenhuma fazenda encontrada com este ID',
        },
        { status: 404 },
      );
    }

    // Remove fazenda
    await prisma.farm.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Fazenda deletada com sucesso',
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
