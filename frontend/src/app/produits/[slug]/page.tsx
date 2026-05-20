import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Icon } from '@/components/ui/Icon'
import { Price, formatPriceStr } from '@/components/ui/Price'
import { StoreBadge } from '@/components/ui/StoreBadge'
import { api } from '@/lib/api'
import type { Price as PriceType, PriceHistory, Product } from '@/lib/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const product = await api.getProduct(slug)
    return {
      title: product.name,
      description: `Comparez les prix du ${product.name} sur 5 boutiques françaises. Historique des prix et alertes disponibles.`,
    }
  } catch {
    return { title: 'Produit introuvable' }
  }
}

function HistoryChart({ data, width = 700, height = 240 }: { data: { label: string; value: number }[]; width?: number; height?: number }) {
  if (data.length < 2) return null

  const padL = 48, padR = 16, padT = 20, padB = 28
  const innerW = width - padL - padR
  const innerH = height - padT - padB
  const vals = data.map((d) => d.value)
  const max = Math.ceil(Math.max(...vals) / 50) * 50 + 20
  const min = Math.floor(Math.min(...vals) / 50) * 50 - 20
  const range = max - min

  const x = (i: number) => padL + (i / (data.length - 1)) * innerW
  const y = (v: number) => padT + (1 - (v - min) / range) * innerH

  const linePath = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L ${padL + innerW} ${padT + innerH} L ${padL} ${padT + innerH} Z`

  const minIdx = vals.indexOf(Math.min(...vals))
  const ticks = [min, min + range * 0.25, min + range * 0.5, min + range * 0.75, max]

  return (
    <svg width={width} height={height} style={{ display: 'block', width: '100%' }}>
      <defs>
        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--cool)" stopOpacity="0.4" />
          <stop offset="1" stopColor="var(--cool)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={padL} y1={y(t)} x2={padL + innerW} y2={y(t)} stroke="var(--border-soft)" strokeDasharray="3 4" />
          <text x={padL - 8} y={y(t) + 4} textAnchor="end" fill="var(--text-meta)" fontSize="11" fontFamily="var(--font-mono)">{Math.round(t)}</text>
        </g>
      ))}
      {data.map((d, i) => i % Math.ceil(data.length / 8) === 0 && (
        <text key={i} x={x(i)} y={height - 8} textAnchor="middle" fill="var(--text-dim)" fontSize="11" fontFamily="var(--font-mono)">{d.label}</text>
      ))}
      <path d={areaPath} fill="url(#chart-grad)" />
      <path d={linePath} fill="none" stroke="var(--cool)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Min marker */}
      <circle cx={x(minIdx)} cy={y(vals[minIdx])} r="5" fill="var(--bg)" stroke="var(--down)" strokeWidth="2" />
      <line x1={x(minIdx)} y1={y(vals[minIdx])} x2={x(minIdx)} y2={padT + innerH} stroke="var(--down)" strokeDasharray="2 3" opacity="0.5" />
      {/* Current */}
      <circle cx={x(data.length - 1)} cy={y(vals[vals.length - 1])} r="6" fill="var(--accent)" />
      <circle cx={x(data.length - 1)} cy={y(vals[vals.length - 1])} r="11" fill="var(--accent)" opacity="0.2" />
    </svg>
  )
}

function PriceTable({ prices }: { prices: PriceType[] }) {
  const sorted = [...prices].sort((a, b) => a.price - b.price)
  const best = sorted[0]

  return (
    <div className="es-card">
      <div style={{
        display: 'grid', gridTemplateColumns: '1.3fr 0.8fr 1fr 1fr 0.8fr',
        padding: '12px 22px',
        fontSize: 11, color: 'var(--text-meta)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        fontFamily: 'var(--font-mono)',
        borderBottom: '1px solid var(--border-soft)',
      }}>
        <span>Boutique</span>
        <span>Prix</span>
        <span>Livraison</span>
        <span>Disponibilité</span>
        <span></span>
      </div>
      {sorted.map((offer, i) => {
        const isBest = offer.store === best.store
        return (
          <div key={offer.store} style={{
            display: 'grid', gridTemplateColumns: '1.3fr 0.8fr 1fr 1fr 0.8fr',
            padding: '18px 22px', alignItems: 'center', gap: 12,
            background: isBest ? 'rgba(249, 115, 22, 0.04)' : 'transparent',
            borderBottom: i < sorted.length - 1 ? '1px solid var(--border-soft)' : 'none',
            borderLeft: isBest ? '3px solid var(--accent)' : '3px solid transparent',
            paddingLeft: isBest ? 19 : 22,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <StoreBadge name={offer.store} size={36} />
              {isBest && <span className="es-chip is-accent" style={{ height: 22, fontSize: 11 }}><Icon name="crown" size={11} />Meilleur</span>}
            </div>
            <div><Price value={offer.price} /></div>
            <div style={{ fontSize: 13, color: 'var(--text)' }}>
              {offer.shipping ?? 'Gratuite'}
              <div style={{ fontSize: 11, color: 'var(--text-meta)' }}>{offer.delivery ?? '2–3 jours'}</div>
            </div>
            <div style={{ fontSize: 13, color: offer.stock === 'En stock' ? 'var(--down)' : 'var(--warn)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
              {offer.stock ?? 'En stock'}
            </div>
            <a href={offer.url} target="_blank" rel="noopener noreferrer" style={{ justifySelf: 'end' }}>
              <button className={`es-btn is-sm ${isBest ? 'is-primary' : ''}`}>
                Voir <Icon name="chevron" size={12} />
              </button>
            </a>
          </div>
        )
      })}
    </div>
  )
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  let product: Product
  try {
    product = await api.getProduct(slug)
  } catch {
    notFound()
  }

  let history: PriceHistory[] = []
  try {
    history = await api.getPriceHistory(product.id)
  } catch {
    // history unavailable
  }

  const bestPrice = product.prices.reduce(
    (min, p) => (p.price < min.price ? p : min),
    product.prices[0] ?? { price: 0, store: '', url: '#' }
  )

  const historyPoints = history.map((h) => ({
    label: new Date(h.recordedAt).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    value: h.price,
  }))

  const specs = product.description?.typeDetails
    ? Object.entries(product.description.typeDetails)
    : []

  const histMin = historyPoints.length ? Math.min(...historyPoints.map((h) => h.value)) : bestPrice.price
  const histMax = historyPoints.length ? Math.max(...historyPoints.map((h) => h.value)) : bestPrice.price
  const histAvg = historyPoints.length ? historyPoints.reduce((s, h) => s + h.value, 0) / historyPoints.length : bestPrice.price

  return (
    <>
      {/* Breadcrumb */}
      <section style={{ padding: '24px 48px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-meta)', fontSize: 13 }}>
          <Link href="/" style={{ color: 'var(--text-meta)' }}>Accueil</Link>
          <Icon name="chevron" size={12} />
          <Link href={`/categories/${product.category.slug}`} style={{ color: 'var(--text-meta)' }}>
            {product.category.name}
          </Link>
          <Icon name="chevron" size={12} />
          <span style={{ color: 'var(--text)' }}>{product.name}</span>
        </div>
      </section>

      {/* Hero: gallery + title + best price */}
      <section style={{ padding: '24px 48px', display: 'grid', gridTemplateColumns: '400px 1fr 300px', gap: 32 }}>
        {/* Gallery */}
        <div>
          <div className="es-img" style={{ height: 340, fontSize: 13 }}>
            {product.images[0] ? (
              <img src={product.images[0].url} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
            ) : `${product.brand.name} · ${product.category.name}`}
          </div>
          {product.images.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 10 }}>
              {product.images.slice(0, 5).map((img, i) => (
                <div key={i} className="es-img" style={{ height: 60, borderColor: i === 0 ? 'var(--accent)' : 'var(--border-soft)' }}>
                  <img src={img.url} alt={img.alt} style={{ maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Title + summary */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span className="mono" style={{ fontSize: 12, color: 'var(--text-meta)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {product.brand.name}
            </span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-dim)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-meta)' }}>{product.category.name}</span>
          </div>
          <h1 style={{ fontSize: 34, lineHeight: 1.1, letterSpacing: '-0.025em', marginBottom: 16 }}>
            {product.name}
          </h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
            {product.tags.map((tag) => (
              <span key={tag.slug} className="es-chip is-accent">{tag.name}</span>
            ))}
            <span className="es-chip"><Icon name="check" size={12} />Stock confirmé {product.prices.length} boutiques</span>
          </div>

          {/* Key specs strip */}
          {specs.length > 0 && (
            <div style={{
              display: 'grid', gridTemplateColumns: `repeat(${Math.min(specs.length, 4)}, 1fr)`, gap: 1,
              background: 'var(--border-soft)', borderRadius: 10, overflow: 'hidden',
              border: '1px solid var(--border-soft)',
            }}>
              {specs.slice(0, 4).map(([k, v]) => (
                <div key={k} style={{ background: 'var(--surface)', padding: '14px 16px' }}>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--text-meta)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{k}</div>
                  <div className="mono" style={{ fontSize: 18, color: 'var(--text)', fontWeight: 600, marginTop: 6 }}>{v}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Best price card */}
        <aside>
          <div className="es-card" style={{ padding: 22 }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--text-meta)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Meilleur prix actuel
            </div>
            <div style={{ marginTop: 12 }}>
              <Price value={bestPrice.price} big />
            </div>
            {histMin < bestPrice.price * 0.99 && (
              <div className="trend down mono" style={{ marginTop: 6, fontSize: 13 }}>
                ↓ Bas historique : {formatPriceStr(histMin)} €
              </div>
            )}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-soft)' }}>
              <StoreBadge name={bestPrice.store} size={32} />
              <div style={{ fontSize: 12, color: 'var(--text-meta)', marginTop: 8, display: 'grid', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Livraison</span>
                  <span style={{ color: 'var(--text)' }}>{bestPrice.shipping ?? 'Gratuite'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Stock</span>
                  <span style={{ color: 'var(--down)' }}>✓ En stock</span>
                </div>
              </div>
            </div>
            <a href={bestPrice.url} target="_blank" rel="noopener noreferrer">
              <button className="es-btn is-primary is-lg" style={{ width: '100%', marginTop: 18 }}>
                Voir l&apos;offre chez {bestPrice.store.charAt(0).toUpperCase() + bestPrice.store.slice(1)} <Icon name="chevron" size={14} />
              </button>
            </a>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
              <button className="es-btn is-sm"><Icon name="bell" size={13} /> Alerter</button>
              <Link href="/comparer">
                <button className="es-btn is-sm" style={{ width: '100%' }}><Icon name="plus" size={13} /> Comparer</button>
              </Link>
            </div>
          </div>
        </aside>
      </section>

      {/* Price comparison table */}
      {product.prices.length > 0 && (
        <section style={{ padding: '12px 48px 32px' }}>
          <div className="es-section-h">
            <div>
              <h2>Comparer les boutiques</h2>
              <div className="sub">{product.prices.length} boutiques surveillées</div>
            </div>
          </div>
          <PriceTable prices={product.prices} />
        </section>
      )}

      {/* History chart + specs */}
      <section style={{ padding: '12px 48px 32px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        <div className="es-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <h3 style={{ fontSize: 20 }}>Historique des prix</h3>
              <div style={{ fontSize: 13, color: 'var(--text-meta)', marginTop: 4 }}>
                Toutes boutiques · {historyPoints.length} relevés
              </div>
            </div>
          </div>
          {historyPoints.length > 1 ? (
            <>
              <div style={{ marginTop: 18 }}>
                <HistoryChart data={historyPoints} />
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                marginTop: 8, paddingTop: 18, borderTop: '1px solid var(--border-soft)',
              }}>
                {[
                  ['Actuel', `${formatPriceStr(bestPrice.price)} €`, 'var(--accent)'],
                  ['Moyenne', `${formatPriceStr(histAvg)} €`, 'var(--text)'],
                  ['Mini', `${formatPriceStr(histMin)} €`, 'var(--down)'],
                  ['Maxi', `${formatPriceStr(histMax)} €`, 'var(--up)'],
                ].map(([l, v, c], i) => (
                  <div key={l} style={{ padding: '0 16px', borderLeft: i ? '1px solid var(--border-soft)' : 'none' }}>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--text-meta)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{l}</div>
                    <div className="mono" style={{ fontSize: 18, color: c, fontWeight: 600, marginTop: 6 }}>{v}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-meta)', fontSize: 13 }}>
              Pas encore assez de données pour afficher l&apos;historique.
            </div>
          )}
        </div>

        {/* Specs */}
        <div className="es-card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 20, marginBottom: 4 }}>Fiche technique</h3>
          <div style={{ fontSize: 13, color: 'var(--text-meta)', marginBottom: 18 }}>
            <span className="mono">type_details</span> · {specs.length} propriétés
          </div>
          {specs.length > 0 ? (
            <dl className="es-kv">
              {specs.slice(0, 10).map(([k, v]) => (
                <>
                  <dt key={`dt-${k}`}>{k}</dt>
                  <dd key={`dd-${k}`} className="mono">{String(v)}</dd>
                </>
              ))}
            </dl>
          ) : (
            <p style={{ color: 'var(--text-meta)', fontSize: 13 }}>Aucune spécification disponible.</p>
          )}
          {specs.length > 10 && (
            <button className="es-btn is-ghost is-sm" style={{ marginTop: 16, width: '100%' }}>
              Voir les {specs.length} caractéristiques <Icon name="chevronDown" size={13} />
            </button>
          )}
        </div>
      </section>
    </>
  )
}
