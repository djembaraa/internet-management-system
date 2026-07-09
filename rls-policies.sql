-- 1. DROP EXISTING POLICIES (Jika sebelumnya diset full access)
DROP POLICY IF EXISTS "Allow all authenticated users full access to routers" ON routers;
DROP POLICY IF EXISTS "Allow all authenticated users full access to pppoe_profiles" ON pppoe_profiles;
DROP POLICY IF EXISTS "Allow all authenticated users full access to pppoe_clients" ON pppoe_clients;
DROP POLICY IF EXISTS "Allow all authenticated users full access to invoices" ON invoices;
DROP POLICY IF EXISTS "Allow all authenticated users full access to tickets" ON tickets;

-- 2. CREATE TICKET MESSAGES TABLE (Untuk fitur Chat)
CREATE TABLE IF NOT EXISTS ticket_messages (
  id uuid default uuid_generate_v4() primary key,
  ticket_id uuid references tickets(id) on delete cascade not null,
  sender_id uuid references auth.users(id) not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

-- 3. CREATE SECURE POLICIES
-- Fungsi bantuan untuk mengecek apakah user adalah admin atau root
CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'root')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ROUTERS & PPPOE: Hanya admin & root yang bisa akses penuh (read, insert, update, delete)
CREATE POLICY "Admin full access to routers" ON routers FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to pppoe_profiles" ON pppoe_profiles FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to pppoe_clients" ON pppoe_clients FOR ALL USING (is_admin());

-- INVOICES: 
-- Admin bisa semua
CREATE POLICY "Admin full access to invoices" ON invoices FOR ALL USING (is_admin());
-- Client HANYA BISA MELIHAT invoice milik mereka sendiri
CREATE POLICY "Client read own invoices" ON invoices FOR SELECT USING (client_id = auth.uid());

-- TICKETS:
-- Admin bisa semua
CREATE POLICY "Admin full access to tickets" ON tickets FOR ALL USING (is_admin());
-- Client BISA MELIHAT & MEMBUAT tiket milik mereka sendiri
CREATE POLICY "Client read own tickets" ON tickets FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Client insert own tickets" ON tickets FOR INSERT WITH CHECK (client_id = auth.uid());

-- TICKET MESSAGES (CHAT):
-- Admin bisa baca & tulis di semua tiket
CREATE POLICY "Admin full access ticket messages" ON ticket_messages FOR ALL USING (is_admin());
-- Client hanya bisa baca & tulis di tiket milik mereka sendiri
CREATE POLICY "Client read own ticket messages" ON ticket_messages FOR SELECT 
  USING (EXISTS (SELECT 1 FROM tickets WHERE id = ticket_messages.ticket_id AND client_id = auth.uid()));
CREATE POLICY "Client insert own ticket messages" ON ticket_messages FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM tickets WHERE id = ticket_id AND client_id = auth.uid()));
