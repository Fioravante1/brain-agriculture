import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/database/prisma';

type FarmWithProducer = {
  id: string;
  producerId: string;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  createdAt: Date;
  updatedAt: Date;
  producer: {
    id: string;
    cpfCnpj: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

type FarmCropWithCrop = {
  id: string;
  farmId: string;
  cropId: string;
  harvestId: string;
  createdAt: Date;
  updatedAt: Date;
  crop: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

export interface DashboardStats {
  totalFarms: number;
  totalHectares: number;
  farmsByState: Array<{ name: string; value: number }>;
  farmsByCrop: Array<{ name: string; value: number }>;
  landUse: Array<{ name: string; value: number }>;
}

export async function GET() {
  try {
    const [farms, farmCrops] = await Promise.all([
      prisma.farm.findMany({
        include: {
          producer: true,
        },
      }),
      prisma.farmCrop.findMany({
        include: {
          crop: true,
        },
      }),
    ]);

    const totalFarms = farms.length;

    const totalHectares = farms.reduce((sum: number, farm: FarmWithProducer) => sum + farm.totalArea, 0);

    const stateMap = new Map<string, number>();
    farms.forEach((farm: FarmWithProducer) => {
      stateMap.set(farm.state, (stateMap.get(farm.state) || 0) + 1);
    });
    const farmsByState = Array.from(stateMap.entries()).map(([name, value]) => ({ name, value }));

    const cropMap = new Map<string, number>();
    farmCrops.forEach((farmCrop: FarmCropWithCrop) => {
      const cropName = farmCrop.crop.name;
      cropMap.set(cropName, (cropMap.get(cropName) || 0) + 1);
    });
    const farmsByCrop = Array.from(cropMap.entries()).map(([name, value]) => ({ name, value }));

    // Uso do solo (área agricultável vs vegetação)
    const totalArable = farms.reduce((sum: number, farm: FarmWithProducer) => sum + farm.arableArea, 0);
    const totalVegetation = farms.reduce((sum: number, farm: FarmWithProducer) => sum + farm.vegetationArea, 0);

    const landUse = [
      { name: 'Área Agricultável', value: totalArable },
      { name: 'Vegetação', value: totalVegetation },
    ];

    const stats: DashboardStats = {
      totalFarms,
      totalHectares,
      farmsByState,
      farmsByCrop,
      landUse,
    };

    return NextResponse.json({
      success: true,
      data: stats,
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
