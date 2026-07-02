import { Outfit, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import TopAnnouncementBar from "@/components/TopAnnouncementBar";
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
  title: "Beast Training | Gimnasio de Alto Rendimiento en Concepción",
  description: "Entrenamiento funcional, HIIT, fuerza y CrossFit en Concepción. Planes personalizados, nutrición deportiva y el mejor ambiente de entrenamiento. Saca la bestia que llevas dentro.",
  keywords: ["gym", "gimnasio", "concepcion", "chile", "funcional", "hiit", "crossfit", "fuerza", "beast training"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${outfit.variable} ${inter.variable}`}>
      <body>
        <TopAnnouncementBar />
        <Navbar />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
        <Footer />
        
        {/* Floating WhatsApp button wrapper with path check */}
        <WhatsAppButton />
      </body>
    </html>
  );
}
