"use client";
import { useState } from "react";
import Link from "next/link";

type ClientCard = {
  id: string;
  letter: string;
  initials: string;
  name: string;
  garment: string;
  phone: string;
  date: string;
  status: "recent" | "old" | "none";
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function DashboardAgenda({
  atelierNom,
  email,
  clients,
}: {
  atelierNom: string;
  email: string;
  clients: ClientCard[];
}) {
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const lettersWithClients = new Set(clients.map((c) => c.letter));

  const filtered = clients.filter((c) => {
    const matchesLetter = !activeLetter || c.letter === activeLetter;
    const matchesQuery =
      !query ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.phone.includes(query);
    return matchesLetter && matchesQuery;
  });

  const grouped = filtered.reduce<Record<string, ClientCard[]>>((acc, c) => {
    acc[c.letter] = acc[c.letter] || [];
    acc[c.letter].push(c);
    return acc;
  }, {});

  const statusLabel = { recent: "Récente", old: "À revoir", none: "Aucune mesure" };

  return (
    <div className="agenda">
      <div className="tab-rail">
        <div className="brand-tag">RUB</div>
        {alphabet.map((l) => (
          <div
            key={l}
            className={`letter ${lettersWithClients.has(l) ? "has-client" : ""} ${
              activeLetter === l ? "active" : ""
            }`}
            onClick={() => setActiveLetter(activeLetter === l ? null : l)}
          >
            {l}
          </div>
        ))}
      </div>

      <div className="page">
        <div className="page-head">
          <div className="title-block">
            <div className="eyebrow">{atelierNom}</div>
            <h1>Carnet de mesures</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="date-stamp">{clients.length} fiches — {email}</div>
          </div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher un nom, un numéro…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Link href="/dashboard/clients/new" className="btn-new">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nouveau client
          </Link>
        </div>

        {clients.length === 0 && (
          <p style={{ color: "#8A8060", marginTop: 30 }}>
            Aucun client pour l&apos;instant.{" "}
            <Link href="/dashboard/clients/new" style={{ color: "var(--brass)", fontWeight: 700 }}>
              Ajoutez votre premier client
            </Link>
            .
          </p>
        )}

        {Object.keys(grouped)
          .sort()
          .map((letter) => (
            <div key={letter}>
              <div className="section-letter">
                <div className="letter-big">{letter}</div>
                <div className="line"></div>
              </div>
              <div className="card-grid">
                {grouped[letter].map((c) => (
                  <Link href={`/dashboard/clients/${c.id}`} className="client-card" key={c.id}>
                    <div className="card-avatar">{c.initials}</div>
                    <div className="card-body">
                      <div className="name-row">
                        <span className="name">{c.name}</span>
                        <span className={`status-pin ${c.status}`}>
                          <span className="dot"></span>
                          {statusLabel[c.status]}
                        </span>
                      </div>
                      <div className="garment">{c.garment}</div>
                      <div className="card-meta">
                        <span className="phone">{c.phone}</span>
                        <span>{c.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

        {filtered.length === 0 && clients.length > 0 && (
          <p style={{ color: "#8A8060", marginTop: 30 }}>Aucune fiche ne correspond à cette recherche.</p>
        )}
      </div>
    </div>
  );
}