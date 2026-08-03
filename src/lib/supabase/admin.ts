import { createClient } from "@supabase/supabase-js";

// ⚠️ Ce client utilise la clé service_role et contourne RLS.
// À n'utiliser QUE dans des routes serveur (app/api/**/route.ts), jamais dans un composant "use client".
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}