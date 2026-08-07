"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewClientPage() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLimitReached(false);
  setLoading(true);
  const res = await fetch("/api/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, telephone, notes }),
  });
  const data = await res.json();
  setLoading(false);
  if (!res.ok) {
    setError(data.error ?? "Une erreur est survenue.");
    if (data.limitReached) setLimitReached(true);
    return;
  }
  router.push(`/dashboard/clients/${data.client.id}`);
};

  return (
    <div className="wrap-outer">
      <div className="topbar">
        <Link className="back-link" href="/dashboard">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          Retour au carnet
        </Link>
        <div className="logo">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#B9873E" strokeWidth="1.6" />
            <path d="M12 7v5l3.2 1.8" stroke="#B9873E" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Ruban
        </div>
      </div>

      <div className="page" style={{ maxWidth: 480, margin: "0 auto" }}>
        <div className="page-head">
          <div className="title-block">
            <div className="eyebrow">Nouveau client</div>
            <h1>Ajouter une fiche</h1>
          </div>
        </div>

        <div className="sheet">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="nom">Nom complet</label>
              <input id="nom" type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Aïcha Koffi" required />
            </div>
            <div className="field">
              <label htmlFor="telephone">Téléphone</label>
              <input id="telephone" type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="+228 90 12 34 56" />
            </div>
            <div className="field">
              <label htmlFor="notes">Notes (optionnel)</label>
              <input id="notes" type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Préférences, remarques…" />
            </div>
            {error && <p style={{ color: "#A13D3D", fontSize: 13, marginBottom: 14 }}>{error}</p>}
            {limitReached && (
  <Link href="/pricing" style={{ color: "var(--brass)", fontWeight: 700, fontSize: 13, display: "block", marginBottom: 14 }}>
    Voir le plan Atelier →
  </Link>
)}
            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? "Création…" : "Créer le client"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}