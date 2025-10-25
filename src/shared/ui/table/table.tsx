'use client';

import styled from 'styled-components';
import { ReactNode } from 'react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  width?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
}

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.surface};
`;

const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const Th = styled.th<{ $width?: string }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  text-align: left;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  ${({ $width }) => $width && `width: ${$width};`}
`;

const Tbody = styled.tbody``;

const Tr = styled.tr<{ $clickable?: boolean }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  transition: background-color 0.2s;

  ${({ $clickable }) =>
    $clickable &&
    `
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }
  `}

  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const LoadingContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export function Table<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
  loading = false,
  emptyMessage = 'Nenhum registro encontrado',
}: TableProps<T>) {
  if (loading) {
    return (
      <TableContainer>
        <LoadingContainer>Carregando...</LoadingContainer>
      </TableContainer>
    );
  }

  if (data.length === 0) {
    return (
      <TableContainer>
        <EmptyContainer>{emptyMessage}</EmptyContainer>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <StyledTable>
        <Thead>
          <tr>
            {columns.map((column, index) => (
              <Th key={index} $width={column.width}>
                {column.header}
              </Th>
            ))}
          </tr>
        </Thead>
        <Tbody>
          {data.map((item) => (
            <Tr key={item.id} onClick={() => onRowClick?.(item)} $clickable={!!onRowClick}>
              {columns.map((column, index) => (
                <Td key={index}>
                  {column.render ? column.render(item) : String(item[column.key as keyof T] ?? '-')}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </StyledTable>
    </TableContainer>
  );
}
