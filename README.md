# Beast Training — Plataforma Web de Gestión de Gimnasio

Plataforma web completa para **Beast Training**, un gimnasio de alto rendimiento en Concepción, Chile. Incluye landing page pública, blog, cotización y contratación directa de planes vía WhatsApp, feed de Instagram en vivo, y dashboards privados para alumnos y administradores.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Estilos | CSS Modules + Variables CSS + Glassmorphism |
| Tipografía | Google Fonts — Outfit (display) & Inter (sans) |
| Backend / Auth | [Supabase](https://supabase.com/) (PostgreSQL + Auth + RLS + Realtime) |
| Automatización | [GitHub Actions](https://github.com/features/actions) (Supabase Keep-Alive) |
| Íconos | [Lucide React](https://lucide.dev/) |
| SEO | Sitemap dinámico, JSON-LD (Article, Breadcrumb, SportsActivityLocation, ExerciseGym) |
| Performance | next/font, SSG/ISR, lazy loading, CSP estricto |
| Deploy | [Vercel](https://vercel.com/) |

---

## Funcionalidades Principales

### 🏋️ Página Pública
- **Hero Carousel**: 3 banners de alto impacto (Fuerza presencial, Alto Rendimiento y Planes Online a distancia), con imágenes optimizadas y navegación por flechas y puntos.
- **Cintillo de Anuncios**: Marquee promocional configurable desde el panel de administración.
- **Pilares de Valor**: Tarjetas interactivas con glassmorphism y animaciones de scroll reveal.
- **Feed de Instagram en Vivo (`@btrainingchile`)**: Carrusel slider horizontal sincronizado en tiempo real con las publicaciones oficiales de Instagram.
- **Blog Preview**: Muestra los últimos artículos y consejos de entrenamiento.
- **Sección Nosotros**: Perfil del Coach Pelu, especialidades, metodología, fotos y redes sociales.
- **WhatsApp Flotante**: Botón de contacto directo sincronizado con el número del gimnasio.

### 💳 Planes de Membresía & Contratación
- **3 Categorías Claras**: **Solo** (individual), **Dúo** (parejas) y **Online** (a distancia).
- **Límite de 6 Planes por Categoría**: Máximo de 6 membresías estructuradas por categoría para evitar sobrecarga de información.
- **Control Online/Offline**: Activación o desactivación instantánea de la visibilidad pública de cada plan desde el panel de administración.
- **⭐ Plan Más Popular Inteligente**:
  - **En Móviles**: El plan destacado aparece automáticamente **de primero arriba** (`order: -1`).
  - **En Escritorio**: El plan destacado se posiciona **en el centro** de la primera fila en un grid de 3 columnas con borde iluminado y elevación visual.
- **Contratación Vía WhatsApp**: Mensaje preconfigurado con el nombre del plan y precio al hacer clic.

### 📰 Blog de Fitness & Nutrición
- Artículos educativos sobre sobrecarga progresiva, nutrición, prevención de lesiones, descanso, cardio HIIT y suplementación redactados por el Coach Pelu.
- Pre-renderizado estático (SSG) mediante `generateStaticParams` para carga ultrarrápida y posicionamiento SEO.
- Schema JSON-LD `Article`, Open Graph y Twitter Cards integrados.

### 📊 Dashboard Alumno (`/dashboard`)
- Estado de membresía y saludo personalizado.
- Comunicados Beast con prioridad (normal/urgente).
- Estadísticas físicas: peso, % grasa, masa muscular vs mes anterior con gráficos SVG animados.
- Historial completo de evaluaciones en tabla responsiva.
- Plan de entrenamiento y rutina personalizada asignada por el Coach.
- Chat directo en tiempo real con el Coach vía Supabase Realtime.
- Selección de citas para evaluación física entre los horarios propuestos.

### ⚙️ Panel Administrador (`/admin`)
- **Gestión de Alumnos**: Registro con clave provisional, activación/desactivación de cuentas y visualización de fichas técnicas.
- **Gestor de Planes**: Crear, editar, activar/desactivar y marcar planes como "Más Popular" respetando el límite de 6 por categoría.
- **Integración Google Calendar**: Sincronización con la cuenta `btrainingchile@gmail.com` para agendar evaluaciones y clases con 1 clic.
- **Banners & Anuncios**: Editor de imágenes, textos y alineaciones para el carrusel principal y cintillo promocional.
- **Editor de Blog**: Creación y eliminación de artículos en tiempo real.
- **Chat en Vivo**: Respuestas instantáneas por WebSocket a los alumnos sin recargar la página.

---

## Mejoras Recientes (Septiembre 2026)

### 🚀 Planes de Entrenamiento Rediseñados
- Implementación de las 3 categorías definitivas: **Solo**, **Dúo** y **Online**.
- Límite de 6 planes por categoría con indicadores de estado `● Online` y `○ Offline`.
- Lógica de asignación única del plan más popular por categoría.
- Distribución de 3 columnas en escritorio y priorización en móviles.

### 📸 Integración Oficial de Instagram (`@btrainingchile`)
- Conexión del widget de Instagram en formato carrusel slider de 1 sola fila continua.
- Actualización automática de publicaciones e historias sin requerir claves de acceso.
- Política de Seguridad de Contenido (CSP) adaptada en `next.config.mjs`.

### ⚡ GitHub Action: Supabase Keep-Alive
- Flujo automatizado [`.github/workflows/supabase-keep-alive.yml`](.github/workflows/supabase-keep-alive.yml).
- Ejecución cada 3 días a las 12:00 UTC con una consulta REST ligera (`/rest/v1/plans?select=id&limit=1`).
- Previene que el proyecto de Supabase entre en pausa por inactividad en el plan gratuito.

### 📝 Contenido Editorial del Blog
- 6 artículos completos de entrenamiento y nutrición escritos por Pelu con fotografías de alta calidad.

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── page.js                    # Landing page con SSR
│   ├── HomeClient.js              # Cliente interactivo de la Home
│   ├── robots.js                  # Configuración de rastreo SEO
│   ├── sitemap.js                 # Sitemap XML dinámico
│   ├── layout.js                  # Layout raíz y metadatos globales
│   ├── globals.css                # Variables CSS, glassmorphism y utilidades
│   ├── blog/                      # Listado y detalle dinámico [slug] del blog
│   ├── planes/                    # Catálogo de planes interactivo (Solo, Dúo, Online)
│   ├── nosotros/                  # Página de biografía del Coach y metodología
│   ├── dashboard/                 # Panel privado del alumno
│   ├── admin/                     # Panel de control del Coach (modular)
│   │   ├── components/            # Subpaneles (PlansPanel, BannersPanel, etc.)
│   │   ├── hooks/                 # Hooks de estado desacoplados (usePlansState, etc.)
│   │   └── useAdminState.js       # Hook centralizado del panel
│   ├── login/                     # Inicio de sesión con Supabase Auth
│   └── registro/                  # Registro de alumnos
├── components/
│   ├── Navbar.js                  # Barra de navegación adaptable
│   ├── Footer.js                  # Pie de página institucional
│   ├── InstagramFeed.js           # Componente de feed de Instagram en vivo
│   ├── WhatsAppButton.js          # Botón flotante dinámico de WhatsApp
│   ├── TopAnnouncementBar.js      # Cintillo promocional superior
│   └── ToastProvider.js           # Sistema de notificaciones toast
└── lib/
    ├── supabaseClient.js          # Cliente de conexión a Supabase
    ├── defaultPlans.js            # Planes predeterminados y mapeo de categorías DB
    └── defaultBlogPosts.js        # Artículos del blog iniciales
```

---

## Configuración y Desarrollo Local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Iniciar el servidor de desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 4. Compilar para producción
```bash
npm run build
npm run start
```

---

## Base de Datos (Supabase)

| Tabla | Descripción |
|---|---|
| `profiles` | Perfiles de usuarios (rol admin/alumno, plan, rutina, estado) |
| `plans` | Catálogo de planes de membresía (solo, duo, online, popular, visible) |
| `banners` | Banners promocionales del Hero |
| `blog_posts` | Artículos y noticias de fitness y nutrición |
| `direct_messages` | Mensajes del chat en tiempo real entre alumno y coach |
| `physical_progress` | Evaluaciones antropométricas (peso, grasa, músculo, perímetros) |
| `announcements` | Comunicados generales del gimnasio |
| `about_info` | Configuración de la sección Nosotros, redes sociales y WhatsApp |
| `promo_codes` | Códigos de descuento promocionales |

---

## Licencia

Proyecto privado — Beast Training Concepción © 2026
