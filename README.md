# Beast Training — Plataforma Web de Gestión de Gimnasio

Plataforma web completa para **Beast Training**, un gimnasio de alto rendimiento en Concepción, Chile. Incluye landing page pública, blog, cotización y contratación directa de planes vía WhatsApp, y dashboards privados para alumnos y administradores.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Estilos | CSS Modules + Variables CSS + Glassmorphism |
| Tipografía | Google Fonts — Outfit (display) & Inter (sans) |
| Backend / Auth | [Supabase](https://supabase.com/) (PostgreSQL + Auth + RLS) |
| Íconos | [Lucide React](https://lucide.dev/) |
| SEO | Sitemap dinámico, JSON-LD (Article, Breadcrumb, SportsActivityLocation) |
| Performance | next/font, ISR-ready, tree-shaking, raw dynamic images |
| Deploy | [Vercel](https://vercel.com/) |

---

## Funcionalidades Principales

### Página Pública
- **Hero Carousel** con `next/image`, overlay gradiente, navegación por arrows + dots
- **Cintillo de anuncio** con marquee en mobile, configurable desde admin
- **Pilares de valor** con glassmorphism y scroll reveal
- **Blog preview** con las últimas 2 publicaciones
- **Sección Nosotros (Coach)** con biografía, especialidades, imagen del Coach y enlaces a redes sociales autogestionables
- **WhatsApp flotante** dinámico (solo en páginas públicas)

### Contratación de Planes (Vía WhatsApp)
- Planes segmentados (Individual, Dúo/Pareja) con listas de beneficios.
- Botones de contacto directo que abren WhatsApp con un mensaje predeterminado indicando el plan seleccionado y su valor.
- El número de WhatsApp de contacto es totalmente configurable desde el panel de administración y se sincroniza en todo el sitio web (enlaces de planes y botón flotante).
- Flujo de registro manual: El alumno solicita el plan al Coach, el Coach ingresa los datos en el panel y le asigna una clave provisoria para su primer inicio de sesión.

### Blog
- Listado con artículo destacado + grid secundario
- Artículo de blog individual con `generateStaticParams` (SSG)
- Schema JSON-LD `Article` + `BreadcrumbList`
- Open Graph, Twitter Cards, meta tags dinámicos

### Dashboard Alumno (`/dashboard`)
- Estado de membresía y saludo personalizado
- Comunicados Beast con prioridad (normal/urgente)
- Estadísticas: peso, % grasa, masa muscular vs mes anterior
- Gráficos SVG animados responsivos
- Historial de evaluaciones en tabla scrolleable
- Plan de entrenamiento (rutina) asignado por el Coach
- Chat directo privado con el coach
- Selección de cita entre slots propuestos para evaluación física

### Panel Admin (`/admin`)
- **Gestión de Alumnos:** Registrar nuevos alumnos (con clave provisional), activar/desactivar cuentas, y ver fichas.
- **Gestión de Planes:** Crear, editar, pausar y eliminar planes del catálogo públicamente en la web (precios, descripciones, características y destacar como popular).
- **Editor de Sección Nosotros:** Modificar biografía del Coach, subir retrato (mediante URL externa libre), y configurar especialidades.
- **Redes Sociales & Visibilidad:** Agregar enlaces a redes sociales y activar/desactivar su visibilidad individual en la web pública mediante casillas de verificación.
- **Banners del Hero:** Configurar imágenes, alineación de textos y botones de acción.
- **Cintillo de Anuncios:** Modificar el texto promocional superior del sitio.
- **Ficha & Rutina:** Asignar y editar las rutinas de ejercicio de los alumnos en formato texto.
- **Evaluaciones Físicas:** Registrar peso, % grasa, masa muscular, diámetros corporales y observaciones de progreso.
- **Sistema de Citas:** Proponer slots de evaluación y ver la opción seleccionada.
- **Chat Privado:** Responder mensajes individuales de cada alumno.
- **Integración Google Calendar:** Conectar cuenta corporativa de Google, sincronizar citas/evaluaciones y vinculación automática de correos Gmail al registrar o escanear alumnos.

---

## Mejoras Recientes (Julio - Agosto 2026)

### Integración Google Calendar & Automatización
- **Integración con Google Calendar:** Panel dedicado (`IntegrationsPanel.js`) para vincular la cuenta corporativa de Google, forzar escaneo de eventos y registrar logs de sincronización en tiempo real.
- **Detección Automática de Gmail:** Al registrar un alumno con correo `@gmail.com`, el sistema vincula automáticamente su agenda y le envía notificaciones con enlaces de Google Meet.

### Rendimiento & Estabilidad
- **Eliminación de MercadoPago:** Se removió por completo la pasarela de pago con tarjeta, reemplazándola por un flujo de contacto directo y contratación vía WhatsApp más ágil y personalizado.
- **Imágenes Externas Libres:** Se migró el retrato del Coach a una etiqueta `<img>` nativa de HTML, permitiendo el ingreso de URLs de cualquier servidor externo (Imgur, Pinterest, etc.) en el panel admin sin bloqueos ni necesidad de configurar dominios en `next.config.mjs`.
- **Estructura Modular del Panel Admin:** Se refactorizaron las vistas administrativas hacia subpaneles modulares e independientes (`Sidebar`, `PlansPanel`, `AboutPanel`, `BlogPanel`, `IntegrationsPanel`, etc.) utilizando hooks de React centralizados para un código limpio y de fácil mantenimiento.

### Usabilidad & Diseño Responsivo (UX/UI)
- **Rediseño del Footer & Navbar:** Botón de inicio de sesión removido del Navbar para no entorpecer la vista comercial, reubicado en el footer como botón estilizado glassmórfico de "Acceso Staff & Alumnos" junto al ícono de Instagram, e integración de la firma personal con link a portafolio (`🐈`).
- **Navegación Mobile-First Adaptativa:** En móviles, la firma y derechos reservados se reubican al fondo del todo con márgenes de seguridad para no ser tapados por los botones flotantes de WhatsApp y Scroll-to-Top.
- **Alineación Perfecta en Formularios:** Se unificó la altura mínima y alineación flexible inferior de las etiquetas (`label`) de los campos en fila de grilla, previniendo desfases visuales provocados por títulos de varias líneas.
- **Botón `primaryBtn` Estilizado:** Implementación del estilo institucional Beast (naranja redondeado con sombras tridimensionales y micro-interacciones) en botones principales del administrador.

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── page.js                    # Landing page
│   ├── robots.js                  # SEO: bloquea indexación de rutas privadas
│   ├── sitemap.js                 # Sitemap dinámico (blog + estáticas)
│   ├── layout.js                  # Layout raíz
│   ├── globals.css                # Variables, utilidades, prefers-reduced-motion
│   ├── blog/                      # Blog list + [slug]/ detail + loading skeleton
│   ├── planes/                    # Planes con contacto de contratación
│   ├── dashboard/                 # Dashboard alumno
│   ├── admin/                     # Panel admin modular (Dashboard, componentes y estado)
│   │   ├── components/            # Subpaneles del administrador (PlansPanel, IntegrationsPanel, etc.)
│   │   └── useAdminState.js       # Hook centralizado de estados del panel
│   ├── login/                     # Login
│   ├── registro/                  # Registro
│   └── api/                       # Endpoints backend
├── components/
│   ├── Navbar.js                  # Nav responsiva con auth state
│   ├── Footer.js                  # Footer rediseñado con acceso Staff y firma interactiva
│   ├── WhatsAppButton.js          # Botón flotante WhatsApp dinámico
│   ├── ScrollToTop.js            # Botón scroll to top
│   ├── TopAnnouncementBar.js     # Cintillo de anuncio (CSS Modules)
│   ├── AnnouncementBar.module.css # Estilos del cintillo
│   ├── ConfirmDialog.js           # Modal accesible de confirmación
│   └── ToastProvider.js          # Sistema de notificaciones
└── lib/
    ├── supabaseClient.js          # Cliente Supabase (con mock offline)
    ├── mockSupabase.js            # Mock offline para desarrollo (localStorage)
    └── toast.js                   # Pub/sub de notificaciones
```

---

## Configuración y Desarrollo Local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Variables de entorno
Crea `.env.local` en la raíz:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Modo demo local**: Si no configuras Supabase, la app usa un simulador local basado en `localStorage` con datos de ejemplo. Ideal para desarrollo sin backend. Usa `beast123` como contraseña y `admin@beasttraining.cl` o `user@beasttraining.cl` como email.

### 3. Iniciar servidor
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000).

### 4. Base de datos
Ejecuta `supabase_schema.sql` en el SQL Editor de Supabase para crear todas las tablas, RLS policies y datos de seed.

---

## Base de Datos (Supabase)

| Tabla | Descripción |
|---|---|
| `profiles` | Perfiles (rol, plan, workout, citas, estado) |
| `banners` | Hero carousel |
| `announcement_bar` | Cintillo de anuncios |
| `promo_codes` | Códigos de descuento |
| `announcements` | Comunicados Beast |
| `physical_progress` | Evaluaciones físicas (peso, grasa, musculo, perímetros) |
| `direct_messages` | Chat alumno-admin |
| `appointment_requests` | Solicitudes de cita |
| `blog_posts` | Artículos del blog |
| `plans` | Catálogo de planes de membresía |
| `about_info` | Configuración Nosotros, retratos, redes y WhatsApp |

---

## Cuentas Demo (modo local)

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | `admin@beasttraining.cl` | `beast123` |
| Alumno | `user@beasttraining.cl` | `beast123` |

---

## Licencia

Proyecto privado — Beast Training Concepción © 2026
