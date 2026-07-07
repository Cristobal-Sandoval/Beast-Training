import { Outfit, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import TopAnnouncementBar from "@/components/TopAnnouncementBar";
import ScrollToTop from "@/components/ScrollToTop";
import ToastProvider from "@/components/ToastProvider";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL('https://beasttraining.cl'),
  title: {
    default: "Beast Training | Gimnasio de Alto Rendimiento en Concepción",
    template: "%s | Beast Training"
  },
  description: "Entrenamiento funcional, HIIT, fuerza y CrossFit en Concepción. Planes personalizados, nutrición deportiva y el mejor ambiente de entrenamiento. Saca la bestia que llevas dentro.",
  keywords: ["gym", "gimnasio", "concepcion", "chile", "funcional", "hiit", "crossfit", "fuerza", "beast training"],
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    canonical: './',
  },
  openGraph: {
    title: "Beast Training | Gimnasio de Alto Rendimiento en Concepción",
    description: "Entrenamiento funcional, HIIT, fuerza y CrossFit en Concepción. Planes personalizados, nutrición deportiva y el mejor ambiente de entrenamiento.",
    url: "https://beasttraining.cl",
    siteName: "Beast Training",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Beast Training Gym",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Beast Training | Gimnasio de Alto Rendimiento en Concepción",
    description: "Entrenamiento funcional, HIIT, fuerza y CrossFit en Concepción. Planes personalizados, nutrición deportiva y el mejor ambiente de entrenamiento.",
    images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop"],
  }
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "@id": "https://beasttraining.cl/#gym",
    "name": "Beast Training",
    "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
    "description": "Entrenamiento funcional, HIIT, fuerza y CrossFit en Concepción. Planes personalizados y seguimiento digital.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Libertador Bernardo O'Higgins 940",
      "addressLocality": "Concepción",
      "addressRegion": "Biobío",
      "postalCode": "4030000",
      "addressCountry": "CL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -36.826998,
      "longitude": -73.048998
    },
    "url": "https://beasttraining.cl",
    "telephone": "+56912345678",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:00",
        "closes": "22:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "14:00"
      }
    ],
    "priceRange": "$$"
  };

  return (
    <html lang="es" className={`${outfit.variable} ${inter.variable}`}>
      <body>
        <a href="#main-content" className="skipLink">Saltar al contenido principal</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <TopAnnouncementBar />
        <Navbar />
        <main id="main-content" className="pageFadeIn" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
        <Footer />
        
        {/* Floating WhatsApp button wrapper with path check */}
        <WhatsAppButton />
        {/* Scroll to top button */}
        <ScrollToTop />
        {/* Global toast notification system */}
        <ToastProvider />
      </body>
    </html>
  );
}
