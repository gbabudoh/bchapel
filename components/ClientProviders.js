'use client';
import GoogleAnalytics from './GoogleAnalytics';
import StructuredData from './StructuredData';

export default function ClientProviders({ children }) {
  return (
    <>
      <GoogleAnalytics />
      <StructuredData />
      {children}
    </>
  );
}