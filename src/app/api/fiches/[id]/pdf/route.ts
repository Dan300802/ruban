import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { data: fiche } = await supabase
    .from("fiches_de_mesure")
    .select("id, valeurs, unite, commentaire, version, created_at, nom_modele_libre, client_id")
    .eq("id", id)
    .single();

  if (!fiche) {
    return NextResponse.json({ error: "Fiche introuvable." }, { status: 404 });
  }

  const { data: client } = await supabase
    .from("clients")
    .select("nom, telephone")
    .eq("id", fiche.client_id)
    .single();

  if (!client) {
    return NextResponse.json({ error: "Client introuvable." }, { status: 404 });
  }

  const { data: utilisateur } = await supabase
    .from("utilisateurs")
    .select("ateliers(nom)")
    .eq("supabase_user_id", user.id)
    .single();

  const atelierNom = (utilisateur?.ateliers as any)?.nom ?? "Atelier";

  // ---- Génération du PDF ----
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4 en points
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const ink = rgb(0.11, 0.14, 0.19); // #1C2431
  const brass = rgb(0.725, 0.529, 0.243); // #B9873E
  const gray = rgb(0.4, 0.4, 0.37);

  let y = 780;
  const marginX = 50;

  // En-tête
  page.drawText("RUBAN", { x: marginX, y, size: 20, font: fontBold, color: ink });
  page.drawText(atelierNom, { x: marginX, y: y - 20, size: 11, font: fontRegular, color: gray });
  y -= 60;

  // Ligne de séparation couleur laiton
  page.drawLine({
    start: { x: marginX, y },
    end: { x: 545, y },
    thickness: 1.5,
    color: brass,
  });
  y -= 30;

  // Infos client
  page.drawText(client.nom, { x: marginX, y, size: 18, font: fontBold, color: ink });
  y -= 20;
  if (client.telephone) {
    page.drawText(client.telephone, { x: marginX, y, size: 11, font: fontRegular, color: gray });
    y -= 16;
  }
  page.drawText(fiche.nom_modele_libre ?? "Modèle non précisé", {
    x: marginX,
    y,
    size: 13,
    font: fontBold,
    color: brass,
  });
  y -= 14;
  page.drawText(
    `Version ${fiche.version} — ${new Date(fiche.created_at).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`,
    { x: marginX, y, size: 10, font: fontRegular, color: gray }
  );
  y -= 40;

  // Tableau des mesures
  const valeurs = fiche.valeurs as Record<string, string>;
  const unite = fiche.unite ?? "cm";

  page.drawText("MESURES", { x: marginX, y, size: 11, font: fontBold, color: ink });
  y -= 4;
  page.drawLine({ start: { x: marginX, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.9, 0.87, 0.8) });
  y -= 22;

  Object.entries(valeurs).forEach(([label, value]) => {
    page.drawText(label, { x: marginX, y, size: 12, font: fontRegular, color: ink });
    page.drawText(`${value} ${unite}`, { x: 450, y, size: 12, font: fontBold, color: ink });
    y -= 6;
    page.drawLine({
      start: { x: marginX, y },
      end: { x: 545, y },
      thickness: 0.5,
      color: rgb(0.93, 0.9, 0.85),
      dashArray: [2, 2],
    });
    y -= 20;
  });

  // Commentaire
  if (fiche.commentaire) {
    y -= 10;
    page.drawText("COMMENTAIRE", { x: marginX, y, size: 11, font: fontBold, color: ink });
    y -= 18;
    page.drawText(fiche.commentaire, { x: marginX, y, size: 11, font: fontRegular, color: gray, maxWidth: 495 });
  }

  // Pied de page
  page.drawText("Genere avec Ruban", {
    x: marginX,
    y: 40,
    size: 9,
    font: fontRegular,
    color: rgb(0.7, 0.7, 0.65),
  });

  const pdfBytes = await doc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="fiche-${client.nom.replace(/\s+/g, "-")}-${fiche.version}.pdf"`,
    },
  });
}