import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/shared/lib/database/prisma';

const harvestUpdateSchema = z.object({
  name: z.string().min(1, 'Nome da safra é obrigatório').max(100, 'Nome muito longo'),
  year: z.number().int().min(2000, 'Ano deve ser maior que 2000').max(2100, 'Ano deve ser menor que 2100'),
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const harvest = await prisma.harvest.findUnique({
      where: { id },
    });

    if (!harvest) {
      return NextResponse.json(
        {
          success: false,
          error: 'Safra não encontrada',
          message: 'Nenhuma safra encontrada com este ID',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: harvest,
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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = harvestUpdateSchema.parse(body);

    const harvest = await prisma.harvest.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      data: harvest,
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

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await prisma.harvest.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Safra deletada com sucesso',
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
