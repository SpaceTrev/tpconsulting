import Nav from '@/components/Nav/Nav';
import Footer from '@/components/Footer/Footer';
import WhatsAppButton from '@/components/WhatsAppButton/WhatsAppButton';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
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
