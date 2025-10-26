import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/shared/lib/database/prisma';

const harvestSchema = z.object({
  name: z.string().min(1, 'Nome da safra é obrigatório').max(100, 'Nome muito longo'),
  year: z.number().int().min(2000, 'Ano deve ser maior que 2000').max(2100, 'Ano deve ser menor que 2100'),
});

export async function GET() {
  try {
    const harvests = await prisma.harvest.findMany({
      orderBy: [
        {
          year: 'desc',
        },
        {
          name: 'asc',
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: harvests,
      count: harvests.length,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = harvestSchema.parse(body);

    const harvest = await prisma.harvest.create({
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
