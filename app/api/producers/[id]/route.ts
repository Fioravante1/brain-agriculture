import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/shared/lib/database/prisma';

// Schema de validação para edição
const producerUpdateSchema = z.object({
  cpfCnpj: z.string().min(1, 'CPF/CNPJ é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
});

// GET /api/producers/[id] - Busca produtor por ID
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const producer = await prisma.producer.findUnique({
      where: { id },
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

    if (!producer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Produtor não encontrado',
          message: 'Nenhum produtor encontrado com este ID',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: producer,
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

// PUT /api/producers/[id] - Atualiza produtor
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Valida dados de entrada
    const validatedData = producerUpdateSchema.parse(body);

    // Verifica se o produtor existe
    const existingProducer = await prisma.producer.findUnique({
      where: { id },
    });

    if (!existingProducer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Produtor não encontrado',
          message: 'Nenhum produtor encontrado com este ID',
        },
        { status: 404 },
      );
    }

    // Verifica se CPF/CNPJ já existe em outro produtor
    const duplicateProducer = await prisma.producer.findFirst({
      where: { cpfCnpj: validatedData.cpfCnpj, id: { not: id } },
    });

    if (duplicateProducer) {
      return NextResponse.json(
        {
          success: false,
          error: 'CPF/CNPJ já cadastrado',
          message: 'Já existe outro produtor com este CPF/CNPJ',
        },
        { status: 409 },
      );
    }

    // Atualiza produtor
    const updatedProducer = await prisma.producer.update({
      where: { id },
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

    return NextResponse.json({
      success: true,
      data: updatedProducer,
      message: 'Produtor atualizado com sucesso',
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

// DELETE /api/producers/[id] - Deleta produtor
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Verifica se o produtor existe
    const existingProducer = await prisma.producer.findUnique({
      where: { id },
    });

    if (!existingProducer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Produtor não encontrado',
          message: 'Nenhum produtor encontrado com este ID',
        },
        { status: 404 },
      );
    }

    // Remove produtor
    await prisma.producer.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Produtor deletado com sucesso',
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
