import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { clientId, valeurs, unite, commentaire, nomModeleLibre } = await request.json();

  if (!clientId || !valeurs || !nomModeleLibre) {
    return NextResponse.json({ error: "Champs manquants (modèle requis)." }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  // La version est maintenant scopée par vêtement (nom_modele_libre), pas globale au client
  const { data: derniereFiche } = await supabase
    .from("fiches_de_mesure")
    .select("version")
    .eq("client_id", clientId)
    .ilike("nom_modele_libre", nomModeleLibre.trim())
    .order("version", { ascending: false })
    .limit(1)
    .single();

  const nouvelleVersion = (derniereFiche?.version ?? 0) + 1;

  const { data: fiche, error } = await supabase
    .from("fiches_de_mesure")
    .insert({
      client_id: clientId,
      valeurs,
      unite: unite ?? "cm",
      commentaire: commentaire || null,
      nom_modele_libre: nomModeleLibre.trim(),
      version: nouvelleVersion,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ fiche });
}