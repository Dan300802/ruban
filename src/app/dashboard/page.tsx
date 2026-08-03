import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardAgenda from "@/components/DashboardAgenda";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: utilisateur } = await supabase
    .from("utilisateurs")
    .select("email, atelier_id, ateliers(nom)")
    .eq("supabase_user_id", user.id)
    .single();

  const atelierId = utilisateur?.atelier_id;
  const atelierNom = (utilisateur?.ateliers as any)?.nom ?? "Votre atelier";
  const email = utilisateur?.email ?? user.email ?? "";

  const { data: clientsData } = await supabase
    .from("clients")
    .select("id, nom, telephone, created_at")
    .eq("atelier_id", atelierId)
    .order("nom", { ascending: true });

  const clientIds = (clientsData ?? []).map((c) => c.id);

  const { data: fichesData } = clientIds.length
    ? await supabase
        .from("fiches_de_mesure")
        .select("id, client_id, nom_modele_libre, created_at, modeles_de_mesure(nom)")
        .in("client_id", clientIds)
        .order("created_at", { ascending: false })
    : { data: [] as any[] };

  const latestFicheByClient = new Map<string, { garment: string; date: string }>();
  (fichesData ?? []).forEach((f: any) => {
    if (!latestFicheByClient.has(f.client_id)) {
      latestFicheByClient.set(f.client_id, {
        garment: f.nom_modele_libre ?? f.modeles_de_mesure?.nom ?? "—",
        date: f.created_at,
      });
    }
  });

  const clients = (clientsData ?? []).map((c) => {
    const fiche = latestFicheByClient.get(c.id);
    const dateObj = fiche ? new Date(fiche.date) : null;
    const monthsAgo = dateObj
      ? (Date.now() - dateObj.getTime()) / (1000 * 60 * 60 * 24 * 30)
      : null;

    return {
      id: c.id,
      letter: c.nom.charAt(0).toUpperCase(),
      initials: c.nom
        .split(" ")
        .map((p: string) => p.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase(),
      name: c.nom,
      garment: fiche?.garment ?? "Aucune mesure",
      phone: c.telephone ?? "—",
      date: dateObj
        ? dateObj.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
        : "—",
      status: (monthsAgo === null ? "none" : monthsAgo > 12 ? "old" : "recent") as
        | "none"
        | "old"
        | "recent",
    };
  });

  return <DashboardAgenda atelierNom={atelierNom} email={email} clients={clients} />;
}