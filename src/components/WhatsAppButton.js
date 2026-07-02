'use client';

import { usePathname } from 'next/navigation';

export default function WhatsAppButton() {
  const pathname = usePathname();

  // Hide WhatsApp button inside user dashboards and admin panel
  const isDashboardOrAdmin = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  if (isDashboardOrAdmin) return null;

  return (
    <a
      href="https://wa.me/56987654321?text=Hola!%20Me%20gustaria%20saber%20mas%20sobre%20los%20planes%20de%20Beast%20Training."
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Contactar por WhatsApp"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <svg
        viewBox="0 0 24 24"
        width="26"
        height="26"
        fill="currentColor"
        style={{ display: 'block', flexShrink: 0 }}
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.579 1.966 14.11 1.95 12.008 1.95c-5.44 0-9.866 4.372-9.87 9.802 0 1.768.482 3.49 1.396 5.017L2.53 21.53l4.117-1.376zm11.107-7.234c-.3-.15-1.772-.875-2.046-.975-.276-.1-.477-.15-.677.15-.2.3-.777.975-.95 1.175-.175.2-.35.225-.65.075-3.05-1.55-4.225-2.65-5.025-4.025-.2-.35-.025-.537.15-.687.162-.137.35-.412.525-.612.175-.2.225-.35.35-.6.125-.25.062-.475-.031-.675-.1-.2-.777-1.875-1.075-2.575-.29-.7-.585-.6-.8-.6-.2-.01-.425-.01-.65-.01-.225 0-.587.085-.89.412-.304.325-1.165 1.137-1.165 2.775 0 1.637 1.19 3.225 1.35 3.45.162.225 2.344 3.57 5.679 5.012 2.785 1.206 3.35 1.025 3.975.925.625-.1 1.772-.725 2.022-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" />
      </svg>
    </a>
  );
}
