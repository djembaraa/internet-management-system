import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; 

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding admin user...");

  const { data, error } = await supabase.auth.signUp({
    email: 'admin_dj@gmail.com',
    password: 'adminpassword123',
  });

  if (error) {
    console.error("Error creating user:", error.message);
    return;
  }

  const user = data.user;
  if (!user) {
    console.error("User creation failed.");
    return;
  }

  console.log("User created with ID:", user.id);

  // Note: This insert might fail if RLS policies block anonymous/unauthenticated inserts to 'profiles'.
  // We added a policy: `create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);`
  // However, `signUp` doesn't automatically log us in on the server side in some node environments unless persisted.
  // Assuming the trigger or the policy allows it:
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      username: 'admin',
      full_name: 'System Admin',
      role: 'root'
    });

  if (profileError) {
    console.error("Error creating profile:", profileError.message);
    console.log("Note: You might need to manually set the role in the Supabase Dashboard if RLS blocked this.");
  } else {
    console.log("Admin profile created successfully!");
  }

  console.log("\n--- SEED COMPLETE ---");
  console.log("You can now login with:");
  console.log("Email: admin_dj@gmail.com");
  console.log("Password: adminpassword123");
}

seed();
