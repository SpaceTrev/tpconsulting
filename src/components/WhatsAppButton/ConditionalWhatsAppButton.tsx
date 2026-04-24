'use client';

import { usePathname } from 'next/navigation';
import WhatsAppButton from './WhatsAppButton';

interface ConditionalWhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  /**
   * List of pathname prefixes where the FAB should NOT render. A pathname
   * matches if it is exactly equal to one of the entries, or starts with the
   * entry followed by a "/" (so `/diagnostico` also hides the button on
   * `/diagnostico/[slug]`).
   */
  hideOnPaths?: string[];
}

export default function ConditionalWhatsAppButton({
  phoneNumber,
  message,
  hideOnPaths = [],
}: ConditionalWhatsAppButtonProps) {
  const pathname = usePathname();

  const shouldHide = hideOnPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (shouldHide) return null;

  return <WhatsAppButton phoneNumber={phoneNumber} message={message} />;
}
