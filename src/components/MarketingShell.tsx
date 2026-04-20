'use client';

import { usePathname } from 'next/navigation';
import Nav from './Nav/Nav';
import Footer from './Footer/Footer';
import WhatsAppButton from './WhatsAppButton/WhatsAppButton';

export default function MarketingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <>
      <Nav />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</main>
      <Footer />
      <WhatsAppButton
        phoneNumber="13038299013"
        message="Hola, me interesa saber más sobre sus servicios de automatización"
      />
    </>
  );
}
