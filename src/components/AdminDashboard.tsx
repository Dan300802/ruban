"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AtelierRow = {
  id: string;
  nom: string;
  plan: string;
  email: string;
  createdAt: string;
  nbClients: number;
};

export default function AdminDashboard({ ateliers }: { ateliers: AtelierRow[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const togglePlan = async (id: string, currentPlan: string) => {
    const newPlan = currentPlan === "decouverte" ? "atelier" : "decouverte";
    setLoadingId(id);
    const res = await fetch(`/api/admin/ateliers/${id}/plan`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: newPlan }),
    });
    setLoadingId(null);
    if (res.ok) {
      router.refresh();
    } else {
      alert("Erreur lors de la mise à jour du plan.");
    }
  };

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <div>
          <div className="eyebrow" style={{ color: "var(--thread)" }}>Administration</div>
          <h1>Gestion des ateliers</h1>
        </div>
        <Link href="/dashboard" className="btn-ghost">Retour à l&apos;app</Link>
      </div>

      <div className="admin-table">
        <div className="admin-row admin-row-head">
          <div>Atelier</div>
          <div>Email</div>
          <div>Clients</div>
          <div>Créé le</div>
          <div>Plan</div>
          <div></div>
        </div>
        {ateliers.map((a) => (
          <div className="admin-row" key={a.id}>
            <div className="admin-nom">{a.nom}</div>
            <div className="admin-email">{a.email}</div>
            <div>{a.nbClients}</div>
            <div>
              {new Date(a.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
            <div>
              <span className={`admin-plan-badge ${a.plan}`}>
                {a.plan === "atelier" ? "Atelier" : "Découverte"}
              </span>
            </div>
            <div>
              <button
                className="btn-ghost"
                onClick={() => togglePlan(a.id, a.plan)}
                disabled={loadingId === a.id}
              >
                {loadingId === a.id
                  ? "…"
                  : a.plan === "decouverte"
                  ? "Passer Atelier"
                  : "Repasser Découverte"}
              </button>
            </div>
          </div>
        ))}
        {ateliers.length === 0 && <p style={{ padding: 24, color: "#8A8060" }}>Aucun atelier pour l&apos;instant.</p>}
      </div>
    </div>
  );
}