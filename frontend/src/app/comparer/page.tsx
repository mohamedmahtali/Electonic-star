'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { Price } from '@/components/ui/Price'
import { StoreBadge } from '@/components/ui/StoreBadge'
import { api } from '@/lib/api'
import type { CompareResult } from '@/lib/types'

// Lower is better for these spec keys
const LOWER_BETTER = new Set(['tdp', 'tdp_w', 'noise', 'weight', 'length', 'alimentation'])

function ScoreRing({ score, color, size = 96 }: { score: number; color: string; size?: number }) {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-soft)" strokeWidth="6" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        fontFamily="var(--font-mono)" fontSize={size * 0.32} fontWeight="700" fill="var(--text)">
        {score}
      </text>
    </svg>
  )
}

// Demo data for when the API returns a compare result
const COLORS = ['var(--accent)', 'var(--cool)', '#C4B5FD', '#86EFAC']

function CompareTable({ result }: { result: CompareResult }) {
  const products = result.products
  const keys = Object.keys(result.criteriaResults)
  const winner = result.overallWinner

  return (
    <div className="es-card" style={{ overflow: 'hidden' }}>
      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: `200px ${products.map(() => '1fr').join(' ')}`, borderBottom: '1px solid var(--border-soft)' }}>
        <div style={{ background: 'var(--bg-deep)', padding: 22, borderRight: '1px solid var(--border-soft)' }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--text-meta)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Caractéristique
          </div>
        </div>
        {products.map((p, idx) => {
          const color = COLORS[idx] ?? 'var(--text-muted)'
          const isWinner = idx === winner
          const bestPrice = p.prices.reduce((min, pr) => (pr.price < min.price ? pr : min), p.prices[0] ?? { price: 0, store: '' })
          return (
            <div key={p.id} style={{ borderRight: '1px solid var(--border-soft)', position: 'relative' }}>
              {isWinner && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }} />
              )}
              <div style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--text-meta)', letterSpacing: '0.1em' }}>
                    COLONNE {String.fromCharCode(65 + idx)}
                  </span>
                  {isWinner && (
                    <span className="es-chip" style={{
                      height: 22, fontSize: 11,
                      background: `color-mix(in oklab, ${color} 14%, transparent)`,
                      borderColor: `color-mix(in oklab, ${color} 42%, transparent)`,
                      color,
                    }}>
                      <Icon name="crown" size={11} /> Vainqueur
                    </span>
                  )}
                </div>
                <Link href={`/produits/${p.slug}`} style={{ fontSize: 18, fontWeight: 600, display: 'block', marginBottom: 8 }}>
                  {p.name}
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14 }}>
                  <ScoreRing score={result.scores[idx] ?? 50} color={color} />
                  <div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--text-meta)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Score Electronic Star
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                      Pondéré sur {keys.length} critères
                    </div>
                  </div>
                </div>
                {bestPrice.price > 0 && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-soft)' }}>
                    <Price value={bestPrice.price} big />
                    {bestPrice.store && (
                      <div style={{ marginTop: 8 }}>
                        <StoreBadge name={bestPrice.store} />
                      </div>
                    )}
                  </div>
                )}
                {bestPrice.price > 0 && (
                  <button className={`es-btn is-sm ${isWinner ? 'is-primary' : ''}`} style={{ width: '100%', marginTop: 14 }}>
                    Voir l&apos;offre <Icon name="chevron" size={13} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Spec rows */}
      {keys.map((key) => {
        const cr = result.criteriaResults[key]
        return (
          <div key={key} style={{
            display: 'grid',
            gridTemplateColumns: `200px ${products.map(() => '1fr').join(' ')}`,
            borderTop: '1px solid var(--border-soft)',
            fontSize: 13,
          }}>
            <div style={{
              padding: '18px 22px',
              background: 'var(--bg-deep)',
              borderRight: '1px solid var(--border-soft)',
              color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ flex: 1 }}>{key}</span>
              {LOWER_BETTER.has(key.toLowerCase()) && (
                <span className="es-chip" style={{ height: 18, fontSize: 9, padding: '0 6px' }}>+ bas = mieux</span>
              )}
            </div>
            {products.map((_, idx) => {
              const val = cr.values[idx]
              const isWinner = cr.winner === idx
              const color = COLORS[idx] ?? 'var(--text-muted)'
              return (
                <div key={idx} style={{
                  padding: '18px 22px',
                  borderRight: '1px solid var(--border-soft)',
                  background: isWinner ? `color-mix(in oklab, ${color} 6%, transparent)` : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                }}>
                  <div className="mono" style={{
                    fontSize: 14,
                    color: isWinner ? color : 'var(--text)',
                    fontWeight: isWinner ? 600 : 500,
                  }}>
                    {val != null ? String(val) : '—'}
                  </div>
                  {isWinner && (
                    <span style={{ color, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      <Icon name="check" size={12} stroke={2.5} /> mieux
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

function AddProductSlot({ onAdd }: { onAdd: (slug: string) => void }) {
  const [input, setInput] = useState('')
  return (
    <div style={{
      border: '1.5px dashed var(--border)',
      borderRadius: 14,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32, color: 'var(--text-meta)', minHeight: 200,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        border: '1.5px dashed var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
      }}>
        <Icon name="plus" size={22} stroke={1.8} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4, marginBottom: 14 }}>
        Ajouter un produit<br />à comparer
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="slug du produit..."
        style={{
          width: '100%', maxWidth: 220, padding: '8px 12px',
          background: 'var(--surface)', border: '1px solid var(--border-soft)',
          borderRadius: 8, color: 'var(--text)', fontSize: 13, fontFamily: 'inherit',
          outline: 'none',
        }}
        onKeyDown={(e) => { if (e.key === 'Enter' && input.trim()) { onAdd(input.trim()); setInput('') } }}
      />
      <button className="es-btn is-sm" style={{ marginTop: 10 }} onClick={() => { if (input.trim()) { onAdd(input.trim()); setInput('') } }}>
        Ajouter
      </button>
    </div>
  )
}

export default function ComparePage() {
  const [productIds, setProductIds] = useState<string[]>([])

  const { data: result, isLoading, error } = useQuery({
    queryKey: ['compare', productIds],
    queryFn: () => api.compare(productIds),
    enabled: productIds.length >= 2,
  })

  const handleAdd = (slug: string) => {
    setProductIds((prev) => [...prev, slug])
  }

  const handleRemove = (idx: number) => {
    setProductIds((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <>
      <section style={{ padding: '32px 48px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-meta)', fontSize: 13, marginBottom: 18 }}>
          <Link href="/" style={{ color: 'var(--text-meta)' }}>Accueil</Link>
          <Icon name="chevron" size={12} />
          <span style={{ color: 'var(--text)' }}>Comparateur</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span className="es-chip is-accent"><Icon name="sparkle" size={12} />Comparateur</span>
              <span className="es-chip">{productIds.length} produit{productIds.length > 1 ? 's' : ''} sélectionné{productIds.length > 1 ? 's' : ''}</span>
            </div>
            <h1 style={{ fontSize: 38, letterSpacing: '-0.025em' }}>
              {productIds.length === 0 ? 'Comparez vos produits' : productIds.join(' vs ')}
            </h1>
            <p style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: 14, maxWidth: 640 }}>
              Ajoutez 2 à 4 produits par leur slug pour comparer leurs specs et prix côte à côte.
            </p>
          </div>
          {result && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="es-btn is-sm"><Icon name="share" size={13} /> Partager</button>
              <button className="es-btn is-sm"><Icon name="download" size={13} /> Exporter PDF</button>
            </div>
          )}
        </div>
      </section>

      {/* Product slots */}
      {productIds.length < 4 && !result && (
        <section style={{ padding: '0 48px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(productIds.length + 1, 4)}, 1fr)`, gap: 18 }}>
            {productIds.map((id, idx) => (
              <div key={idx} className="es-card" style={{ padding: 18, position: 'relative' }}>
                <button
                  onClick={() => handleRemove(idx)}
                  style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'var(--surface-2)', border: 'none',
                    color: 'var(--text-muted)', borderRadius: 6, width: 28, height: 28,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon name="cross" size={13} />
                </button>
                <div className="es-img" style={{ height: 100, marginBottom: 10 }}>{id}</div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{id}</div>
              </div>
            ))}
            {productIds.length < 4 && <AddProductSlot onAdd={handleAdd} />}
          </div>
        </section>
      )}

      {/* Loading */}
      {isLoading && (
        <section style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="mono" style={{ fontSize: 13 }}>Chargement de la comparaison…</div>
        </section>
      )}

      {/* Error */}
      {error && (
        <section style={{ padding: '0 48px 24px' }}>
          <div style={{ padding: 24, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 10, color: 'var(--up)', fontSize: 13 }}>
            Impossible de charger la comparaison. Vérifiez que le backend est démarré sur localhost:8080.
          </div>
        </section>
      )}

      {/* Result */}
      {result && (
        <>
          {/* Verdict banner */}
          <section style={{ padding: '0 48px 24px' }}>
            <div className="es-card" style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: `1fr auto ${result.products.map(() => '').join(' 1fr ')} `, alignItems: 'center', gap: 24 }}>
              <div style={{ textAlign: 'center', padding: '14px 22px', background: 'var(--accent-soft)', border: '1px solid var(--accent-edge)', borderRadius: 999, color: 'var(--accent)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                <Icon name="crown" size={16} /> Vainqueur global : {result.products[result.overallWinner]?.name}
              </div>
            </div>
          </section>

          <section style={{ padding: '0 48px 48px' }}>
            <CompareTable result={result} />
          </section>
        </>
      )}

      {/* Empty state */}
      {productIds.length === 0 && (
        <section style={{ padding: '0 48px 56px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
            {[0, 1].map((i) => <AddProductSlot key={i} onAdd={handleAdd} />)}
          </div>
        </section>
      )}
    </>
  )
}
