-- SCHEMA FOR BEAST TRAINING GYM DATABASE (SUPABASE)
-- Copy and paste this script into the Supabase SQL Editor to set up tables, triggers, and Row Level Security.

-- 1. Create Profile Roles Enum
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- 2. Create Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    age INTEGER,
    avatar_url TEXT,
    phone TEXT,
    role user_role DEFAULT 'user'::user_role,
    status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive')) NOT NULL,
    workout_plan TEXT,
    next_evaluation_date TEXT,
    proposed_slots TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Physical Progress Table
CREATE TABLE IF NOT EXISTS public.physical_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    weight NUMERIC(5, 2) NOT NULL, -- in kg
    body_fat NUMERIC(4, 2), -- in percentage
    muscle_mass NUMERIC(5, 2), -- in kg
    waist NUMERIC(5, 2), -- in cm
    chest NUMERIC(5, 2), -- in cm
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Banners Table
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    h3_tagline TEXT,
    text_align TEXT DEFAULT 'center' CHECK (text_align IN ('left', 'center', 'right')) NOT NULL,
    text_vertical_align TEXT DEFAULT 'center' CHECK (text_vertical_align IN ('top', 'center', 'bottom')) NOT NULL,
    image_url TEXT NOT NULL,
    image_position TEXT DEFAULT '50% 50%' NOT NULL,
    link_url TEXT,
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    author TEXT DEFAULT 'Beast Staff' NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Plans Table
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL, -- in CLP
    duration_months INTEGER DEFAULT 1 NOT NULL,
    category TEXT DEFAULT 'individual' CHECK (category IN ('individual', 'couple', 'family')) NOT NULL,
    features TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    popular BOOLEAN DEFAULT false NOT NULL,
    visible BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'priority')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Create Appointment Requests Table
