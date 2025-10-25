'use client';

import styled from 'styled-components';
import { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  title?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: boolean;
}

const StyledCard = styled.div<{ $padding: 'sm' | 'md' | 'lg'; $shadow: boolean }>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  ${({ $shadow, theme }) => $shadow && `box-shadow: ${theme.shadows.md};`}

  ${({ $padding, theme }) => {
    switch ($padding) {
      case 'sm':
        return `padding: ${theme.spacing.md};`;
      case 'lg':
        return `padding: ${theme.spacing.xl};`;
      default:
        return `padding: ${theme.spacing.lg};`;
    }
  }}
`;

const CardTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export function Card({ children, title, padding = 'md', shadow = true }: CardProps) {
  return (
    <StyledCard $padding={padding} $shadow={shadow}>
      {title && <CardTitle>{title}</CardTitle>}
      {children}
    </StyledCard>
  );
}
