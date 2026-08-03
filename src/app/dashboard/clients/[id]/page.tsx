import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ClientSheet from "@/components/ClientSheet";

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: client } = await supabase
    .from("clients")
    .select("id, nom, telephone, notes, created_at")
    .eq("id", id)
    .single();

  if (!client) notFound();

  const { data: fiches } = await supabase
    .from("fiches_de_mesure")
    .select("id, valeurs, unite, commentaire, version, created_at, nom_modele_libre, modeles_de_mesure(nom)")
    .eq("client_id", id)
    .order("version", { ascending: false });

  return <ClientSheet client={client} fiches={fiches as any} />;
}