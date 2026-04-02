-- ============================================================
-- Elysian Project — Supabase Database Schema
-- Jalankan file ini di: Supabase Dashboard → SQL Editor
-- ============================================================


-- ─────────────────────────────────────────────
-- 1. SITE SETTINGS
-- Key-value store untuk konfigurasi global site
-- ─────────────────────────────────────────────
CREATE TABLE site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT INTO site_settings (key, value) VALUES
  ('email',         'hello@elysianproject.id'),
  ('whatsapp',      '6281234567890'),
  ('instagram_url', 'https://instagram.com/elysianproject'),
  ('linkedin_url',  'https://linkedin.com/company/elysianproject'),
  ('footer_tagline','Crafting digital experiences that work — for businesses that mean it.'),
  ('hero_badge',    'ACCEPTING PROJECTS');


-- ─────────────────────────────────────────────
-- 2. HERO STATS
-- Angka statistik di bawah CTA hero section
-- ─────────────────────────────────────────────
CREATE TABLE hero_stats (
  id         SERIAL PRIMARY KEY,
  value      TEXT    NOT NULL,
  label      TEXT    NOT NULL,
  sort_order INT     NOT NULL DEFAULT 0
);

INSERT INTO hero_stats (value, label, sort_order) VALUES
  ('50+',  'Projects',    1),
  ('3yrs', 'In business', 2),
  ('100%', 'Satisfaction',3);


