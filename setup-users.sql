-- 0. Pastikan kolom email ada di tabel profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;

-- 1. Buat Trigger agar setiap user baru otomatis masuk ke tabel profiles
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'client'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Tarik data user yang sudah telanjur dibuat di Dashboard ke tabel profiles 
-- (karena sebelumnya mereka dibuat sebelum Trigger aktif) dan set rolenya:

-- Jadikan zasaarafat98@gmail.com sebagai ADMIN
INSERT INTO profiles (id, username, email, full_name, role)
SELECT id, split_part(email, '@', 1), email, '', 'admin'
FROM auth.users WHERE email = 'zasaarafat98@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin', email = EXCLUDED.email;

-- Jadikan zasaarafat01@gmail.com sebagai CLIENT
INSERT INTO profiles (id, username, email, full_name, role)
SELECT id, split_part(email, '@', 1), email, '', 'client'
FROM auth.users WHERE email = 'zasaarafat01@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'client', email = EXCLUDED.email;
