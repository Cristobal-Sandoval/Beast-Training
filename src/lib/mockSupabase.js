export default class MockSupabase {
  constructor() {
    this.auth = {
      listeners: new Set(),

      async getSession() {
        if (typeof window === 'undefined') return { data: { session: null }, error: null };
        const sessionStr = localStorage.getItem('beast_session');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          return { data: { session }, error: null };
        }
        return { data: { session: null }, error: null };
      },

      onAuthStateChange(callback) {
        this.listeners.add(callback);
        this.getSession().then(({ data: { session } }) => {
          callback('SIGNED_IN', session);
        });
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                this.listeners.delete(callback);
              }
            }
          }
        };
      },

      async signInWithPassword({ email, password }) {
        if (password !== 'beast123') {
          return { data: null, error: { message: 'Contraseña incorrecta (Usa beast123 para el demo)' } };
        }

        const isAdmin = email === 'admin@beasttraining.cl';
        const userId = isAdmin ? 'admin-uuid-123' : 'user-uuid-456';

        const session = {
          user: { id: userId, email },
          access_token: 'mock-token',
        };

        localStorage.setItem('beast_session', JSON.stringify(session));

        if (typeof window !== 'undefined') {
          const profilesKey = 'beast_profiles_list';
          let profiles = JSON.parse(localStorage.getItem(profilesKey) || '[]');

          const userExists = profiles.some(p => p.id === userId);
          if (!userExists) {
            profiles.push({
              id: userId,
              email,
              full_name: isAdmin ? 'Admin Beast' : 'Usuario Beast',
              age: isAdmin ? null : 28,
              phone: isAdmin ? null : '+56987654321',
              role: isAdmin ? 'admin' : 'user',
              status: isAdmin ? 'active' : 'inactive',
              workout_plan: 'Rutina de adaptación: 3 series de 12 repeticiones en circuitos de acondicionamiento general.'
            });
            localStorage.setItem(profilesKey, JSON.stringify(profiles));
          }
        }

        this.notify('SIGNED_IN', session);
        return { data: { session }, error: null };
      },

      async signUp({ email, password, options }) {
        const userId = 'user-uuid-' + Math.random().toString(36).substr(2, 9);

        if (typeof window !== 'undefined') {
          const profilesKey = 'beast_profiles_list';
          let profiles = JSON.parse(localStorage.getItem(profilesKey) || '[]');

          profiles.push({
            id: userId,
            email,
            full_name: options?.data?.full_name || 'Nueva Bestia',
            age: 20,
            phone: '+56912345678',
            role: 'user',
            status: 'inactive',
            workout_plan: 'Rutina de adaptación: 3 series de 12 repeticiones en circuitos de acondicionamiento general.'
          });
          localStorage.setItem(profilesKey, JSON.stringify(profiles));
        }

        return { data: { user: { id: userId, email } }, error: null };
      },

      async signOut() {
        localStorage.removeItem('beast_session');
        this.notify('SIGNED_OUT', null);
        return { error: null };
      },

      notify(event, session) {
        this.listeners.forEach(cb => cb(event, session));
      }
    };

    this.auth.getSession = this.auth.getSession.bind(this.auth);
    this.auth.onAuthStateChange = this.auth.onAuthStateChange.bind(this.auth);
    this.auth.signInWithPassword = this.auth.signInWithPassword.bind(this.auth);
    this.auth.signUp = this.auth.signUp.bind(this.auth);
    this.auth.signOut = this.auth.signOut.bind(this.auth);
    this.auth.notify = this.auth.notify.bind(this.auth);
  }

  from(table) {
    const query = {
      _queryType: 'select',
      _eqField: null,
      _eqValue: null,
      _orderField: null,
      _orderAsc: true,
      _limit: null,
      _records: null,
      _single: false,
      _updateData: null,

      select(fields) {
        if (this._queryType !== 'insert' && this._queryType !== 'update' && this._queryType !== 'delete') {
          this._queryType = 'select';
        }
        return this;
      },
      eq(field, value) {
        this._eqField = field;
        this._eqValue = value;
        return this;
      },
      single() {
        this._single = true;
        return this;
      },
      order(field, options) {
        this._orderField = field;
        this._orderAsc = options?.ascending ?? true;
        return this;
      },
      limit(num) {
        this._limit = num;
        return this;
      },
      insert(records) {
        this._queryType = 'insert';
        this._records = records;
        return this;
      },
      update(updateData) {
        this._queryType = 'update';
        this._updateData = updateData;
        return this;
      },
      delete() {
        this._queryType = 'delete';
        return this;
      },

      async then(onfulfilled) {
        if (typeof window === 'undefined') {
          return onfulfilled({ data: [], error: null });
        }

        let data = [];
        let error = null;

        try {
          if (table === 'profiles') {
            const profilesKey = 'beast_profiles_list';
            let profiles = JSON.parse(localStorage.getItem(profilesKey) || '[]');

            if (profiles.length === 0) {
              profiles = [
                { id: 'admin-uuid-123', email: 'admin@beasttraining.cl', full_name: 'Admin Beast', role: 'admin', status: 'active', workout_plan: 'Rutina del Admin.' },
                { id: 'user-uuid-456', email: 'user@beasttraining.cl', full_name: 'Diego Valenzuela', age: 26, phone: '+56987654321', role: 'user', status: 'active', workout_plan: 'Hipertrofia - Pecho/Bíceps:\n• Press Banca Plano: 4x8\n• Press Inclinado Mancuernas: 4x10\n• Aperturas Polea: 3x12\n• Curl con Barra: 4x10\n• Curl Martillo: 3x12\n• Cardio HIIT: 15 minutos en trotadora', proposed_slots: 'Lunes 7 de Julio (10:00), Miércoles 9 de Julio (15:30), Viernes 11 de Julio (18:00)', next_evaluation_date: null }
              ];
              localStorage.setItem(profilesKey, JSON.stringify(profiles));
            }

            if (this._queryType === 'update') {
              if (this._eqField === 'id') {
                profiles = profiles.map(p => {
                  if (p.id === this._eqValue) {
                    return { ...p, ...this._updateData };
                  }
                  return p;
                });
                localStorage.setItem(profilesKey, JSON.stringify(profiles));
                data = profiles.find(p => p.id === this._eqValue);
              }
            } else {
              if (this._eqField === 'id') {
                data = profiles.find(p => p.id === this._eqValue) || null;
              } else {
                data = profiles;
              }
              if (this._single && Array.isArray(data)) {
                data = data[0] || null;
              }
            }
          } else if (table === 'physical_progress') {
            const storedKey = 'beast_physical_progress';
            let progress = JSON.parse(localStorage.getItem(storedKey) || '[]');

            if (progress.length === 0) {
              progress = [
                { id: '1', user_id: 'user-uuid-456', date: '2026-05-01', weight: 83.2, body_fat: 22.5, muscle_mass: 34.8, waist: 93, chest: 104 },
                { id: '2', user_id: 'user-uuid-456', date: '2026-06-01', weight: 81.5, body_fat: 21.2, muscle_mass: 35.5, waist: 90, chest: 105 },
                { id: '3', user_id: 'user-uuid-456', date: '2026-07-01', weight: 79.8, body_fat: 19.5, muscle_mass: 36.4, waist: 87, chest: 106 }
              ];
              localStorage.setItem(storedKey, JSON.stringify(progress));
            }

            if (this._queryType === 'insert') {
              const newRecords = this._records.map(r => ({ id: Math.random().toString(), ...r }));
              progress = [...progress, ...newRecords];
              localStorage.setItem(storedKey, JSON.stringify(progress));
              data = this._single ? newRecords[0] : newRecords;
            } else if (this._queryType === 'delete') {
              if (this._eqField === 'id') {
                progress = progress.filter(p => p.id !== this._eqValue);
                localStorage.setItem(storedKey, JSON.stringify(progress));
                data = progress;
              }
            } else {
              data = progress;
              if (this._eqField === 'user_id') {
                data = progress.filter(p => p.user_id === this._eqValue);
              }
              if (this._orderField === 'date') {
                data.sort((a, b) => new Date(a.date) - new Date(b.date));
              }
              if (this._single && Array.isArray(data)) {
                data = data[0] || null;
              }
            }
          } else if (table === 'banners') {
            const storedKey = 'beast_banners';
            let banners = JSON.parse(localStorage.getItem(storedKey) || '[]');

            if (banners.length === 0) {
              banners = [
                { id: 'b1', title: 'Saca la Bestia que Llevas Dentro', description: 'Entrenamiento funcional de alta intensidad, musculación y fuerza en el corazón de Concepción.', h3_tagline: 'beast training concepción', text_align: 'left', image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop', link_url: '/planes', active: true },
                { id: 'b2', title: 'Desafía Tus Límites Diariamente', description: 'Clases de CrossFit, HIIT y planes personalizados orientados a tus objetivos.', h3_tagline: 'beast training concepción', text_align: 'center', image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop', link_url: '/planes', active: true }
              ];
              localStorage.setItem(storedKey, JSON.stringify(banners));
            }

            if (this._queryType === 'insert') {
              const newBanners = this._records.map(b => ({ id: Math.random().toString(), ...b }));
              banners = [...newBanners, ...banners];
              localStorage.setItem(storedKey, JSON.stringify(banners));
              data = this._single ? newBanners[0] : newBanners;
            } else if (this._queryType === 'update') {
              banners = banners.map(b => b.id === this._eqValue ? { ...b, ...this._updateData } : b);
              localStorage.setItem(storedKey, JSON.stringify(banners));
              data = banners.filter(b => b.id === this._eqValue);
            } else if (this._queryType === 'delete') {
              if (this._eqField === 'id') {
                banners = banners.filter(b => b.id !== this._eqValue);
                localStorage.setItem(storedKey, JSON.stringify(banners));
                data = banners;
              }
            } else {
              data = banners;
              if (this._single) {
                data = data[0] || null;
              }
            }
          } else if (table === 'blog_posts') {
            const storedKey = 'beast_blog_posts';
            let posts = JSON.parse(localStorage.getItem(storedKey) || '[]');

            if (posts.length === 0) {
              posts = [
                { id: 'p1', title: '5 Ejercicios Clave para Aumentar tu Fuerza', content: `La fuerza es la base de todas las cualidades físicas...`, excerpt: 'Descubre los movimientos fundamentales que te ayudarán a construir una base de fuerza sólida y mejorar tu rendimiento.', slug: 'ejercicios-clave-aumentar-fuerza', image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop', published_at: '2026-07-01T12:00:00Z', author: 'Coach Javier' },
                { id: 'p2', title: 'La Importancia de la Nutrición en el Entrenamiento Funcional', content: `Entrenar intensamente es solo una parte de la ecuación...`, excerpt: 'Entrenar duro es solo la mitad del trabajo. Descubre cómo alimentar tu cuerpo para potenciar la recuperación.', slug: 'importancia-nutricion-entrenamiento-funcional', image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop', published_at: '2026-06-28T12:00:00Z', author: 'Nutri Camila' }
              ];
              localStorage.setItem(storedKey, JSON.stringify(posts));
            }

            if (this._queryType === 'insert') {
              const newPosts = this._records.map(p => ({ id: Math.random().toString(), ...p }));
              posts = [...newPosts, ...posts];
              localStorage.setItem(storedKey, JSON.stringify(posts));
              data = this._single ? newPosts[0] : newPosts;
            } else if (this._queryType === 'delete') {
              if (this._eqField === 'id') {
                posts = posts.filter(p => p.id !== this._eqValue);
                localStorage.setItem(storedKey, JSON.stringify(posts));
                data = posts;
              }
            } else {
              data = posts;
              if (this._eqField === 'slug') {
                data = posts.find(p => p.slug === this._eqValue) || null;
              }
              if (this._single && Array.isArray(data)) {
                data = data[0] || null;
              }
            }
          } else if (table === 'announcements') {
            const storedKey = 'beast_announcements';
            let announcements = JSON.parse(localStorage.getItem(storedKey) || '[]');

            if (announcements.length === 0) {
              announcements = [
                { id: 'a1', title: '¡Atención: Feriado 16 de Julio!', content: 'Estimada comunidad, les informamos que el gimnasio permanecerá cerrado el próximo jueves 16 de Julio por feriado nacional. Retomamos actividades el viernes 17 en horario normal. ¡Sigan entrenando duro!', priority: 'normal', created_at: '2026-07-01T12:00:00Z' },
                { id: 'a2', title: '⚠️ Mantenimiento de la Zona de Fuerza', content: 'Hoy a las 14:00 hrs se realizará la mantención trimestral de las poleas y jaulas en la sala de musculación. Se mantendrá habilitada la zona de peso libre. Disculpen las molestias, es para mantener sus entrenamientos seguros.', priority: 'priority', created_at: '2026-07-02T10:00:00Z' }
              ];
              localStorage.setItem(storedKey, JSON.stringify(announcements));
            }

            if (this._queryType === 'insert') {
              const newAnn = this._records.map(a => ({ id: Math.random().toString(), created_at: new Date().toISOString(), ...a }));
              announcements = [...newAnn, ...announcements];
              localStorage.setItem(storedKey, JSON.stringify(announcements));
              data = this._single ? newAnn[0] : newAnn;
            } else if (this._queryType === 'delete') {
              if (this._eqField === 'id') {
                announcements = announcements.filter(a => a.id !== this._eqValue);
                localStorage.setItem(storedKey, JSON.stringify(announcements));
                data = announcements;
              }
            } else {
              data = announcements;
              if (this._single && Array.isArray(data)) {
                data = data[0] || null;
              }
            }
          } else if (table === 'appointment_requests') {
            const storedKey = 'beast_appointment_requests';
            let appointments = JSON.parse(localStorage.getItem(storedKey) || '[]');

            if (this._queryType === 'insert') {
              const newAppt = this._records.map(a => ({ id: Math.random().toString(), status: 'pending', created_at: new Date().toISOString(), ...a }));
              appointments = [...newAppt, ...appointments];
              localStorage.setItem(storedKey, JSON.stringify(appointments));
              data = this._single ? newAppt[0] : newAppt;
            } else if (this._queryType === 'update') {
              if (this._eqField === 'id') {
                appointments = appointments.map(a => {
                  if (a.id === this._eqValue) {
                    return { ...a, ...this._updateData };
                  }
                  return a;
                });
                localStorage.setItem(storedKey, JSON.stringify(appointments));
                data = appointments.find(a => a.id === this._eqValue);
              }
            } else {
              data = appointments;
              if (this._eqField === 'user_id') {
                data = appointments.filter(a => a.user_id === this._eqValue);
              }
              if (this._single && Array.isArray(data)) {
                data = data[0] || null;
              }
            }
          } else if (table === 'direct_messages') {
            const storedKey = 'beast_direct_messages';
            let messages = [];
            try {
              const raw = localStorage.getItem(storedKey);
              messages = raw ? JSON.parse(raw) : [];
              if (!Array.isArray(messages)) messages = [];
            } catch (e) {
              messages = [];
            }

            if (messages.length === 0) {
              messages = [
                { id: 'dm1', sender_id: 'admin-uuid-123', receiver_id: 'user-uuid-456', content: '¡Hola Diego! Bienvenido a Beast Training. Aquí podré ir subiendo tus rutinas y evaluaciones de progreso físico. Si tienes dudas con tus ejercicios o plan alimenticio, escríbeme por esta bandeja y te responderé en breve. ¡A entrenar!', created_at: '2026-07-01T12:00:00Z' }
              ];
              localStorage.setItem(storedKey, JSON.stringify(messages));
            } else {
              const uniqueMap = new Map();
              messages.forEach(m => {
                if (m && m.id) uniqueMap.set(m.id, m);
              });
              const cleaned = Array.from(uniqueMap.values());
              if (cleaned.length !== messages.length) {
                messages = cleaned;
                localStorage.setItem(storedKey, JSON.stringify(messages));
              }
            }

            if (this._queryType === 'insert') {
              const newMsg = this._records.map(m => ({ id: Math.random().toString(), created_at: new Date().toISOString(), ...m }));
              messages = [...messages, ...newMsg];
              localStorage.setItem(storedKey, JSON.stringify(messages));
              data = this._single ? newMsg[0] : newMsg;
            } else {
              data = messages;
              if (this._eqField === 'sender_id') {
                data = messages.filter(m => m.sender_id === this._eqValue);
              } else if (this._eqField === 'receiver_id') {
                data = messages.filter(m => m.receiver_id === this._eqValue);
              }
              data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
              if (this._single && Array.isArray(data)) {
                data = data[0] || null;
              }
            }
          } else if (table === 'announcement_bar') {
            const storedKey = 'beast_announcement_bar';
            let bars = [];
            try {
              const raw = localStorage.getItem(storedKey);
              bars = raw ? JSON.parse(raw) : [];
              if (!Array.isArray(bars)) bars = [];
            } catch (e) {
              bars = [];
            }

            if (bars.length === 0) {
              bars = [{ id: 'ab1', text: '¡PROMO INAUGURACIÓN: 20% DE DESCUENTO EN TU PRIMERA MEMBRESÍA CON EL CÓDIGO BEAST20!', link_url: '/planes', active: true }];
              localStorage.setItem(storedKey, JSON.stringify(bars));
            }

            if (this._queryType === 'insert') {
              const newBar = this._records.map(b => ({ id: Math.random().toString(), created_at: new Date().toISOString(), ...b }));
              if (newBar[0].active) {
                bars = bars.map(b => ({ ...b, active: false }));
              }
              bars = [...newBar, ...bars];
              localStorage.setItem(storedKey, JSON.stringify(bars));
              data = this._single ? newBar[0] : newBar;
            } else if (this._queryType === 'update') {
              bars = bars.map(b => b.id === this._eqValue ? { ...b, ...this._updateData } : b);
              if (this._updateData && this._updateData.active) {
                bars = bars.map(b => b.id === this._eqValue ? b : { ...b, active: false });
              }
              localStorage.setItem(storedKey, JSON.stringify(bars));
              data = bars;
            } else if (this._queryType === 'delete') {
              bars = bars.filter(b => b.id !== this._eqValue);
              localStorage.setItem(storedKey, JSON.stringify(bars));
              data = bars;
            } else {
              data = bars;
              if (this._eqField === 'active') {
                data = bars.filter(b => b.active === this._eqValue);
              }
              if (this._single && Array.isArray(data)) {
                data = data[0] || null;
              }
            }
          } else if (table === 'promo_codes') {
            const storedKey = 'beast_promo_codes';
            let codes = [];
            try {
              const raw = localStorage.getItem(storedKey);
              codes = raw ? JSON.parse(raw) : [];
              if (!Array.isArray(codes)) codes = [];
            } catch (e) {
              codes = [];
            }

            if (codes.length === 0) {
              codes = [
                { id: 'pc1', code: 'BEAST20', discount_percent: 20, active: true },
                { id: 'pc2', code: 'BEAST50', discount_percent: 50, active: true }
              ];
              localStorage.setItem(storedKey, JSON.stringify(codes));
            }

            if (this._queryType === 'insert') {
              const newCodes = this._records.map(c => ({ id: Math.random().toString(), code: c.code.toUpperCase(), created_at: new Date().toISOString(), ...c }));
              codes = [...newCodes, ...codes];
              localStorage.setItem(storedKey, JSON.stringify(codes));
              data = this._single ? newCodes[0] : newCodes;
            } else if (this._queryType === 'delete') {
              codes = codes.filter(c => c.id !== this._eqValue);
              localStorage.setItem(storedKey, JSON.stringify(codes));
              data = codes;
            } else {
              data = codes;
              if (this._eqField === 'code') {
                data = codes.filter(c => c.code.toUpperCase() === this._eqValue.toUpperCase());
              }
              if (this._single && Array.isArray(data)) {
                data = data[0] || null;
              }
            }
          } else if (table === 'plans') {
            const storedKey = 'beast_plans_list';
            let storedPlans = JSON.parse(localStorage.getItem(storedKey) || '[]');
            
            if (storedPlans.length === 0) {
              storedPlans = [
                {
                  id: 'p1_ind',
                  name: 'Mensual Individual',
                  category: 'individual',
                  description: 'Acceso ilimitado a todas nuestras clases y sala de musculación.',
                  price: 35000,
                  duration_months: 1,
                  features: ['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física inicial', 'Casilleros y duchas'],
                  popular: false,
                },
                {
                  id: 'p2_ind',
                  name: 'Trimestral Individual',
                  category: 'individual',
                  description: 'Nuestra opción recomendada para ver los primeros cambios reales.',
                  price: 90000,
                  duration_months: 3,
                  features: ['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física mensual', 'Asesoría nutricional básica', 'Casilleros y duchas'],
                  popular: true,
                },
                {
                  id: 'p3_ind',
                  name: 'Anual Individual',
                  category: 'individual',
                  description: 'Compromiso total con tu salud y rendimiento físico al mejor precio.',
                  price: 320000,
                  duration_months: 12,
                  features: ['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física mensual', 'Asesoría nutricional avanzada', 'Casilleros y duchas', '1 polera oficial Beast Training'],
                  popular: false,
                },
                {
                  id: 'p1_duo',
                  name: 'Mensual Dúo',
                  category: 'duo',
                  description: 'Entrena acompañado. Acceso ilimitado para ti y tu partner.',
                  price: 60000,
                  duration_months: 1,
                  features: ['Clases ilimitadas para ambos', 'Acceso a musculación y cardio', 'Evaluación física inicial individual', 'Casilleros y duchas'],
                  popular: false,
                },
                {
                  id: 'p2_duo',
                  name: 'Trimestral Dúo',
                  category: 'duo',
                  description: 'La mejor opción en parejas para consolidar hábitos saludables.',
                  price: 160000,
                  duration_months: 3,
                  features: ['Clases ilimitadas para ambos', 'Acceso a musculación y cardio', 'Evaluación física mensual individual', 'Asesoría nutricional básica para ambos', 'Casilleros y duchas'],
                  popular: true,
                },
                {
                  id: 'p3_duo',
                  name: 'Anual Dúo',
                  category: 'duo',
                  description: 'Ahorro masivo y compromiso a largo plazo entrenando de a dos.',
                  price: 580000,
                  duration_months: 12,
                  features: ['Clases ilimitadas para ambos', 'Acceso a musculación y cardio', 'Evaluación física mensual individual', 'Asesoría nutricional avanzada para ambos', 'Casilleros y duchas', '2 poleras oficiales Beast Training'],
                  popular: false,
                }
              ];
              localStorage.setItem(storedKey, JSON.stringify(storedPlans));
            }
            data = storedPlans;
            if (this._orderField === 'price') {
              data.sort((a, b) => a.price - b.price);
            }
          } else if (table === 'about_info') {
            const storedKey = 'beast_about_info';
            let info = JSON.parse(localStorage.getItem(storedKey) || 'null');
            
            if (!info) {
              info = {
                id: 'coach-settings',
                subtitle: 'sobre nosotros',
                title: 'Entrenamiento Inteligente, Resultados Reales',
                bio_p1: 'Hola, soy Javier. Fundador y Head Coach de Beast Training. Tras años de experiencia entrenando a deportistas y personas de todos los niveles en Concepción, fundé este espacio con un propósito: ofrecer un entrenamiento de fuerza y funcional verdaderamente personalizado.',
                bio_p2: 'Aquí no eres un número más. Nos enfocamos en enseñarte la técnica correcta, planificar tus progresos de manera científica y acompañarte en cada paso para que superes tus límites de forma segura y constante.',
                image_url: '/images/coach.png',
                badge_text: 'Coach Fundador',
                spec_1: 'Certificación CrossFit L-2',
                spec_2: 'Preparación Física & Musculación (IPCH)',
                spec_3: 'Especialista en Biomecánica aplicada al Fitness',
                spec_4: 'Asesoría Nutricional Deportiva Avanzada'
              };
              localStorage.setItem(storedKey, JSON.stringify(info));
            }

            if (this._queryType === 'update') {
              info = { ...info, ...this._updateData };
              localStorage.setItem(storedKey, JSON.stringify(info));
              data = info;
            } else {
              data = info;
            }
          }
        } catch (err) {
          error = err;
        }

        return onfulfilled({ data, error });
      }
    };

    return query;
  }
}
