import TapeMeasureEffects from "@/components/TapeMeasureEffects";
import NotebookAnimation from "@/components/NotebookAnimation";

export default function Home() {
  return (
    <>
      <TapeMeasureEffects />

      <nav>
        <div className="wrap">
          <div className="logo">
            <span className="logo-mark">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#B9873E" strokeWidth="1.6" />
                <path d="M12 7v5l3.2 1.8" stroke="#B9873E" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            Ruban
          </div>
          <div className="nav-links">
           <div className="nav-links">
  <a className="ghost" href="#probleme">Le problème</a>
  <a className="ghost" href="#fonctionnalites">Fonctionnalités</a>
  <a className="ghost" href="#fonctionnement">Comment ça marche</a>
  <a className="ghost" href="/pricing">Tarifs</a>
  <a className="btn btn-outline" href="/auth">Connexion</a>
  <a className="btn btn-primary" href="/auth">Essayer gratuitement</a>
</div>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="wrap hero-inner">
          <div>
            <div className="eyebrow">Fait pour les couturiers</div>
            <h1>
              Chaque mesure prise, <em>jamais reperdue</em>.
            </h1>
            <p className="lead">
              Ruban remplace l&apos;agenda papier par une fiche client que vous ne perdrez plus jamais — accessible depuis votre téléphone, sauvegardée automatiquement, retrouvable en quelques secondes.
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="/auth">Créer mon atelier</a>
              <a className="btn btn-outline" href="#fonctionnement">Voir comment ça marche</a>
            </div>
          </div>
          <NotebookAnimation />
        </div>
        <div className="tape-divider" aria-hidden="true">
          <svg viewBox="0 0 1120 34" preserveAspectRatio="none">
            <rect width="1120" height="34" fill="#222B3B" />
            <g stroke="#4A5468" strokeWidth={1}></g>
          </svg>
        </div>
      </section>

      <section className="problem" id="probleme">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <div className="eyebrow">Le constat</div>
            <h2>L&apos;agenda ne suffit plus.</h2>
            <p>La prise de mesure sur papier a longtemps fonctionné — jusqu&apos;à ce qu&apos;elle disparaisse, se mouille, ou tombe entre de mauvaises mains.</p>
          </div>
          <div className="torn-grid">
            <div className="torn-card" data-reveal>
              <span className="num">01</span>
              <h3>Un carnet, ça se perd</h3>
              <p>Un déménagement d&apos;atelier, un vol, un simple oubli — et des années de fiches clients disparaissent d&apos;un coup.</p>
            </div>
            <div className="torn-card" data-reveal>
              <span className="num">02</span>
              <h3>Aucun historique fiable</h3>
              <p>Impossible de savoir si la mesure du client a changé depuis la dernière commande, sans tout reprendre à zéro.</p>
            </div>
            <div className="torn-card" data-reveal>
              <span className="num">03</span>
              <h3>Rien à partager</h3>
              <p>Si un employé de l&apos;atelier prend le relais, il repart de rien — les notes du patron restent dans son seul carnet.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="fonctionnalites">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <h2>Tout ce qu&apos;un atelier moderne exige.</h2>
            <p>Pensé avec des couturiers, pour remplacer le carnet sans rien perdre de ses habitudes.</p>
          </div>
          <div className="feat-grid">
            <div className="feat-cell" data-reveal>
              <div className="feat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="4" y="3" width="16" height="18" rx="1.5" />
                  <path d="M8 8h8M8 12h8M8 16h5" />
                </svg>
              </div>
              <h3>Fiches clients</h3>
              <p>Nom, contact, notes et historique complet, accessibles en une recherche.</p>
            </div>
            <div className="feat-cell" data-reveal>
              <div className="feat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3v9l6 3" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </div>
              <h3>Historique des mesures</h3>
              <p>Chaque prise de mesure est datée et conservée — jamais écrasée par la suivante.</p>
            </div>
            <div className="feat-cell" data-reveal>
              <div className="feat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16v16H4z" />
                  <path d="M4 9h16M9 9v11" />
                </svg>
              </div>
              <h3>Modèles par vêtement</h3>
              <p>Robe, costume, boubou : les bons champs de mesure selon ce que vous coupez.</p>
            </div>
            <div className="feat-cell" data-reveal>
              <div className="feat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
                </svg>
              </div>
              <h3>Sécurité et sauvegarde</h3>
              <p>Données chiffrées, sauvegardées chaque jour. Un téléphone perdu ne fait plus perdre l&apos;atelier.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how" id="fonctionnement">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <div className="eyebrow">Le principe</div>
            <h2>Trois gestes, et c&apos;est fait.</h2>
          </div>
          <div className="how-steps">
            <div className="step" data-reveal>
              <div className="mark"><span className="num-big">01</span></div>
              <h3>Ouvrez la fiche client</h3>
              <p>Recherchez le client par nom ou numéro — ou créez-en un en quelques secondes.</p>
            </div>
            <div className="step" data-reveal>
              <div className="mark"><span className="num-big">02</span></div>
              <h3>Prenez la mesure</h3>
              <p>Choisissez le modèle du vêtement, entrez les valeurs. Ruban horodate tout automatiquement.</p>
            </div>
            <div className="step" data-reveal>
              <div className="mark"><span className="num-big">03</span></div>
              <h3>Retrouvez-la toujours</h3>
              <p>Dans un an, sur un autre téléphone, la fiche est toujours là, intacte.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="quote-section">
        <div className="wrap">
          <div className="quote-box" data-reveal>
            <div className="mark-icon">&quot;</div>
            <p className="quote">
              J&apos;ai perdu mon carnet de mesures deux fois en dix ans. Avec Ruban, je ne redoute plus jamais cette question du client : « vous vous rappelez de ma taille ? »
            </p>
            <div className="attrib">— Un couturier, atelier à Lomé</div>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="wrap">
          <h2 data-reveal>Ne reprenez plus jamais une mesure à zéro.</h2>
          <p data-reveal>Créez votre atelier sur Ruban en moins de deux minutes.</p>
         <a className="btn btn-primary" href="/auth" data-reveal>Essayer gratuitement</a>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <span>© 2026 Ruban</span>
          <span>Fait pour les couturiers, avec précision.</span>
        </div>
      </footer>
    </>
  );
}