CREATE TABLE IF NOT EXISTS public.appointment_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    requested_date DATE DEFAULT CURRENT_DATE NOT NULL,
    requested_time TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Trigger to automatically create a profile when a user registers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, status, workout_plan)
    VALUES (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', 'Nueva Bestia'),
        CASE 
            WHEN new.email = 'admin@beasttraining.cl' THEN 'admin'::user_role
            ELSE 'user'::user_role
        END,
        CASE
            WHEN new.email = 'admin@beasttraining.cl' THEN 'active' -- Admin is active by default
            ELSE 'inactive'
        END,
        'Rutina de adaptación: 3 series de 12 repeticiones en circuitos de acondicionamiento general.'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physical_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_requests ENABLE ROW LEVEL SECURITY;

-- 11. Setup RLS Policies

-- Helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'::user_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for profiles
CREATE POLICY "Allow public read for profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile or admins" ON public.profiles
    FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Policies for physical progress (Admin writes, User reads)
CREATE POLICY "Allow users to read their own progress" ON public.physical_progress
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Allow admins to manage progress records" ON public.physical_progress
    FOR ALL USING (public.is_admin());

-- Policies for Banners (Read is public, Write is Admin only)
CREATE POLICY "Allow public read for active banners" ON public.banners
    FOR SELECT USING (true);

CREATE POLICY "Allow admins to manage banners" ON public.banners
    FOR ALL USING (public.is_admin());

-- Policies for Blog Posts (Read is public, Write is Admin only)
CREATE POLICY "Allow public read for blog posts" ON public.blog_posts
    FOR SELECT USING (true);

CREATE POLICY "Allow admins to manage blog posts" ON public.blog_posts
    FOR ALL USING (public.is_admin());

-- Policies for Plans (Read is public, Write is Admin only)
CREATE POLICY "Allow public read for plans" ON public.plans
    FOR SELECT USING (true);

CREATE POLICY "Allow admins to manage plans" ON public.plans
    FOR ALL USING (public.is_admin());

-- Policies for Announcements (Read is public, Write is Admin only)
CREATE POLICY "Allow public read for announcements" ON public.announcements
    FOR SELECT USING (true);

CREATE POLICY "Allow admins to manage announcements" ON public.announcements
    FOR ALL USING (public.is_admin());

-- Policies for Appointment Requests (User manages their own, Admin manages all)
CREATE POLICY "Allow users to manage their own appointment requests" ON public.appointment_requests
    FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- 12. Seed Initial Plans Data
INSERT INTO public.plans (name, description, price, duration_months, category, features, popular, visible) VALUES
('Plan Mensual', 'Acceso ilimitado a todas nuestras clases y sala de musculación.', 35000, 1, 'individual', ARRAY['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física inicial', 'Casilleros y duchas'], false, true),
('Plan Trimestral', 'Nuestra opción recomendada para ver los primeros cambios reales.', 90000, 3, 'individual', ARRAY['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física mensual', 'Asesoría nutricional básica', 'Casilleros y duchas'], true, true),
('Plan Anual', 'Compromiso total con tu salud y rendimiento físico al mejor precio.', 320000, 12, 'individual', ARRAY['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física mensual', 'Asesoría nutricional avanzada', 'Casilleros y duchas', '1 polera oficial Beast Training'], false, true),
('Plan Dúo Mensual', 'Entrená con quien más quieras. Acceso completo para dos personas.', 55000, 1, 'couple', ARRAY['2 membresías incluidas', 'Clases ilimitadas para ambos', 'Acceso a musculación y cardio', 'Evaluación física inicial c/u', 'Casilleros y duchas'], false, true),
('Plan Dúo Trimestral', 'La mejor opción en pareja para ver resultados juntos.', 145000, 3, 'couple', ARRAY['2 membresías incluidas', 'Clases ilimitadas para ambos', 'Evaluación física mensual c/u', 'Asesoría nutricional básica', 'Casilleros y duchas'], true, true)
ON CONFLICT DO NOTHING;

-- 13. Seed Initial Banners
INSERT INTO public.banners (title, description, image_url, image_position, text_align, text_vertical_align, link_url, active) VALUES
('Saca la Bestia que Llevas Dentro', 'Entrenamiento funcional de alta intensidad, musculación y fuerza en el corazón de Concepción.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop', '50% 50%', 'left', 'center', '/planes', true),
('Promoción de Invierno', 'Suscríbete al Plan Trimestral y llévate gratis una sesión de evaluación nutricional personalizada.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop', '50% 50%', 'center', 'center', '/planes', true)
ON CONFLICT DO NOTHING;

-- 14. Seed Initial Blog Posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, image_url, author) VALUES
('5 Ejercicios Clave para Aumentar tu Fuerza', 'ejercicios-clave-aumentar-fuerza', 'Descubre los movimientos fundamentales que te ayudarán a construir una base de fuerza sólida y mejorar tu rendimiento.', 'La fuerza es la base de todas las cualidades físicas. En este artículo, detallaremos por qué la sentadilla, el peso muerto, el press de banca, el press militar y las dominadas deben ser el núcleo de tu rutina de entrenamiento...', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop', 'Coach Javier'),
('La Importancia de la Nutrición en el Entrenamiento Funcional', 'importancia-nutricion-entrenamiento-funcional', 'Entrenar duro es solo la mitad del trabajo. Descubre cómo alimentar tu cuerpo para potenciar la recuperación y el rendimiento.', '¿Sabías que tu progreso en el gimnasio depende directamente de lo que comes? Para entrenamientos de alta intensidad como el funcional o CrossFit, la nutrición deportiva juega un papel crucial...', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop', 'Nutri Camila')
ON CONFLICT DO NOTHING;

-- 15. Seed Initial Announcements
INSERT INTO public.announcements (title, content, priority) VALUES
('¡Atención: Feriado 16 de Julio!', 'Estimada comunidad, les informamos que el gimnasio permanecerá cerrado el próximo jueves 16 de Julio por feriado nacional. Retomamos actividades el viernes 17 en horario normal. ¡Sigan entrenando duro!', 'normal'),
('⚠️ Mantenimiento de la Zona de Fuerza', 'Hoy a las 14:00 hrs se realizará la mantención trimestral de las poleas y jaulas en la sala de musculación. Se mantendrá habilitada la zona de peso libre. Disculpen las molestias, es para mantener sus entrenamientos seguros.', 'priority')
ON CONFLICT DO NOTHING;

-- 16. Create Direct Messages Table
CREATE TABLE IF NOT EXISTS public.direct_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for direct_messages
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own received or sent messages" ON public.direct_messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert their own sent messages" ON public.direct_messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);


-- 12. Create Announcement Bar Table
CREATE TABLE IF NOT EXISTS public.announcement_bar (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    text TEXT NOT NULL,
    link_url TEXT,
    active BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.announcement_bar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for announcement bar" ON public.announcement_bar FOR SELECT USING (true);
CREATE POLICY "Allow admins to manage announcement bar" ON public.announcement_bar FOR ALL USING (public.is_admin());

-- 13. Create Promo Codes Table
CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_percent INTEGER NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for active promo codes" ON public.promo_codes FOR SELECT USING (true);
CREATE POLICY "Allow admins to manage promo codes" ON public.promo_codes FOR ALL USING (public.is_admin());

-- 17. Create About Info Table (for "Nosotros" page)
CREATE TABLE IF NOT EXISTS public.about_info (
    id TEXT PRIMARY KEY DEFAULT 'coach-settings',
    subtitle TEXT DEFAULT 'sobre nosotros',
    title TEXT NOT NULL DEFAULT 'Sobre Beast Training',
    bio_p1 TEXT DEFAULT '',
    bio_p2 TEXT DEFAULT '',
    image_url TEXT DEFAULT '/images/coach.png',
    badge_text TEXT DEFAULT 'Coach Fundador',
    spec_1 TEXT DEFAULT '',
    spec_2 TEXT DEFAULT '',
    spec_3 TEXT DEFAULT '',
    spec_4 TEXT DEFAULT '',
    coach_instagram TEXT DEFAULT '',
    coach_tiktok TEXT DEFAULT '',
    gym_instagram TEXT DEFAULT '',
    gym_facebook TEXT DEFAULT '',
    whatsapp_number TEXT DEFAULT '56948925193',
    show_coach_socials BOOLEAN DEFAULT true,
    show_gym_socials BOOLEAN DEFAULT true,
    image_position TEXT DEFAULT 'center',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.about_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for about_info" ON public.about_info FOR SELECT USING (true);
CREATE POLICY "Allow admins to manage about_info" ON public.about_info FOR ALL USING (public.is_admin());

INSERT INTO public.about_info (
    id, subtitle, title, bio_p1, bio_p2, image_url, badge_text, 
    spec_1, spec_2, spec_3, spec_4, 
    coach_instagram, coach_tiktok, gym_instagram, gym_facebook, 
    whatsapp_number, show_coach_socials, show_gym_socials, image_position
) VALUES (
    'coach-settings', 
    'sobre nosotros', 
    'Entrenamiento Inteligente, Resultados Reales', 
    'Hola, soy Javier. Fundador y Head Coach de Beast Training. Tras años de experiencia entrenando a deportistas y personas de todos los niveles en Concepción, fundé este espacio con un propósito: ofrecer un entrenamiento de fuerza y funcional verdaderamente personalizado.',
    'Aquí no eres un número más. Nos enfocamos en enseñarte la técnica correcta, planificar tus progresos de manera científica y acompañarte en cada paso para que superes tus límites de forma segura y constante.',
    '/images/coach.png', 
    'Coach Fundador',
    'Certificación CrossFit L-2', 
    'Preparación Física & Musculación (IPCH)', 
    'Especialista en Biomecánica aplicada al Fitness', 
    'Asesoría Nutricional Deportiva Avanzada',
    'https://instagram.com/', 
    'https://tiktok.com/', 
    'https://instagram.com/', 
    'https://facebook.com/',
    '56948925193', 
    true, 
    true, 
    'center'
) ON CONFLICT (id) DO NOTHING;


