import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminDashboard from "@/components/AdminDashboard";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: utilisateur } = await supabase
    .from("utilisateurs")
    .select("is_admin")
    .eq("supabase_user_id", user.id)
    .single();

  if (!utilisateur?.is_admin) redirect("/dashboard");

  // On utilise le client admin pour lister TOUS les ateliers, tous tenants confondus —
  // impossible avec le client normal à cause de RLS (et c'est voulu).
  const adminSupabase = createAdminClient();

  const { data: ateliers } = await adminSupabase
    .from("ateliers")
    .select("id, nom, plan, created_at, utilisateurs(email)")
    .order("created_at", { ascending: false });

  const { data: clientCounts } = await adminSupabase
    .from("clients")
    .select("atelier_id");

  const countByAtelier = new Map<string, number>();
  (clientCounts ?? []).forEach((c: any) => {
    countByAtelier.set(c.atelier_id, (countByAtelier.get(c.atelier_id) ?? 0) + 1);
  });

  const data = (ateliers ?? []).map((a: any) => ({
    id: a.id,
    nom: a.nom,
    plan: a.plan,
    email: a.utilisateurs?.[0]?.email ?? a.utilisateurs?.email ?? "—",
    createdAt: a.created_at,
    nbClients: countByAtelier.get(a.id) ?? 0,
  }));

  return <AdminDashboard ateliers={data} />;
}