-- ─────────────────────────────────────────────
-- 3. MARQUEE ITEMS
-- Teks yang berjalan di strip marquee
-- ─────────────────────────────────────────────
CREATE TABLE marquee_items (
  id         SERIAL  PRIMARY KEY,
  text       TEXT    NOT NULL,
  sort_order INT     NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO marquee_items (text, sort_order) VALUES
  ('Landing Page',      1),
  ('E-Commerce',        2),
  ('Flutter Mobile App',3),
  ('Web Application',   4),
  ('iOS & Android',     5),
  ('Custom CMS',        6),
  ('API Integration',   7),
  ('Dashboard',         8),
  ('Booking System',    9),
  ('SEO Optimization',  10),
  ('Cross-Platform',    11),
  ('Performance Tuning',12);


-- ─────────────────────────────────────────────
-- 4. PROCESS STEPS
-- Langkah-langkah cara kerja Elysian
-- ─────────────────────────────────────────────
CREATE TABLE process_steps (
  id          SERIAL PRIMARY KEY,
  title       TEXT   NOT NULL,
  description TEXT   NOT NULL,
  sort_order  INT    NOT NULL DEFAULT 0
);

INSERT INTO process_steps (title, description, sort_order) VALUES
  ('Discovery', 'We dig into your business, goals, and needs — asking the questions most developers skip.', 1),
  ('Design',    'Clean mockups and a clear direction before a single line of code is written.',             2),
  ('Build',     'We code fast, thoroughly tested, and production-optimized from day one.',                 3),
  ('Launch',    'You go live with confidence. We stay around for support and future growth.',              4);


-- ─────────────────────────────────────────────
-- 5. SERVICES
-- Kartu layanan di section "What we build"
-- ─────────────────────────────────────────────
CREATE TABLE services (
  id         SERIAL  PRIMARY KEY,
  title      TEXT    NOT NULL,
  price      TEXT    NOT NULL,
  timeline   TEXT    NOT NULL,
  badge      TEXT,                       -- contoh: "NEW"
  addon      TEXT,                       -- add-on note (Landing Page)
  includes   TEXT,                       -- bundling note (Growth, Mobile)
  has_stacks BOOLEAN NOT NULL DEFAULT FALSE,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT     NOT NULL DEFAULT 0
);

CREATE TABLE service_points (
  id         SERIAL PRIMARY KEY,
  service_id INT    NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  text       TEXT   NOT NULL,
  sort_order INT    NOT NULL DEFAULT 0
);

INSERT INTO services (title, price, timeline, badge, addon, includes, has_stacks, sort_order) VALUES
  ('Landing Page',    'From Rp 1.5jt', '3–7 days',   NULL,  '+ Custom domain available', NULL,                                           FALSE, 1),
  ('E-Commerce',      'From Rp 10jt',  '2–4 weeks',  NULL,  NULL,                        'Cloud server + domain included (year 1)',      TRUE,  2),
  ('Complex System',  'From Rp 25jt',  'Scoped',     NULL,  NULL,                        NULL,                                           TRUE,  3),
  ('Flutter Mobile App','From Rp 15jt','4–8 weeks',  'NEW', NULL,                        'Play Console + App Store fee included (year 1)',FALSE, 4);

-- Masukkan service_id berdasarkan hasil insert di atas (1, 2, 3, 4)
INSERT INTO service_points (service_id, text, sort_order) VALUES
  (1, 'Responsive single/multi-section design',  1),
  (1, 'Contact form & WhatsApp integration',     2),
  (1, 'Basic SEO & Google Analytics',            3),
  (1, 'Fast delivery, clean code',               4),

  (2, 'Product catalog & management',            1),
  (2, 'Payment gateway (Midtrans/Xendit)',        2),
  (2, 'Order management dashboard',              3),
  (2, 'Mobile-first design',                     4),

  (3, 'Custom web application (ERP, CRM, HRMS, etc.)', 1),
  (3, 'Role-based access control',              2),
  (3, 'API design & integrations',              3),
  (3, 'Ongoing support available',              4),

  (4, 'Cross-platform iOS & Android from one codebase', 1),
  (4, 'Custom UI/UX — pixel-perfect on every device',   2),
  (4, 'REST API / Firebase / Supabase integration',     3),
  (4, 'Push notifications & deep linking',              4),
  (4, 'App Store & Play Store deployment',              5);


-- ─────────────────────────────────────────────
-- 6. PORTFOLIO PROJECTS
-- Kartu proyek di section "Selected work"
-- ─────────────────────────────────────────────
CREATE TABLE portfolio_projects (
  id          SERIAL  PRIMARY KEY,
  name        TEXT    NOT NULL,
  type        TEXT    NOT NULL CHECK (type IN ('E-Commerce','Web App','Landing Page','Complex System')),
  description TEXT    NOT NULL,
  year        TEXT    NOT NULL,
  is_visible  BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INT     NOT NULL DEFAULT 0
);

CREATE TABLE portfolio_tech (
  id         SERIAL PRIMARY KEY,
  project_id INT    NOT NULL REFERENCES portfolio_projects(id) ON DELETE CASCADE,
  tech       TEXT   NOT NULL,
  sort_order INT    NOT NULL DEFAULT 0
);

INSERT INTO portfolio_projects (name, type, description, year, sort_order) VALUES
  ('TokoBaju.id', 'E-Commerce',    'Fashion brand''s online storefront with catalog management, cart, and Midtrans checkout. Launched in 2.5 weeks.',                              '2025', 1),
  ('MedisPlus',   'Web App',       'Clinic appointment booking and patient management system with queue tracking and doctor scheduling.',                                          '2025', 2),
  ('BiteBox',     'Landing Page',  'Premium F&B brand launch page with animated storytelling, menu showcase, and franchise inquiry form.',                                        '2024', 3),
  ('LogiTrack',   'Complex System','Logistics tracking platform with real-time fleet management, delivery status, and driver apps.',                                              '2024', 4);

INSERT INTO portfolio_tech (project_id, tech, sort_order) VALUES
  (1, 'Next.js',       1), (1, 'Tailwind',    2), (1, 'Prisma',    3), (1, 'PostgreSQL', 4),
  (2, 'React',         1), (2, 'Node.js',     2), (2, 'MySQL',     3), (2, 'Redis',      4),
  (3, 'Next.js',       1), (3, 'Framer Motion',2),(3, 'Tailwind',  3),
  (4, 'Next.js',       1), (4, 'WebSocket',   2), (4, 'PostgreSQL',3), (4, 'Maps API',   4);


-- ─────────────────────────────────────────────
-- 7. PRICING PLANS
-- Kartu harga di section "Pricing"
-- ─────────────────────────────────────────────
CREATE TABLE pricing_plans (
  id         SERIAL  PRIMARY KEY,
  name       TEXT    NOT NULL,
  subtitle   TEXT    NOT NULL,
  price      TEXT    NOT NULL,
  cta        TEXT    NOT NULL,
  is_popular BOOLEAN NOT NULL DEFAULT FALSE,
  is_mobile  BOOLEAN NOT NULL DEFAULT FALSE,
  badge      TEXT,
  addon      TEXT,
  includes   TEXT,
  has_stacks BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT     NOT NULL DEFAULT 0
);

CREATE TABLE pricing_features (
  id       SERIAL PRIMARY KEY,
  plan_id  INT    NOT NULL REFERENCES pricing_plans(id) ON DELETE CASCADE,
  text     TEXT   NOT NULL,
  sort_order INT  NOT NULL DEFAULT 0
);

INSERT INTO pricing_plans (name, subtitle, price, cta, is_popular, is_mobile, badge, addon, includes, has_stacks, sort_order) VALUES
  ('Starter',    'Landing Page',  'Rp 1.5jt–5jt',  'Get Started',  FALSE, FALSE, NULL,  'Custom domain available — contact us',     NULL,                                           FALSE, 1),
  ('Growth',     'E-Commerce',    'Rp 10jt–25jt',   'Most Popular', TRUE,  FALSE, NULL,  NULL,                                       'Cloud server + domain included (year 1)',      TRUE,  2),
  ('Mobile',     'Flutter App',   'Rp 15jt–40jt',   'Build My App', FALSE, TRUE,  'NEW', NULL,                                       'Play Console + App Store fee included (year 1)',FALSE, 3),
  ('Enterprise', 'Custom System', 'Rp 25jt+',       'Let''s Discuss',FALSE, FALSE, NULL,  NULL,                                       NULL,                                           TRUE,  4);

INSERT INTO pricing_features (plan_id, text, sort_order) VALUES
  (1, '1 page design',              1),
  (1, 'Mobile responsive',          2),
  (1, 'Contact form integration',   3),
  (1, 'WhatsApp button',            4),
  (1, '1 round of revisions',       5),
  (1, '7-day delivery',             6),

  (2, 'Up to 50 products',                      1),
  (2, 'Payment gateway (Midtrans/Xendit)',       2),
  (2, 'Order management dashboard',             3),
  (2, 'Customer accounts',                      4),
  (2, 'Mobile-first design',                    5),
  (2, 'SEO + Analytics setup',                  6),

  (3, 'iOS & Android from one codebase',        1),
  (3, 'Custom UI/UX design',                    2),
  (3, 'REST API / Firebase integration',        3),
  (3, 'Push notifications',                     4),
  (3, 'App Store & Play Store deployment',      5),
  (3, '2 rounds of revisions',                  6),

  (4, 'Custom project scope',                   1),
  (4, 'Role-based access control',              2),
  (4, 'API design & integrations',              3),
  (4, 'Admin dashboard',                        4),
  (4, 'Priority support',                       5),
  (4, 'Dedicated project manager',              6);


-- ─────────────────────────────────────────────
-- 8. TESTIMONIALS
-- ─────────────────────────────────────────────
CREATE TABLE testimonials (
  id          SERIAL  PRIMARY KEY,
  quote       TEXT    NOT NULL,
  author_name TEXT    NOT NULL,
  author_role TEXT    NOT NULL,
  rating      INT     NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_visible  BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INT     NOT NULL DEFAULT 0
);

INSERT INTO testimonials (quote, author_name, author_role, rating, sort_order) VALUES
  ('Elysian delivered our e-commerce site in under 3 weeks. Sales went up 40% in the first month — better than we ever expected.',
   'Andi Pratama', 'Owner, TokoBaju.id', 5, 1),

  ('We had a rough brief and they asked all the right questions. The result was beyond what we imagined. They truly understand the product, not just the code.',
   'dr. Sari Wahyuni', 'Founder, MedisPlus', 5, 2),

  ('Honest pricing, fast execution. They finished 2 days early and the site looks incredible. I''ll keep coming back for every project.',
   'Rizky Firmansyah', 'Creative Director, BiteBox', 5, 3);


-- ─────────────────────────────────────────────
-- 9. CONTACT SUBMISSIONS
-- Pesan masuk dari form kontak di landing page
-- ─────────────────────────────────────────────
CREATE TYPE submission_status AS ENUM ('new', 'read', 'replied', 'archived');

CREATE TABLE contact_submissions (
  id           SERIAL            PRIMARY KEY,
  name         TEXT              NOT NULL,
  email        TEXT              NOT NULL,
  business     TEXT,
  project_type TEXT,
  message      TEXT              NOT NULL,
  status       submission_status NOT NULL DEFAULT 'new',
  created_at   TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ─────────────────────────────────────────────
-- 10. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────

-- Aktifkan RLS di semua tabel
ALTER TABLE site_settings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_stats           ENABLE ROW LEVEL SECURITY;
ALTER TABLE marquee_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_steps        ENABLE ROW LEVEL SECURITY;
ALTER TABLE services             ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_points       ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects   ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_tech       ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans        ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_features     ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials         ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions  ENABLE ROW LEVEL SECURITY;

-- Tabel konten: publik bisa SELECT (untuk landing page)
-- Admin (service_role) bisa semua operasi
CREATE POLICY "Public read content" ON site_settings       FOR SELECT USING (TRUE);
CREATE POLICY "Public read content" ON hero_stats          FOR SELECT USING (TRUE);
CREATE POLICY "Public read content" ON marquee_items       FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read content" ON process_steps       FOR SELECT USING (TRUE);
CREATE POLICY "Public read content" ON services            FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read content" ON service_points      FOR SELECT USING (TRUE);
CREATE POLICY "Public read content" ON portfolio_projects  FOR SELECT USING (is_visible = TRUE);
CREATE POLICY "Public read content" ON portfolio_tech      FOR SELECT USING (TRUE);
CREATE POLICY "Public read content" ON pricing_plans       FOR SELECT USING (TRUE);
CREATE POLICY "Public read content" ON pricing_features    FOR SELECT USING (TRUE);
CREATE POLICY "Public read content" ON testimonials        FOR SELECT USING (is_visible = TRUE);

-- Contact submissions: publik hanya bisa INSERT (kirim form)
CREATE POLICY "Public insert submission" ON contact_submissions FOR INSERT WITH CHECK (TRUE);

-- Admin (service_role) melewati semua RLS secara default di Supabase
-- Tidak perlu policy tambahan untuk service_role


-- ─────────────────────────────────────────────
-- SELESAI
-- ─────────────────────────────────────────────
