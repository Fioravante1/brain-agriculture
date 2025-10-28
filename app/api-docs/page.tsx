'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args: unknown[]) => {
      const message = String(args[0]);
      if (message.includes('UNSAFE_componentWillReceiveProps') || message.includes('componentDidMount') || message.includes('UseEffect')) {
        return;
      }
      originalError.apply(console, args);
    };

    console.warn = (...args: unknown[]) => {
      const message = String(args[0]);
      if (message.includes('UNSAFE_componentWillReceiveProps') || message.includes('componentDidMount') || message.includes('UseEffect')) {
        return;
      }
      originalWarn.apply(console, args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <SwaggerUI url='/openapi.yaml' />
    </div>
  );
}
