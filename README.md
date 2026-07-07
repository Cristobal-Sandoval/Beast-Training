# Beast Training — Plataforma Web de Gestión de Gimnasio

Plataforma web completa para **Beast Training**, un gimnasio de alto rendimiento en Concepción, Chile. Incluye landing page pública, blog, venta de planes con MercadoPago Chile, y dashboards privados para alumnos y administradores.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Estilos | CSS Modules + Variables CSS + Glassmorphism |
| Tipografía | Google Fonts — Outfit (display) & Inter (sans) |
| Backend / Auth | [Supabase](https://supabase.com/) (PostgreSQL + Auth + RLS) |
| Pagos | MercadoPago Checkout Pro (Chile) |
| Íconos | [Lucide React](https://lucide.dev/) |
| SEO | Sitemap dinámico, JSON-LD (Article, Breadcrumb, SportsActivityLocation) |
| Performance | next/image, next/font, ISR-ready, tree-shaking |
| Deploy | [Vercel](https://vercel.com/) |

---

## Funcionalidades Principales

### Pagina Publica
- **Hero Carousel** con `next/image`, overlay gradiente, navegación por arrows + dots
- **Cintillo de anuncio** con marquee en mobile, configurable desde admin
- **Pilares de valor** con glassmorphism y scroll reveal
- **Blog preview** con las ultimas 2 publicaciones
- **CTA** a planes
- **WhatsApp flotante** (solo en paginas publicas)

### Planes & MercadoPago (Chile)
- 3 planes (Mensual, Trimestral, Anual) con feature lists
- Integración MercadoPago Checkout Pro con idempotency key
- Webhook con validación contra API de MercadoPago + merchant_orders
- Simulación local offline cuando no hay access token
- Códigos de descuento para primera compra

### Blog
- Listado con artículo destacado + grid secundario
- Articulo individual con `generateStaticParams` (SSG)
- Schema JSON-LD `Article` + `BreadcrumbList`
- Open Graph, Twitter Cards, meta tags dinámicos

### Dashboard Alumno (`/dashboard`)
- Estado de membresía y saludo personalizado
- Comunicados Beast con prioridad (normal/urgente)
- Estadísticas: peso, % grasa, masa muscular vs mes anterior
- Gráficos SVG animados responsivos
- Historial de evaluaciones en tabla scrolleable
- Plan de entrenamiento
- Chat directo con el coach
- Selección de cita entre slots propuestos

### Panel Admin (`/admin`)
- Gestión de alumnos (activar/desactivar, editar perfil)
- Editor de banners del hero
- Editor de cintillo de anuncio
- Códigos promo CRUD
- Evaluaciones físicas por alumno
- Comunicados Beast (normal/urgente)
- Sistema de citas (proponer slots)
- Chat con alumnos

---

## Mejoras Recientes (Julio 2026)

### Rendimiento
- Hero images migradas de CSS `background-image` a `next/image` con `fill`, `priority` y `sizes`
- Fuentes reducidas: Outfit 4 pesos, Inter 4 pesos (antes 6 y 5 respectivamente)
- MockSupabase extraído a archivo separado para mejor tree-shaking en producción
- Idempotency key en requests a MercadoPago

### SEO
- Sitemap dinámico que incluye blog posts desde Supabase
- `generateStaticParams` para blog posts pre-renderizados (SSG)
- Schema JSON-LD `Article` + `BreadcrumbList` en blog detail
- Canonical URLs absolutas, `hreflang="es-CL"`, `theme-color`
- Meta `article:published_time`, `article:author`, `robots` por pagina

### UX/UI
- Carousel dots de navegación + touch targets de 44px en arrows
- Confirm dialog al cerrar sesión
- `prefers-reduced-motion` respetado globalmente
- Empty states con iconos en dashboard (chat, plan de trabajo)
- Feedback táctil (`:active` scale) en dispositivos touch
- Footer con links `tel:` y `mailto:`
- Simulación MercadoPago condicional según modo (local vs producción)

### Pagos (MercadoPago Chile)
- Tabla `payments` agregada a `supabase_schema.sql` con RLS
- Webhook valida contra `merchant_orders` API (seguridad)
- Almacenamiento de pagos aprobados en Supabase + activación automática de perfil

### Accesibilidad
- `prefers-reduced-motion` desactiva animaciones completas
- Skip-to-content link, roles ARIA, etiquetas en botones
- Contraste de color, focus-visible outlines

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── page.js                    # Landing page
│   ├── sitemap.js                 # Sitemap dinámico (blog + estáticas)
│   ├── layout.js                  # Layout raíz
│   ├── globals.css                # Variables, utilidades, prefers-reduced-motion
│   ├── blog/                      # Blog list + [slug]/ detail
│   ├── planes/                    # Planes + MercadoPago checkout
│   ├── dashboard/                 # Dashboard alumno
│   ├── admin/                     # Panel admin
│   ├── login/                     # Login
│   ├── registro/                  # Registro
│   └── api/
│       ├── checkout/              # POST crear preferencia MP
│       └── webhook/mercadopago/   # POST webhook MP
├── components/
│   ├── Navbar.js                  # Nav responsiva con auth state
│   ├── Footer.js                  # Footer con contacto
│   ├── WhatsAppButton.js          # Botón flotante WhatsApp
│   ├── ScrollToTop.js            # Botón scroll to top
│   ├── TopAnnouncementBar.js     # Cintillo de anuncio
│   └── ToastProvider.js          # Sistema de notificaciones
└── lib/
    ├── supabaseClient.js          # Cliente Supabase
    ├── mockSupabase.js            # Mock offline para desarrollo
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
MERCADOPAGO_ACCESS_TOKEN=<tu-access-token>
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
| `profiles` | Perfiles (rol, plan, workout, citas) |
| `banners` | Hero carousel |
| `announcement_bar` | Cintillo de anuncios |
| `promo_codes` | Códigos de descuento |
| `announcements` | Comunicados Beast |
| `physical_progress` | Evaluaciones físicas (peso, grasa, musculo) |
| `direct_messages` | Chat alumno-admin |
| `appointment_requests` | Solicitudes de cita |
| `blog_posts` | Artículos del blog |
| `plans` | Planes de membresía |
| `payments` | Pagos registrados via webhook MP |

---

## Cuentas Demo (modo local)

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | `admin@beasttraining.cl` | `beast123` |
| Alumno | `user@beasttraining.cl` | `beast123` |

---

## Mobile-First

- Touch targets mínimos de 44px
- Carousel con dots y arrows touch-friendly
- Dashboard con tablas scrolleables horizontalmente
- Gráficos SVG responsivos via `viewBox`
- Menú hamburguesa con animación slide-in
- Cintillo con marquee automático en pantallas <= 640px
- `prefers-reduced-motion` respetado

---

## Deploy en Vercel

1. Conecta el repositorio a Vercel
2. Añade las variables de entorno
3. Vercel detecta Next.js automáticamente
4. Webhook MP debe apuntar a `https://tu-dominio.vercel.app/api/webhook/mercadopago`

---

## Licencia

Proyecto privado — Beast Training Concepcion © 2026
