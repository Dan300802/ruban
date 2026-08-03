import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { nomAtelier, email, password } = await request.json();

  if (!nomAtelier || !email || !password) {
    return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
  }

  const supabase = createAdminClient();

  // 1. Créer le compte Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // pas de vérification email pour l'instant, à revoir plus tard
  });

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: authError?.message ?? "Impossible de créer le compte." },
      { status: 400 }
    );
  }

  // 2. Créer l'atelier
  const { data: atelier, error: atelierError } = await supabase
    .from("ateliers")
    .insert({ nom: nomAtelier })
    .select()
    .single();

  if (atelierError || !atelier) {
    // On annule la création du compte Auth si l'atelier échoue, pour ne pas laisser un compte orphelin
    await supabase.auth.admin.deleteUser(authData.user.id);
    return NextResponse.json(
      { error: "Impossible de créer l'atelier." },
      { status: 500 }
    );
  }

  // 3. Lier l'utilisateur à l'atelier
  const { error: userError } = await supabase.from("utilisateurs").insert({
    supabase_user_id: authData.user.id,
    email,
    atelier_id: atelier.id,
    role: "PROPRIETAIRE",
  });

  if (userError) {
    await supabase.auth.admin.deleteUser(authData.user.id);
    return NextResponse.json(
      { error: "Impossible de créer l'utilisateur." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}