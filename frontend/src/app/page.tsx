import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { Price, formatPriceStr } from '@/components/ui/Price'
import { Sparkline } from '@/components/ui/Sparkline'
import { StoreBadge } from '@/components/ui/StoreBadge'
import { api } from '@/lib/api'
import type { Category } from '@/lib/types'

// Demo data (until backend has /api/products/deals endpoint)
const DEALS = [
  { name: 'GeForce RTX 4070 SUPER 12 Go', brand: 'ASUS TUF', price: 649.90, old: 759.99, drop: 14, store: 'LDLC', tag: 'Meilleur prix 30j', spark: [780,770,760,755,750,740,730,720,700,690,680,665,650,649], slug: 'asus-tuf-rtx4070super-oc' },
  { name: 'Ryzen 7 7800X3D', brand: 'AMD', price: 369.00, old: 449.00, drop: 18, store: 'Amazon', tag: 'Bon plan du jour', spark: [470,465,455,450,445,440,430,425,415,400,390,380,372,369], slug: 'amd-ryzen7-7800x3d' },
  { name: 'Samsung 990 Pro 2 To NVMe', brand: 'Samsung', price: 159.99, old: 199.99, drop: 20, store: 'Cdiscount', tag: 'Stock limité', spark: [210,205,200,200,195,190,185,180,178,172,170,165,162,159], slug: 'samsung-990-pro-2to' },
  { name: 'LG OLED 27" 240Hz QHD', brand: 'LG UltraGear', price: 749.00, old: 899.00, drop: 17, store: 'Fnac', tag: '-17%', spark: [920,910,890,880,870,860,840,820,810,800,780,770,760,749], slug: 'lg-ultragear-27gn950' },
]

const TOP_DROPS = [
  { name: 'Corsair Vengeance 32Go DDR5-6000', cat: 'Mémoire vive', from: 199.90, to: 119.90, store: 'TopAchat', spark: [210,205,200,195,180,170,160,150,140,135,128,122,120,119] },
  { name: 'MSI MAG B650 Tomahawk WiFi', cat: 'Cartes mères', from: 259.00, to: 199.00, store: 'LDLC', spark: [270,265,260,258,250,240,235,228,220,215,210,205,200,199] },
  { name: 'Arduino Uno R4 WiFi', cat: 'Arduino & DIY', from: 32.90, to: 24.90, store: 'Amazon', spark: [35,34,34,33,32,32,31,30,28,27,26,25,25,24] },
  { name: 'Sony WH-1000XM5', cat: 'Audio', from: 399.00, to: 279.00, store: 'Boulanger', spark: [410,400,395,390,380,360,340,330,320,310,300,290,285,279] },
  { name: 'Samsung Galaxy S25 256Go', cat: 'Smartphones', from: 899.00, to: 749.00, store: 'Cdiscount', spark: [950,940,920,900,890,870,850,830,820,800,790,770,755,749] },
]

const STATIC_CATEGORIES = [
  { name: 'Cartes graphiques', count: 412, icon: 'gpu', slug: 'cartes-graphiques', hot: true },
  { name: 'Processeurs', count: 287, icon: 'cpu', slug: 'processeurs', hot: true },
  { name: 'SSD & stockage', count: 1248, icon: 'ssd', slug: 'ssd-stockage' },
  { name: 'Mémoire vive', count: 632, icon: 'ram', slug: 'memoire-vive' },
  { name: 'Cartes mères', count: 521, icon: 'mobo', slug: 'cartes-meres' },
  { name: 'Écrans', count: 894, icon: 'monitor', slug: 'ecrans', hot: true },
  { name: 'Audio & casques', count: 1102, icon: 'headphones', slug: 'audio' },
  { name: 'Claviers & souris', count: 2003, icon: 'keyboard', slug: 'peripheriques' },
  { name: 'Smartphones', count: 458, icon: 'smartphone', slug: 'smartphones' },
  { name: 'PC portables', count: 612, icon: 'laptop', slug: 'pc-portables' },
  { name: 'Arduino & DIY', count: 318, icon: 'chip', slug: 'arduino-diy' },
  { name: 'Périphériques', count: 1456, icon: 'cart', slug: 'peripheriques-divers' },
]

async function getCategories() {
  try {
    return await api.getCategories()
  } catch {
    return null
  }
}

