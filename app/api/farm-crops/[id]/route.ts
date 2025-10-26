import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/database/prisma';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const farmCrop = await prisma.farmCrop.findUnique({
      where: { id },
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

    if (!farmCrop) {
      return NextResponse.json(
        {
          success: false,
          error: 'Associação não encontrada',
          message: 'Nenhuma associação encontrada com este ID',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: farmCrop,
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

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await prisma.farmCrop.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Associação deletada com sucesso',
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
