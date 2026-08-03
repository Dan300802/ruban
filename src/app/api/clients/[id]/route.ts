import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { nom, telephone, notes } = await request.json();

  if (!nom || !nom.trim()) {
    return NextResponse.json({ error: "Le nom est obligatoire." }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { data: client, error } = await supabase
    .from("clients")
    .update({
      nom: nom.trim(),
      telephone: telephone?.trim() || null,
      notes: notes?.trim() || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!client) {
    return NextResponse.json({ error: "Client introuvable ou accès refusé." }, { status: 404 });
  }

  return NextResponse.json({ client });
}