function DealCard({ d }: { d: typeof DEALS[0] }) {
  return (
    <Link href={`/produits/${d.slug}`} style={{ textDecoration: 'none' }}>
      <div className="es-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ position: 'relative', padding: 18 }}>
          <div className="es-img" style={{ height: 150, width: '100%' }}>{d.brand}</div>
          <span className="es-chip is-accent" style={{ position: 'absolute', top: 14, left: 14 }}>
            <Icon name="flame" size={12} /> -{d.drop}%
          </span>
          <span style={{
            position: 'absolute', top: 14, right: 14,
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--bg-deep)', border: '1px solid var(--border-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)',
          }}>
            <Icon name="heart" size={15} />
          </span>
        </div>
        <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--text-meta)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{d.brand}</span>
            <span className="es-chip is-cool" style={{ height: 22 }}>{d.tag}</span>
          </div>
          <div style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.3, color: 'var(--text)', minHeight: 40 }}>{d.name}</div>
          <Sparkline data={d.spark} width={232} height={36} color="var(--down)" />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginTop: 4 }}>
            <Price value={d.price} big />
            <span className="mono" style={{ fontSize: 12, color: 'var(--text-meta)', textDecoration: 'line-through', marginBottom: 8 }}>
              {formatPriceStr(d.old)} €
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 6 }}>
            <StoreBadge name={d.store} size={24} />
            <button className="es-btn is-primary is-sm">Voir <Icon name="chevron" size={13} /></button>
          </div>
        </div>
      </div>
    </Link>
  )
}

function CategoryList({ categories }: { categories: (typeof STATIC_CATEGORIES)[0][] }) {
  return (
    <div className="es-card" style={{ padding: 8 }}>
      {categories.map((c, i) => (
        <Link key={c.slug} href={`/categories/${c.slug}`}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '12px 14px', borderRadius: 8, cursor: 'pointer',
            background: i === 0 ? 'var(--surface-2)' : 'transparent',
            transition: 'background .1s',
          }}>
            <span style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'var(--bg-deep)', border: '1px solid var(--border-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'hot' in c && c.hot ? 'var(--accent)' : 'var(--text-muted)',
            }}>
              <Icon name={c.icon} size={18} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                {c.name}
                {'hot' in c && c.hot && (
                  <span className="es-chip is-accent" style={{ height: 18, fontSize: 10, padding: '0 6px' }}>HOT</span>
                )}
              </div>
            </div>
            <span className="mono" style={{ fontSize: 12, color: 'var(--text-meta)' }}>
              {c.count.toLocaleString('fr-FR')}
            </span>
            <Icon name="chevron" size={14} stroke={2} />
          </div>
        </Link>
      ))}
    </div>
  )
}

