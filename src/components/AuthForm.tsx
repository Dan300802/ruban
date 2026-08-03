"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const svgRef = useRef<SVGSVGElement>(null);

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupAtelier, setSignupAtelier] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  useEffect(() => {
    const svg = svgRef.current;
    if (svg && svg.children.length === 0) {
      const ns = "http://www.w3.org/2000/svg";
      const width = 500;
      for (let x = 0; x <= width; x += 8) {
        const isMajor = x % 40 === 0;
        const line = document.createElementNS(ns, "line");
        line.setAttribute("x1", String(x));
        line.setAttribute("x2", String(x));
        line.setAttribute("y1", "26");
        line.setAttribute("y2", isMajor ? "10" : "18");
        line.setAttribute("stroke", isMajor ? "#B9873E" : "#3A4356");
        line.setAttribute("stroke-width", isMajor ? "1.4" : "1");
        svg.appendChild(line);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    setLoading(false);
    if (error) {
      setError("E-mail ou mot de passe incorrect.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nomAtelier: signupAtelier,
        email: signupEmail,
        password: signupPassword,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }

    // Connecter automatiquement l'utilisateur après inscription
    const supabase = createClient();
    await supabase.auth.signInWithPassword({ email: signupEmail, password: signupPassword });
    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="screen">
      <div className="brand">
        <div className="brand-top">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#B9873E" strokeWidth="1.6" />
              <path d="M12 7v5l3.2 1.8" stroke="#B9873E" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Ruban
          </div>
        </div>
        <div className="brand-mid">
          <div className="eyebrow">Votre atelier, retrouvé</div>
          <h1>
            Chaque mesure, <em>toujours à sa place</em>.
          </h1>
          <p>Retrouvez vos fiches clients où que vous soyez. Sauvegardées, sécurisées, jamais perdues.</p>
          <div className="measure-preview">
            <span className="tag">Fiche de mesure — Aïcha K.</span>
            <div className="row"><span>Tour de poitrine</span><span className="val">92,4 cm</span></div>
            <div className="row"><span>Tour de taille</span><span className="val">74,0 cm</span></div>
            <div className="row"><span>Longueur robe</span><span className="val">128,5 cm</span></div>
          </div>
        </div>
        <div className="brand-bottom">© 2026 Ruban — Fait pour les couturiers</div>
        <div className="tape-strip" aria-hidden="true">
          <svg ref={svgRef} viewBox="0 0 500 26" preserveAspectRatio="none"></svg>
        </div>
      </div>

      <div className="form-side">
        <div className="form-box">
          <div className="tabs">
            <div className={`tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>
              Connexion
            </div>
            <div className={`tab ${tab === "signup" ? "active" : ""}`} onClick={() => setTab("signup")}>
              Créer un atelier
            </div>
          </div>

          <div className={`panel ${tab === "login" ? "active" : ""}`}>
            <h2>Content de vous revoir</h2>
            <p className="sub">Connectez-vous pour accéder à vos fiches clients.</p>
            <form onSubmit={handleLogin}>
              <div className="field">
                <label htmlFor="login-email">E-mail ou téléphone</label>
                <input
                  id="login-email"
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="vous@atelier.com"
                />
              </div>
              <div className="field">
                <label htmlFor="login-pass">Mot de passe</label>
                <input
                  id="login-pass"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="row-inline">
                <label><input type="checkbox" /> Rester connecté</label>
                <a href="#">Mot de passe oublié ?</a>
              </div>
              {error && tab === "login" && (
                <p style={{ color: "#A13D3D", fontSize: 13, marginBottom: 14 }}>{error}</p>
              )}
              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? "Connexion…" : "Se connecter"}
              </button>
            </form>
            <p className="switch-line" style={{ marginTop: 22 }}>
              Pas encore d&apos;atelier sur Ruban ? <a onClick={() => setTab("signup")}>Créer un compte</a>
            </p>
          </div>

          <div className={`panel ${tab === "signup" ? "active" : ""}`}>
            <h2>Créez votre atelier</h2>
            <p className="sub">Deux minutes suffisent pour commencer.</p>
            <form onSubmit={handleSignup}>
              <div className="field">
                <label htmlFor="signup-atelier">Nom de l&apos;atelier</label>
                <input
                  id="signup-atelier"
                  type="text"
                  value={signupAtelier}
                  onChange={(e) => setSignupAtelier(e.target.value)}
                  placeholder="Atelier Aïcha"
                />
              </div>
              <div className="field">
                <label htmlFor="signup-email">E-mail ou téléphone</label>
                <input
                  id="signup-email"
                  type="text"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="vous@atelier.com"
                />
              </div>
              <div className="field">
                <label htmlFor="signup-pass">Mot de passe</label>
                <input
                  id="signup-pass"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="8 caractères minimum"
                />
                <div className="hint">Utilisez au moins 8 caractères, avec un chiffre.</div>
              </div>
              {error && tab === "signup" && (
                <p style={{ color: "#A13D3D", fontSize: 13, marginBottom: 14 }}>{error}</p>
              )}
              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? "Création…" : "Créer mon atelier"}
              </button>
            </form>
            <p className="switch-line" style={{ marginTop: 22 }}>
              Déjà un compte ? <a onClick={() => setTab("login")}>Se connecter</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}