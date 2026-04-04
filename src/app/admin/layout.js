'use client';
import { SessionProvider } from 'next-auth/react';

export default function AdminLayout({ children }) {
  return (
    <SessionProvider 
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}