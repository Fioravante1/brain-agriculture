import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/shared/lib/database/prisma';

const cropUpdateSchema = z.object({
  name: z.string().min(1, 'Nome da cultura é obrigatório').max(100, 'Nome muito longo'),
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const crop = await prisma.crop.findUnique({
      where: { id },
    });

    if (!crop) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cultura não encontrada',
          message: 'Nenhuma cultura encontrada com este ID',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: crop,
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
    const validatedData = cropUpdateSchema.parse(body);

    const crop = await prisma.crop.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      data: crop,
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

    await prisma.crop.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Cultura deletada com sucesso',
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
