import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/shared/lib/database/prisma';

// Schema de validação para criação/edição
const producerSchema = z.object({
  cpfCnpj: z.string().min(1, 'CPF/CNPJ é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
});

// GET /api/producers - Lista todos os produtores
export async function GET() {
  try {
    const producers = await prisma.producer.findMany({
      include: {
        farms: {
          include: {
            farmCrops: {
              include: {
                crop: true,
                harvest: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: producers,
      count: producers.length,
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

// POST /api/producers - Cria novo produtor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Valida dados de entrada
    const validatedData = producerSchema.parse(body);

    // Verifica se CPF/CNPJ já existe
    const existingProducer = await prisma.producer.findUnique({
      where: { cpfCnpj: validatedData.cpfCnpj },
    });

    if (existingProducer) {
      return NextResponse.json(
        {
          success: false,
          error: 'CPF/CNPJ já cadastrado',
          message: 'Já existe um produtor com este CPF/CNPJ',
        },
        { status: 409 },
      );
    }

    // Cria novo produtor
    const newProducer = await prisma.producer.create({
      data: {
        cpfCnpj: validatedData.cpfCnpj,
        name: validatedData.name,
      },
      include: {
        farms: {
          include: {
            farmCrops: {
              include: {
                crop: true,
                harvest: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newProducer,
        message: 'Produtor criado com sucesso',
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
