import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar culturas
  const crops = await Promise.all([
    prisma.crop.upsert({
      where: { name: 'Soja' },
      update: {},
      create: { name: 'Soja' },
    }),
    prisma.crop.upsert({
      where: { name: 'Milho' },
      update: {},
      create: { name: 'Milho' },
    }),
    prisma.crop.upsert({
      where: { name: 'Café' },
      update: {},
      create: { name: 'Café' },
    }),
    prisma.crop.upsert({
      where: { name: 'Cana-de-açúcar' },
      update: {},
      create: { name: 'Cana-de-açúcar' },
    }),
    prisma.crop.upsert({
      where: { name: 'Algodão' },
      update: {},
      create: { name: 'Algodão' },
    }),
  ]);

  console.log('✅ Culturas criadas:', crops.length);

  // Criar safras
  const harvests = await Promise.all([
    prisma.harvest.upsert({
      where: { name: 'Safra 2021' },
      update: {},
      create: { name: 'Safra 2021', year: 2021 },
    }),
    prisma.harvest.upsert({
      where: { name: 'Safra 2022' },
      update: {},
      create: { name: 'Safra 2022', year: 2022 },
    }),
    prisma.harvest.upsert({
      where: { name: 'Safra 2023' },
      update: {},
      create: { name: 'Safra 2023', year: 2023 },
    }),
  ]);

  console.log('✅ Safras criadas:', harvests.length);

  // Criar produtores
  const producers = await Promise.all([
    prisma.producer.upsert({
      where: { cpfCnpj: '123.456.789-09' },
      update: {},
      create: {
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
      },
    }),
    prisma.producer.upsert({
      where: { cpfCnpj: '987.654.321-00' },
      update: {},
      create: {
        cpfCnpj: '987.654.321-00',
        name: 'Maria Santos',
      },
    }),
    prisma.producer.upsert({
      where: { cpfCnpj: '12.345.678/0001-90' },
      update: {},
      create: {
        cpfCnpj: '12.345.678/0001-90',
        name: 'Fazenda São José Ltda',
      },
    }),
  ]);

  console.log('✅ Produtores criados:', producers.length);

  // Criar fazendas
  const farms = await Promise.all([
    prisma.farm.create({
      data: {
        producerId: producers[0].id,
        name: 'Fazenda Boa Vista',
        city: 'Ribeirão Preto',
        state: 'SP',
        totalArea: 1000,
        arableArea: 800,
        vegetationArea: 200,
      },
    }),
    prisma.farm.create({
      data: {
        producerId: producers[0].id,
        name: 'Sítio São João',
        city: 'Campinas',
        state: 'SP',
        totalArea: 500,
        arableArea: 400,
        vegetationArea: 100,
      },
    }),
    prisma.farm.create({
      data: {
        producerId: producers[1].id,
        name: 'Fazenda Santa Maria',
        city: 'Uberaba',
        state: 'MG',
        totalArea: 2000,
        arableArea: 1500,
        vegetationArea: 500,
      },
    }),
    prisma.farm.create({
      data: {
        producerId: producers[2].id,
        name: 'Fazenda São José',
        city: 'Sorriso',
        state: 'MT',
        totalArea: 5000,
        arableArea: 4000,
        vegetationArea: 1000,
      },
    }),
  ]);

  console.log('✅ Fazendas criadas:', farms.length);

  // Criar relacionamentos fazenda-cultura-safra
  await Promise.all([
    prisma.farmCrop.create({
      data: {
        farmId: farms[0].id,
        cropId: crops[0].id, // Soja
        harvestId: harvests[0].id, // Safra 2021
      },
    }),
    prisma.farmCrop.create({
      data: {
        farmId: farms[0].id,
        cropId: crops[1].id, // Milho
        harvestId: harvests[0].id, // Safra 2021
      },
    }),
    prisma.farmCrop.create({
      data: {
        farmId: farms[1].id,
        cropId: crops[2].id, // Café
        harvestId: harvests[1].id, // Safra 2022
      },
    }),
    prisma.farmCrop.create({
      data: {
        farmId: farms[2].id,
        cropId: crops[0].id, // Soja
        harvestId: harvests[1].id, // Safra 2022
      },
    }),
    prisma.farmCrop.create({
      data: {
        farmId: farms[3].id,
        cropId: crops[0].id, // Soja
        harvestId: harvests[2].id, // Safra 2023
      },
    }),
    prisma.farmCrop.create({
      data: {
        farmId: farms[3].id,
        cropId: crops[3].id, // Cana-de-açúcar
        harvestId: harvests[2].id, // Safra 2023
      },
    }),
  ]);

  console.log('✅ Relacionamentos fazenda-cultura-safra criados');

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch(e => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
