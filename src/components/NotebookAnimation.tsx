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
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#B9873E" strokeWidth="1.6" />
            <path d="M12 7v5l3.2 1.8" stroke="#B9873E" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Ruban
        </div>
        <div className="nc-tagline">Carnet de mesures</div>
      </div>
    </div>
  );
}