"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Fiche = {
  id: string;
  valeurs: Record<string, string>;
  unite: string;
  commentaire: string | null;
  version: number;
  created_at: string;
  nom_modele_libre: string | null;
  modeles_de_mesure: { nom: string } | null;
};

type ClientData = {
  id: string;
  nom: string;
  telephone: string | null;
  notes: string | null;
  created_at: string;
};

type Field = { id: string; label: string; value: string; custom: boolean };

const garmentSuggestions = ["Robe de soirée", "Costume", "Chemise", "Boubou", "Pantalon"];

export default function ClientSheet({ client, fiches }: { client: ClientData; fiches: Fiche[] }) {
  const router = useRouter();

  // ---- Regroupement des fiches par vêtement ----
  const garmentGroups = new Map<string, Fiche[]>();
  fiches.forEach((f) => {
    const key = (f.nom_modele_libre ?? f.modeles_de_mesure?.nom ?? "Sans nom").trim();
    if (!garmentGroups.has(key)) garmentGroups.set(key, []);
    garmentGroups.get(key)!.push(f);
  });
  garmentGroups.forEach((list) => list.sort((a, b) => b.version - a.version));

  const garmentNames = Array.from(garmentGroups.keys());
  const mostRecentGarment =
    garmentNames.length > 0
      ? garmentNames.reduce((latest, name) => {
          const latestDate = new Date(garmentGroups.get(latest)![0].created_at).getTime();
          const currentDate = new Date(garmentGroups.get(name)![0].created_at).getTime();
          return currentDate > latestDate ? name : latest;
        })
      : null;

  const [activeGarment, setActiveGarment] = useState<string | null>(mostRecentGarment);
  const [creatingNew, setCreatingNew] = useState(garmentNames.length === 0);
  const [newGarmentName, setNewGarmentName] = useState("");

  const currentFiches = activeGarment ? garmentGroups.get(activeGarment) ?? [] : [];
  const latestFiche = currentFiches[0] ?? null;

  const [activeVersion, setActiveVersion] = useState<string>(latestFiche?.id ?? "new");
  const [unit, setUnit] = useState<"cm" | "in">((latestFiche?.unite as "cm" | "in") ?? "cm");
  const [comment, setComment] = useState(latestFiche?.commentaire ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialFields: Field[] = latestFiche
    ? Object.entries(latestFiche.valeurs).map(([label, value], i) => ({
        id: String(i),
        label,
        value: String(value),
        custom: false,
      }))
    : [];

  const [fields, setFields] = useState<Field[]>(initialFields);

  // ---- Édition des infos client (nom, téléphone, notes) ----
  const [editing, setEditing] = useState(false);
  const [editNom, setEditNom] = useState(client.nom);
  const [editTelephone, setEditTelephone] = useState(client.telephone ?? "");
  const [editNotes, setEditNotes] = useState(client.notes ?? "");
  const [savingClient, setSavingClient] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const selectedFiche = currentFiches.find((f) => f.id === activeVersion) ?? null;
  const isViewingPast = selectedFiche !== null && selectedFiche.id !== latestFiche?.id;

  const displayFields =
    isViewingPast && selectedFiche
      ? Object.entries(selectedFiche.valeurs).map(([label, value], i) => ({
          id: String(i),
          label,
          value: String(value),
          custom: false,
        }))
      : fields;

  const switchGarment = (name: string) => {
    setActiveGarment(name);
    setCreatingNew(false);
    const group = garmentGroups.get(name) ?? [];
    const latest = group[0] ?? null;
    setActiveVersion(latest?.id ?? "new");
    setUnit((latest?.unite as "cm" | "in") ?? "cm");
    setComment(latest?.commentaire ?? "");
    setFields(
      latest
        ? Object.entries(latest.valeurs).map(([label, value], i) => ({
            id: String(i),
            label,
            value: String(value),
            custom: false,
          }))
        : []
    );
    setError(null);
  };

  const startNewGarment = () => {
    setCreatingNew(true);
    setActiveGarment(null);
    setActiveVersion("new");
    setNewGarmentName("");
    setUnit("cm");
    setComment("");
    setFields([]);
    setError(null);
  };

  const addField = () => {
    setFields([...fields, { id: crypto.randomUUID(), label: "", value: "", custom: true }]);
  };

  const updateField = (id: string, key: "label" | "value", newVal: string) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, [key]: newVal } : f)));
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleSave = async () => {
    setError(null);
    const garmentToSave = creatingNew ? newGarmentName.trim() : activeGarment;
    if (!garmentToSave) {
      setError("Indiquez le nom du modèle avant d'enregistrer.");
      return;
    }
    const valeurs: Record<string, string> = {};
    for (const f of fields) {
      if (!f.label.trim()) continue;
      valeurs[f.label] = f.value;
    }
    if (Object.keys(valeurs).length === 0) {
      setError("Ajoutez au moins une mesure avant d'enregistrer.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/fiches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: client.id,
        valeurs,
        unite: unit,
        commentaire: comment,
        nomModeleLibre: garmentToSave,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }
    router.refresh();
  };

  const handleSaveClient = async () => {
    setClientError(null);
    if (!editNom.trim()) {
      setClientError("Le nom est obligatoire.");
      return;
    }
    setSavingClient(true);
    const res = await fetch(`/api/clients/${client.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom: editNom, telephone: editTelephone, notes: editNotes }),
    });
    const data = await res.json();
    setSavingClient(false);
    if (!res.ok) {
      setClientError(data.error ?? "Une erreur est survenue.");
      return;
    }
    setEditing(false);
    router.refresh();
  };

  const cancelEditClient = () => {
    setEditNom(client.nom);
    setEditTelephone(client.telephone ?? "");
    setEditNotes(client.notes ?? "");
    setClientError(null);
    setEditing(false);
  };

  const initials = client.nom
    .split(" ")
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

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

      <div className="page">
        <div className="client-header">
          <div className="avatar-big">{initials}</div>
          <div className="client-info" style={{ width: "100%" }}>
            {!editing ? (
              <div className="name-row">
                <div>
                  <h1>{client.nom}</h1>
                  <div className="meta-line">
                    <span>{client.telephone ?? "Pas de téléphone"}</span>
                    <span>
                      Client depuis{" "}
                      {new Date(client.created_at).toLocaleDateString("fr-FR", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {client.notes && <div className="notes-line">« {client.notes} »</div>}
                </div>
              </div>
            ) : (
              <div className="client-edit-form">
                <div className="field">
                  <label htmlFor="edit-nom">Nom complet</label>
                  <input
                    id="edit-nom"
                    type="text"
                    value={editNom}
                    onChange={(e) => setEditNom(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="edit-tel">Téléphone</label>
                  <input
                    id="edit-tel"
                    type="text"
                    value={editTelephone}
                    onChange={(e) => setEditTelephone(e.target.value)}
                    placeholder="+228 90 12 34 56"
                  />
                </div>
                <div className="field">
                  <label htmlFor="edit-notes">Notes</label>
                  <input
                    id="edit-notes"
                    type="text"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Préférences, remarques…"
                  />
                </div>
                {clientError && (
                  <p style={{ color: "#A13D3D", fontSize: 13, marginBottom: 10 }}>{clientError}</p>
                )}
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="btn-save"
                    type="button"
                    onClick={handleSaveClient}
                    disabled={savingClient}
                  >
                    {savingClient ? "Enregistrement…" : "Enregistrer"}
                  </button>
                  <button className="btn-ghost" type="button" onClick={cancelEditClient}>
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
          {!editing && (
            <button className="btn-ghost" onClick={() => setEditing(true)} type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Modifier la fiche
            </button>
          )}
        </div>

        {/* Onglets de vêtement — un fil d'historique par type de vêtement */}
        <div className="garment-tabs">
          {garmentNames.map((name) => (
            <div
              key={name}
              className={`garment-tab ${activeGarment === name && !creatingNew ? "active" : ""}`}
              onClick={() => switchGarment(name)}
            >
              {name}
              <span className="count">{garmentGroups.get(name)!.length}</span>
            </div>
          ))}
          <div className={`garment-tab new ${creatingNew ? "active" : ""}`} onClick={startNewGarment}>
            + Nouveau vêtement
          </div>
        </div>

        {/* Onglets de version — seulement pour le vêtement sélectionné */}
        {!creatingNew && currentFiches.length > 0 && (
          <div className="version-row">
            {currentFiches.map((f) => (
              <div
                key={f.id}
                className={`version-tab ${activeVersion === f.id ? "active" : ""}`}
                onClick={() => setActiveVersion(f.id)}
              >
                {new Date(f.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                {f.id === latestFiche?.id && <span className="badge">Actuelle</span>}
              </div>
            ))}
          </div>
        )}

        <div className="sheet">
          <div className="sheet-head">
            <div className="garment-select">
              Modèle
              {creatingNew ? (
                <input
                  list="garment-options"
                  value={newGarmentName}
                  onChange={(e) => setNewGarmentName(e.target.value)}
                  placeholder="Ex. Robe de soirée, ou un modèle à vous…"
                  autoFocus
                />
              ) : (
                <span style={{ color: "var(--ink)" }}>{activeGarment}</span>
              )}
              <datalist id="garment-options">
                {garmentSuggestions.map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
            </div>
            <div className="unit-toggle">
              <span className={unit === "cm" ? "active" : ""} onClick={() => !isViewingPast && setUnit("cm")}>
                cm
              </span>
              <span className={unit === "in" ? "active" : ""} onClick={() => !isViewingPast && setUnit("in")}>
                pouces
              </span>
            </div>
          </div>

          <div className="measure-grid">
            {displayFields.map((f) => (
              <div className={`measure-field ${f.custom ? "custom" : ""}`} key={f.id}>
                <label>
                  <svg className="tick" viewBox="0 0 16 10">
                    <line x1="0" y1="10" x2="0" y2="2" stroke="currentColor" strokeWidth="1.4" />
                    <line x1="8" y1="10" x2="8" y2="5" stroke="currentColor" strokeWidth="1.2" />
                    <line x1="16" y1="10" x2="16" y2="2" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                  {f.custom && !isViewingPast ? (
                    <input
                      className="custom-label"
                      placeholder="Nom de la mesure…"
                      value={f.label}
                      onChange={(e) => updateField(f.id, "label", e.target.value)}
                    />
                  ) : (
                    f.label
                  )}
                </label>
                <input
                  type="text"
                  value={f.value}
                  onChange={(e) => !isViewingPast && updateField(f.id, "value", e.target.value)}
                  placeholder="0,0"
                  disabled={isViewingPast}
                />
                <span className="unit">{unit}</span>
                {f.custom && !isViewingPast ? (
                  <button type="button" className="remove-field" onClick={() => removeField(f.id)}>
                    ×
                  </button>
                ) : (
                  <span></span>
                )}
              </div>
            ))}
          </div>

          {!isViewingPast && (
            <button className="btn-add-measure" type="button" onClick={addField}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Ajouter une mesure personnalisée
            </button>
          )}

          <div className="comment-field">
            <label>Commentaire</label>
            <textarea
              placeholder="Ex. : cliente a pris un peu de poids depuis la dernière commande…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isViewingPast}
            />
          </div>

          {error && <p style={{ color: "#A13D3D", fontSize: 13, marginTop: 14 }}>{error}</p>}

          {!isViewingPast && (
            <div className="sheet-foot">
              <div className="save-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {creatingNew
                  ? "Ceci démarre un nouvel historique pour ce vêtement"
                  : "Une nouvelle version sera créée à l'enregistrement — l'historique est conservé"}
              </div>
              <div className="btn-row">
  {latestFiche && (
    <a
      className="btn-export"
      href={`/api/fiches/${(selectedFiche ?? latestFiche).id}/pdf`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
      </svg>
      Exporter PDF
    </a>
  )}
  <button className="btn-save" onClick={handleSave} disabled={saving}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    </svg>
    {saving ? "Enregistrement…" : "Enregistrer la mesure"}
  </button>
</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}