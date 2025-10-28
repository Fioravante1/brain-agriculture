'use client';

import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useConfirmState } from '@/shared/lib/contexts/confirm-context';
import { Button } from '@/shared/ui/button';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease-out;
  backdrop-filter: blur(4px);
`;

const DialogContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  width: 100%;
  animation: ${slideUp} 0.3s ease-out;
  overflow: hidden;
`;

const DialogHeader = styled.div<{ $variant: 'danger' | 'warning' | 'info' }>`
  padding: 24px 24px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme, $variant }) => {
    switch ($variant) {
      case 'danger':
        return `linear-gradient(135deg, ${theme.colors.danger}15 0%, transparent 100%)`;
      case 'warning':
        return `linear-gradient(135deg, ${theme.colors.warning}15 0%, transparent 100%)`;
      case 'info':
      default:
        return `linear-gradient(135deg, ${theme.colors.info}15 0%, transparent 100%)`;
    }
  }};
`;

const DialogIcon = styled.div<{ $variant: 'danger' | 'warning' | 'info' }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 16px;
  background: ${({ theme, $variant }) => {
    switch ($variant) {
      case 'danger':
        return theme.colors.danger;
      case 'warning':
        return theme.colors.warning;
      case 'info':
      default:
        return theme.colors.info;
    }
  }};
  color: ${({ theme }) => theme.colors.white};
`;

const DialogTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;
`;

const DialogBody = styled.div`
  padding: 20px 24px 24px;
`;

const DialogMessage = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DialogFooter = styled.div`
  padding: 16px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
`;

const getIconForVariant = (variant: 'danger' | 'warning' | 'info') => {
  switch (variant) {
    case 'danger':
      return '⚠';
    case 'warning':
      return '⚡';
    case 'info':
    default:
      return 'ℹ';
  }
};

export function ConfirmDialog() {
  const state = useConfirmState();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isOpen) {
        state.onCancel();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [state]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      state.onCancel();
    }
  };

  return (
    <Overlay $isOpen={state.isOpen} onClick={handleOverlayClick}>
      <DialogContainer role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <DialogHeader $variant={state.variant!}>
          <DialogIcon $variant={state.variant!}>{getIconForVariant(state.variant!)}</DialogIcon>
          <DialogTitle id="dialog-title">{state.title}</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <DialogMessage>{state.message}</DialogMessage>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={state.onCancel}>
            {state.cancelText}
          </Button>
          <Button
            variant={state.variant === 'danger' ? 'danger' : state.variant === 'warning' ? 'warning' : 'primary'}
            onClick={state.onConfirm}
            autoFocus
          >
            {state.confirmText}
          </Button>
        </DialogFooter>
      </DialogContainer>
    </Overlay>
  );
}
