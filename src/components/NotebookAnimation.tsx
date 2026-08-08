"use client";

export default function NotebookAnimation() {
  return (
    <div className="notebook-scene">
      <div className="measure-card">
        <div className="tape-line">
          <svg viewBox="0 0 420 20" preserveAspectRatio="none">
            <path d="M0,10 L420,10" stroke="#B9873E" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <span className="tag">Fiche de mesure — Aïcha K.</span>
        <div className="measure-row"><span className="label">Tour de poitrine</span><span className="val">92,4 cm</span></div>
        <div className="measure-row"><span className="label">Tour de taille</span><span className="val">74,0 cm</span></div>
        <div className="measure-row"><span className="label">Longueur robe</span><span className="val">128,5 cm</span></div>
        <div className="measure-row"><span className="label">Tour de hanches</span><span className="val">98,2 cm</span></div>
      </div>

      <div className="notebook-cover">
        <div className="nc-logo">
  <img src="/logo-nav.png" alt="Ruban" style={{ width: 26, height: 26, objectFit: "contain" }} />
  Ruban
</div>
        <div className="nc-tagline">Carnet de mesures</div>
      </div>
    </div>
  );
}