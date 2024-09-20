import { ReactNode } from 'react';
import ToastProvider from './ToastProvider';

interface ToastWrapperProps {
  children: ReactNode;
}

function ToastWrapper({ children }: ToastWrapperProps) {
  return (
    <>
      {/* Ваш ToastProvider */}
      <ToastProvider />
      {children}
    </>
  );
}

export default ToastWrapper;
