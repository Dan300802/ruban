"use client";
import { useState } from "react";
import Link from "next/link";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <div className="wrap">
        <div className="logo">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#B9873E" strokeWidth="1.6" />
            <path d="M12 7v5l3.2 1.8" stroke="#B9873E" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Ruban
        </div>

        <div className="nav-links">
          <a className="ghost" href="/#probleme">Le problème</a>
          <a className="ghost" href="/#fonctionnalites">Fonctionnalités</a>
          <a className="ghost" href="/#fonctionnement">Comment ça marche</a>
          <Link className="ghost" href="/pricing">Tarifs</Link>
          <Link className="btn btn-outline" href="/auth">Connexion</Link>
          <Link className="btn btn-primary" href="/auth">Essayer gratuitement</Link>
        </div>

        <button
          className="nav-burger"
          onClick={() => setOpen(!open)}
          aria-label="Ouvrir le menu"
        >
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="nav-mobile-menu">
          <a className="ghost" href="/#probleme" onClick={() => setOpen(false)}>Le problème</a>
          <a className="ghost" href="/#fonctionnalites" onClick={() => setOpen(false)}>Fonctionnalités</a>
          <a className="ghost" href="/#fonctionnement" onClick={() => setOpen(false)}>Comment ça marche</a>
          <Link className="ghost" href="/pricing" onClick={() => setOpen(false)}>Tarifs</Link>
          <Link className="btn btn-outline" href="/auth" onClick={() => setOpen(false)}>Connexion</Link>
          <Link className="btn btn-primary" href="/auth" onClick={() => setOpen(false)}>Essayer gratuitement</Link>
        </div>
      )}
    </nav>
  );
}