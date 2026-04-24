import Nav from '@/components/Nav/Nav';
import Footer from '@/components/Footer/Footer';
import ConditionalWhatsAppButton from '@/components/WhatsAppButton/ConditionalWhatsAppButton';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</main>
      <Footer />
      {/*
        The FAB is redundant on /diagnostico — that page is already the primary
        "talk to us" surface (form wizard + Cal booking embed). Showing the
        floating button there collides with form inputs on mobile and gives
        the user two parallel paths that confuse the flow. ConditionalWhatsAppButton
        reads the pathname client-side and skips rendering on /diagnostico.
      */}
      <ConditionalWhatsAppButton
        phoneNumber="13038299013"
        message="Hola, me interesa saber más sobre sus servicios de automatización"
        hideOnPaths={['/diagnostico']}
      />
    </>
  );
}