export default async function HomePage() {
  const apiCategories = await getCategories()

  const categories = apiCategories
    ? apiCategories.map((c: Category) => ({
        name: c.name,
        slug: c.slug,
        icon: c.icon ?? 'chip',
        count: c.productCount ?? 0,
        hot: false,
      }))
    : STATIC_CATEGORIES

  return (
    <>
      {/* Hero */}
      <section style={{ padding: '64px 48px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(60% 60% at 80% 0%, var(--accent-soft), transparent 65%), radial-gradient(50% 50% at 5% 30%, rgba(56,189,248,0.08), transparent 70%)',
        }} />
        <div style={{ position: 'relative', maxWidth: 920 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span className="es-chip is-accent"><Icon name="sparkle" size={12} />Prix mis à jour il y a 23 min</span>
            <span className="es-chip">12 487 produits suivis</span>
            <span className="es-chip"><Icon name="truck" size={12} />5 boutiques françaises</span>
          </div>
          <h1 style={{ fontSize: 72, lineHeight: 0.98, letterSpacing: '-0.035em', maxWidth: 880 }}>
            Le meilleur prix pour vos<br />
            <span style={{ color: 'var(--accent)' }}>composants & écrans</span> en un coup d&apos;œil.
          </h1>
          <p style={{ marginTop: 22, fontSize: 18, color: 'var(--text-muted)', maxWidth: 620, lineHeight: 1.55 }}>
            Comparez Amazon, Cdiscount, LDLC, Fnac et Boulanger en temps réel. Suivez l&apos;historique des prix, déclenchez une alerte au seuil de votre choix.
          </p>

          <div style={{
            marginTop: 32, maxWidth: 720,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '6px 6px 6px 18px',
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 20px 60px -20px rgba(0,0,0,0.6)',
          }}>
            <Icon name="search" size={20} />
            <input
              placeholder="RTX 4070 Super, Ryzen 7 7800X3D..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: 'var(--text)', fontSize: 18, height: 52, fontFamily: 'inherit',
              }}
            />
            <button className="es-btn is-primary is-lg">Rechercher</button>
          </div>

          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-meta)', fontSize: 13, marginRight: 6 }}>Populaire :</span>
            {[
              { icon: 'gpu', label: 'Cartes graphiques', slug: 'cartes-graphiques' },
              { icon: 'cpu', label: 'Processeurs', slug: 'processeurs' },
              { icon: 'ssd', label: 'SSD', slug: 'ssd-stockage' },
              { icon: 'ram', label: 'Mémoire vive', slug: 'memoire-vive' },
              { icon: 'laptop', label: 'PC portables', slug: 'pc-portables' },
            ].map((c) => (
              <Link key={c.slug} href={`/categories/${c.slug}`}>
                <span className="es-chip" style={{ height: 32, padding: '0 12px', cursor: 'pointer' }}>
                  <Icon name={c.icon} size={13} /> {c.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div style={{
          position: 'relative',
          marginTop: 56, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: '1px solid var(--border-soft)', paddingTop: 28,
        }}>
          {[
            ['12 487', 'produits suivis'],
            ['5', 'boutiques croisées'],
            ['1h', 'fréquence de crawl'],
            ['2 416 €', "d'économies générées cette semaine"],
          ].map(([n, l], i) => (
            <div key={i} style={{ padding: '0 24px', borderLeft: i ? '1px solid var(--border-soft)' : 'none' }}>
              <div className="mono" style={{ fontSize: 32, color: 'var(--text)', fontWeight: 600, letterSpacing: '-0.02em' }}>{n}</div>
              <div style={{ fontSize: 13, color: 'var(--text-meta)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bons plans */}
      <section style={{ padding: '32px 48px' }}>
        <div className="es-section-h">
          <div>
            <h2>Bons plans du jour</h2>
            <div className="sub">Les plus grosses baisses détectées sur les dernières 24 heures.</div>
          </div>
          <a className="more" href="#">Tous les bons plans <Icon name="chevron" size={13} /></a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          {DEALS.map((d) => <DealCard key={d.name} d={d} />)}
        </div>
      </section>

      {/* Top baisses + Catégories */}
      <section style={{ padding: '32px 48px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
        <div>
          <div className="es-section-h">
            <div>
              <h2>Plus grosses baisses · cette semaine</h2>
              <div className="sub">Classement automatique sur 7 jours glissants.</div>
            </div>
            <a className="more" href="#">Voir le top 50 <Icon name="chevron" size={13} /></a>
          </div>
          <div className="es-card">
            {TOP_DROPS.map((p, i) => (
              <div key={p.name} style={{
                display: 'grid',
                gridTemplateColumns: '24px 1.4fr 1fr 1fr 1fr 80px',
                alignItems: 'center', gap: 16,
                padding: '14px 18px',
                borderBottom: i < TOP_DROPS.length - 1 ? '1px solid var(--border-soft)' : 'none',
              }}>
                <span className="mono" style={{ color: 'var(--text-dim)', fontSize: 13 }}>0{i + 1}</span>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text)' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-meta)', marginTop: 2 }}>{p.cat}</div>
                </div>
                <Sparkline data={p.spark} width={100} height={32} color="var(--down)" />
                <div>
                  <Price value={p.to} />
                  <div className="mono" style={{ fontSize: 11, color: 'var(--text-meta)', textDecoration: 'line-through', marginTop: 2 }}>
                    {formatPriceStr(p.from)} €
                  </div>
                </div>
                <StoreBadge name={p.store} size={22} />
                <span className="trend down mono" style={{ fontSize: 13, fontWeight: 600, justifySelf: 'end' }}>
                  -{Math.round((1 - p.to / p.from) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="es-section-h">
            <div>
              <h2>Explorer par catégorie</h2>
              <div className="sub">12 487 produits dans {categories.length} univers.</div>
            </div>
          </div>
          <CategoryList categories={categories.slice(0, 12) as typeof STATIC_CATEGORIES} />
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '32px 48px 56px' }}>
        <div className="es-section-h">
          <div>
            <h2>Comment fonctionne Electronic Star</h2>
            <div className="sub">Pas d&apos;astuce. Des crawlers, un comparateur, et zéro publicité déguisée.</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {[
            { n: '01', t: 'On crawle, chaque heure', d: 'Cinq boutiques françaises auscultées en continu via API officielle ou parsing HTML. Délai 3–5s entre les requêtes pour rester poli avec leurs serveurs.', icon: 'bolt' },
            { n: '02', t: 'On compare, sans biais', d: "Notre moteur lit chaque clé technique (VRAM, TDP, fréquence…) et désigne le vainqueur. Score global pondéré, transparent, ouvert.", icon: 'sparkle' },
            { n: '03', t: 'Vous payez moins, plus vite', d: "Lien d'affiliation direct vers la meilleure offre. L'historique complet est conservé, vous pouvez créer une alerte sur n'importe quel seuil.", icon: 'crown' },
          ].map((s) => (
            <div key={s.n} className="es-card" style={{ padding: 26 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <span className="mono" style={{ fontSize: 12, color: 'var(--accent)' }}>{s.n}</span>
                <span style={{ color: 'var(--text-meta)' }}><Icon name={s.icon} size={20} /></span>
              </div>
              <h3 style={{ fontSize: 22, marginBottom: 10 }}>{s.t}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
