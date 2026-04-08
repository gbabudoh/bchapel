'use client';
import { Suspense } from 'react';
import GoogleAnalytics from './GoogleAnalytics';
import StructuredData from './StructuredData';

export default function ClientProviders({ children }) {
  return (
    <>
      <Suspense fallback={null}>
        <GoogleAnalytics />
      </Suspense>
      <StructuredData />
      {children}
    </>
  );
}