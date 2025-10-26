'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui';
import { formatNumber, formatHectares } from '@/shared/lib/utils';
import { useDashboardStats } from '@/features/dashboard';
import { StatCard, PieChartCard } from '@/widgets/dashboard';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background};
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { data: stats, isLoading } = useDashboardStats();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || isLoading) {
    return (
      <PageContainer>
        <LoadingContainer>Carregando dados...</LoadingContainer>
      </PageContainer>
    );
  }

  if (!stats) {
    return (
      <PageContainer>
        <LoadingContainer>Erro ao carregar dados do dashboard</LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <Title>Dashboard</Title>
        <Subtitle>Visão geral das fazendas e produtores cadastrados</Subtitle>

        <Actions>
          <Button onClick={() => router.push('/producers')}>Ver Produtores</Button>
          <Button variant='outline' onClick={() => router.push('/farms')}>
            Ver Fazendas
          </Button>
          <Button variant='outline' onClick={() => router.push('/crops')}>
            Ver Culturas
          </Button>
          <Button variant='outline' onClick={() => router.push('/harvests')}>
            Ver Safras
          </Button>
          <Button variant='outline' onClick={() => router.push('/farm-crops')}>
            Ver Associações
          </Button>
        </Actions>
      </PageHeader>

      <StatsGrid>
        <StatCard title='Total de Fazendas' value={formatNumber(stats.totalFarms)} />
        <StatCard title='Total de Hectares' value={formatHectares(stats.totalHectares)} />
      </StatsGrid>

      <ChartsGrid>
        <PieChartCard title='Fazendas por Estado' data={stats.farmsByState} />
        <PieChartCard title='Culturas Plantadas' data={stats.farmsByCrop} />
        <PieChartCard title='Uso do Solo' data={stats.landUse} />
      </ChartsGrid>
    </PageContainer>
  );
}
