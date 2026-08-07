import Link from "next/link";
import PricingTape from "@/components/PricingTape";
import NavBar from "@/components/NavBar";

export default function PricingPage() {
  return (
    <>
      <NavBar />

      <section className="hero" style={{ background: "var(--linen)", padding: "80px 0 40px", textAlign: "center" }}>
        <div className="wrap">
          <div className="eyebrow" style={{ color: "var(--thread)", justifyContent: "center" }}>Tarifs</div>
          <h1 style={{ color: "var(--ink)", fontSize: "clamp(30px,4vw,44px)" }}>
            Un prix simple, pensé pour votre atelier.
          </h1>
          <p style={{ color: "#5A5A54", maxWidth: 520, margin: "18px auto 0" }}>
            Commencez gratuitement. Passez au plan Atelier quand votre carnet de clients grandit.
          </p>
        </div>
      </section>

      <section className="wrap">
        <div className="plans">
          <div className="plan">
            <div className="plan-name">Découverte</div>
            <div className="plan-sub">Pour tester Ruban sur vos premiers clients</div>
            <div className="price">
              <span className="amount">Gratuit</span>
            </div>
            <div className="price-note">Sans carte bancaire, sans engagement</div>
            <ul>
              <li><CheckIcon /> Jusqu&apos;à 15 fiches clients</li>
              <li><CheckIcon /> Historique de mesures illimité</li>
              <li><CheckIcon /> Modèles de vêtements personnalisés</li>
              <li><CheckIcon /> Export PDF des fiches</li>
              <li className="muted"><CheckIcon /> Comptes employés</li>
            </ul>
            <Link className="btn btn-outline" href="/auth">Commencer gratuitement</Link>
          </div>

          <div className="plan featured">
            <div className="plan-name">Atelier</div>
            <div className="plan-sub">Pour les ateliers en activité, sans limite</div>
            <div className="price">
              <span className="amount">1 000</span>
              <span className="period">FCFA / mois</span>
            </div>
            <div className="price-note">Paiement Flooz, T-Money ou Mobile Money</div>
            <ul>
              <li><CheckIcon /> Fiches clients illimitées</li>
              <li><CheckIcon /> Historique de mesures illimité</li>
              <li><CheckIcon /> Modèles de vêtements personnalisés</li>
              <li><CheckIcon /> Export PDF des fiches</li>
              <li><CheckIcon /> Jusqu&apos;à 3 comptes employés</li>
            </ul>
            <a className="btn btn-primary" href="mailto:contact@ruban.app?subject=Passer au plan Atelier">
              Nous contacter
            </a>
          </div>
        </div>
      </section>

      <PricingTape />

      <section className="faq">
        <h2>Questions fréquentes</h2>
        <div className="faq-item">
          <h3>Comment se passe le paiement du plan Atelier ?</h3>
          <p>Pour l&apos;instant, contactez-nous directement (bouton ci-dessus) — on active votre compte manuellement après paiement par Mobile Money. Le paiement en ligne automatique arrive bientôt.</p>
        </div>
        <div className="faq-item">
          <h3>Que se passe-t-il si je dépasse 15 clients sur le plan gratuit ?</h3>
          <p>Vos fiches existantes restent accessibles et modifiables. Vous ne pourrez simplement plus en ajouter de nouvelles tant que vous n&apos;êtes pas passé au plan Atelier.</p>
        </div>
        <div className="faq-item">
          <h3>Mes données sont-elles vraiment sauvegardées ?</h3>
          <p>Oui, sur les deux plans. Chaque fiche est sauvegardée automatiquement et sécurisée — c&apos;est la raison d&apos;être de Ruban, cette garantie n&apos;est jamais limitée par le plan choisi.</p>
        </div>
        <div className="faq-item">
          <h3>Puis-je annuler à tout moment ?</h3>
          <p>Oui, sans engagement. Vous gardez l&apos;accès à vos données même après annulation, en lecture seule sur le plan gratuit.</p>
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

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}