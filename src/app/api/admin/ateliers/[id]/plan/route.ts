import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { plan } = await request.json();

  if (!["decouverte", "atelier"].includes(plan)) {
    return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { data: utilisateur } = await supabase
    .from("utilisateurs")
    .select("is_admin")
    .eq("supabase_user_id", user.id)
    .single();

  if (!utilisateur?.is_admin) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  // On utilise le client admin (service_role) car il n'existe volontairement aucune
  // policy RLS permettant à un utilisateur de modifier le plan d'un atelier —
  // seul ce endpoint, protégé par la vérification is_admin ci-dessus, peut le faire.
  const adminSupabase = createAdminClient();

  const { error } = await adminSupabase
    .from("ateliers")
    .update({ plan })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}