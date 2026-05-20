import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

const LINKS = [
  ['Catégories', ['Cartes graphiques', 'Processeurs', 'SSD & stockage', 'Mémoire vive', 'Cartes mères', 'PC portables']],
  ['Outils', ['Comparateur', 'Historique des prix', 'Alertes prix', "Guides d'achat", 'Configurateur PC']],
  ['Entreprise', ['À propos', 'Contact', 'Affiliation', 'Mentions légales', 'CGU & confidentialité']],
  ['Suivez-nous', ['Bons plans Telegram', 'Newsletter hebdo', 'X / Twitter', 'YouTube']],
] as const

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-soft)',
        padding: '40px 32px 28px',
        background: 'var(--bg-deep)',
        color: 'var(--text-meta)',
        fontSize: 13,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr',
          gap: 32,
          marginBottom: 32,
        }}
      >
        <div>
          <Logo size={16} />
          <p style={{ marginTop: 14, lineHeight: 1.6, maxWidth: 280 }}>
            Comparateur français de prix pour composants informatiques et électronique grand public. Prix rafraîchis chaque heure.
          </p>
        </div>
        {LINKS.map(([title, items]) => (
          <div key={title}>
            <div style={{ color: 'var(--text)', fontWeight: 600, marginBottom: 10, fontSize: 13 }}>
              {title}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 7 }}>
              {items.map((item) => (
                <li key={item}>
                  <Link href="#" style={{ color: 'var(--text-meta)' }}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: 20,
          borderTop: '1px solid var(--border-soft)',
          fontSize: 12,
          color: 'var(--text-dim)',
        }}
      >
        <span>© 2026 Electronic Star · Les prix affichés incluent les taxes françaises (TVA 20%).</span>
        <span className="mono">v1.0 · données crawlées toutes les heures</span>
      </div>
    </footer>
  )
}
