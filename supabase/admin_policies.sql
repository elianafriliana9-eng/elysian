-- ============================================================
-- Admin RLS Policies — jalankan di Supabase SQL Editor
-- Memberi akses penuh (SELECT/INSERT/UPDATE/DELETE) untuk
-- user yang sudah login (authenticated role)
-- ============================================================

CREATE POLICY "Admin manage" ON site_settings       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage" ON hero_stats           FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage" ON marquee_items        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage" ON process_steps        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage" ON services             FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage" ON service_points       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage" ON portfolio_projects   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage" ON portfolio_tech       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage" ON pricing_plans        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage" ON pricing_features     FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage" ON testimonials         FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage" ON contact_submissions  FOR ALL TO authenticated USING (true) WITH CHECK (true);
