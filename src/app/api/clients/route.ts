import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { nom, telephone, notes } = await request.json();

  if (!nom) {
    return NextResponse.json({ error: "Le nom est obligatoire." }, { status: 400 });
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
    .select("atelier_id")
    .eq("supabase_user_id", user.id)
    .single();

  if (!utilisateur) {
    return NextResponse.json({ error: "Atelier introuvable." }, { status: 400 });
  }

  const { data: client, error } = await supabase
    .from("clients")
    .insert({
      nom,
      telephone: telephone || null,
      notes: notes || null,
      atelier_id: utilisateur.atelier_id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ client });
}