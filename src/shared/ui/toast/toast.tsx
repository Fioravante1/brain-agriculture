'use client';

import styled, { keyframes } from 'styled-components';
import { Toast as ToastType, useToast } from '@/shared/lib/contexts/toast-context';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainerStyled = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
  pointer-events: none;
`;

const ToastItem = styled.div<{ $type: ToastType['type']; $isExiting?: boolean }>`
  background: ${({ theme, $type }) => {
    switch ($type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.danger;
      case 'warning':
        return theme.colors.warning;
      case 'info':
      default:
        return theme.colors.info;
    }
  }};
  color: ${({ theme }) => theme.colors.white};
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 300px;
  pointer-events: all;
  animation: ${({ $isExiting }) => ($isExiting ? slideOut : slideIn)} 0.3s ease-out;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
`;

const ToastContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const ToastIcon = styled.span`
  font-size: 20px;
  line-height: 1;
  flex-shrink: 0;
`;

const ToastMessage = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  word-break: break-word;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const getIcon = (type: ToastType['type']) => {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    case 'info':
    default:
      return 'ℹ';
  }
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <ToastContainerStyled>
      {toasts.map(toast => (
        <ToastItem key={toast.id} $type={toast.type}>
          <ToastContent>
            <ToastIcon>{getIcon(toast.type)}</ToastIcon>
            <ToastMessage>{toast.message}</ToastMessage>
          </ToastContent>
          <CloseButton onClick={() => removeToast(toast.id)} aria-label='Fechar notificação'>
            ×
          </CloseButton>
        </ToastItem>
      ))}
    </ToastContainerStyled>
  );
}
