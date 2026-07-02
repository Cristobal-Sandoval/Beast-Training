# 🦁 Beast Training — Plataforma Web & App de Gestión de Gimnasio

Plataforma web completa para **Beast Training**, un gimnasio de alto rendimiento en Concepción, Chile. Incluye landing page pública, blog, venta de planes, y dashboards privados para alumnos y administradores.

---

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Estilos | CSS Modules + Variables CSS globales |
| Tipografía | Google Fonts — Outfit & Inter |
| Backend / Auth | [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage) |
| Pagos | MercadoPago Checkout Pro |
| Íconos | [Lucide React](https://lucide.dev/) |
| Deploy recomendado | [Vercel](https://vercel.com/) |

---

## ✨ Funcionalidades Principales

### 🌐 Página Pública
- **Hero Carousel** — banners totalmente editables desde el panel de admin (imagen, título H1/H2/H3, alineación, color, link)
- **Cintillo de anuncio flotante** — con animación marquee en mobile, configurable desde el admin
- **Sección "¿Por qué entrenar con nosotros?"** — pilares de valor con iconos
- **Sección Blog** — artículo destacado en card grande + grilla de posts secundarios
- **CTA de conversión** — sección de llamada a la acción con link a planes
- **Botón WhatsApp flotante** — visible solo en páginas públicas (oculto en dashboards)

### 📋 Planes & Pagos
- Página de planes con precios, características y botones de compra
- Integración con **MercadoPago Checkout Pro** (`/api/checkout`)
- Webhook de confirmación de pagos (`/api/webhook/mercadopago`)
- **Códigos de descuento** para primera compra (ej: `BEAST20` = 20% off), administrables desde el admin

### 📰 Blog
- Listado con artículo destacado prominente + grid secundario
- Página de artículo individual (`/blog/[slug]`)
- Sin buscador (diseño limpio y editorial)

### 👤 Dashboard del Alumno (`/dashboard`)
- Saludo personalizado + estado de membresía
- **Comunicados Beast** al inicio (avisos del admin)
- Estadísticas: peso actual, % grasa, masa muscular vs evaluación anterior
- **Gráficos SVG animados** de evolución de peso y grasa corporal
- **Historial de evaluaciones** en tabla horizontal scrolleable
- Plan de entrenamiento del alumno
- **Chat directo con el coach**
- **Selección de cita** — el admin propone 3 fechas/horarios disponibles, el alumno elige uno

### 🛡️ Dashboard Admin (`/admin`)
- Gestión de usuarios: ver perfiles, activar/desactivar, asignar planes de entrenamiento
- **Editor de banners del hero** — crear, editar y eliminar banners con control de texto, imagen, alineación y link
- **Editor del cintillo de anuncio** — texto, link y activación/desactivación
- **Gestión de códigos promo** — crear, editar y eliminar cupones de descuento
- **Registro de evaluaciones físicas** — peso, % grasa, masa muscular, cintura por alumno
- **Comunicados Beast** — publicar anuncios para los alumnos (prioridad normal/urgente)
- **Sistema de citas** — proponer hasta 3 slots de fecha/hora disponibles por alumno
- **Chat con alumnos** — mensajería individual privada

---

## 🗂️ Estructura del Proyecto

```
src/
├── app/
│   ├── page.js                  # Landing page principal
│   ├── layout.js                # Layout raíz (Navbar, Footer, WhatsApp, Cintillo)
│   ├── globals.css              # Variables CSS globales y utilidades
│   ├── blog/                    # Listado y artículos del blog
│   ├── planes/                  # Página de planes y precios
│   ├── dashboard/               # Dashboard privado del alumno
│   ├── admin/                   # Panel de administración
│   ├── login/                   # Login y registro
│   ├── registro/                # Formulario de registro
│   └── api/
│       ├── checkout/            # Endpoint MercadoPago Checkout
│       └── webhook/mercadopago/ # Webhook de confirmación de pago
├── components/
│   ├── Navbar.js                # Barra de navegación responsiva
│   ├── Footer.js                # Pie de página
│   ├── WhatsAppButton.js        # Botón flotante de WhatsApp (solo en páginas públicas)
│   └── TopAnnouncementBar.js   # Cintillo de anuncio con marquee mobile
└── lib/
    └── supabaseClient.js        # Cliente Supabase + mock local para desarrollo
```

---

## 🛠️ Configuración y Desarrollo Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/Cristobal-Sandoval/Beast-Training.git
cd beast-training
npm install
```

### 2. Variables de entorno
Crea un archivo `.env.local` en la raíz:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
MERCADOPAGO_ACCESS_TOKEN=<tu-access-token>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Modo demo local**: Si no configuras Supabase, la app usa un simulador local basado en `localStorage` con datos de ejemplo precargados. Ideal para desarrollo sin backend.

### 3. Iniciar servidor de desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🗄️ Base de Datos (Supabase)

El archivo `supabase_schema.sql` contiene el esquema completo de la base de datos. Ejecutarlo en el **SQL Editor de Supabase** crea las siguientes tablas:

| Tabla | Descripción |
|---|---|
| `profiles` | Perfiles de usuarios (rol, plan, datos físicos) |
| `banners` | Banners del hero carousel |
| `announcement_bar` | Configuración del cintillo de anuncios |
| `promo_codes` | Códigos de descuento para primera compra |
| `announcements` | Comunicados Beast para alumnos |
| `evaluations` | Historial de evaluaciones físicas por usuario |
| `messages` | Mensajes del chat privado alumno-admin |
| `appointments` | Citas de evaluación programadas |
| `blog_posts` | Artículos del blog |

---

## 🔐 Cuentas Demo (modo local)

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | `admin@beasttraining.cl` | `admin123` |
| Alumno | `user@beasttraining.cl` | `user123` |

---

## 📱 Mobile-First

La interfaz está optimizada para Android e iOS:
- Cintillo con animación marquee automática en pantallas ≤ 640px
- Dashboard con tablas scrolleables horizontalmente
- Gráficos SVG responsivos sin desbordamiento
- Botones con área mínima táctil de 44px
- Navegación con menú hamburguesa en mobile

---

## 🚀 Deploy en Vercel

1. Conecta el repositorio a Vercel
2. Añade las variables de entorno en el panel de Vercel
3. Vercel detecta automáticamente Next.js — sin configuración adicional
4. El webhook de MercadoPago debe apuntar a `https://tu-dominio.vercel.app/api/webhook/mercadopago`

---

## 📄 Licencia

Proyecto privado — Beast Training Concepción © 2026
