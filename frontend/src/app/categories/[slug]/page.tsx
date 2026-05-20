import Link from 'next/link'
import type { Metadata } from 'next'
import { Icon } from '@/components/ui/Icon'
import { Price } from '@/components/ui/Price'
import { Sparkline } from '@/components/ui/Sparkline'
import { StoreBadge } from '@/components/ui/StoreBadge'
import { api } from '@/lib/api'
import type { Product } from '@/lib/types'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string; sort?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  }
}

function ProductRow({ product }: { product: Product }) {
  const bestPrice = product.prices.reduce(
    (min, p) => (p.price < min.price ? p : min),
    product.prices[0] ?? { price: 0, store: '', url: '#' }
  )

  const specs = product.description?.typeDetails
    ? Object.values(product.description.typeDetails).slice(0, 4).map(String)
    : []

  return (
    <div className="es-card" style={{
      display: 'grid',
      gridTemplateColumns: '160px 1fr 220px 220px',
      gap: 24,
      padding: 22,
      alignItems: 'center',
    }}>
      <div className="es-img" style={{ height: 140 }}>
        {product.images[0] ? (
          <img src={product.images[0].url} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
        ) : product.brand.name}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--text-meta)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {product.brand.name}
          </span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-dim)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-meta)' }}>{product.category.name}</span>
        </div>
        <Link href={`/produits/${product.slug}`} style={{ fontWeight: 600, fontSize: 18, color: 'var(--text)', letterSpacing: '-0.01em' }}>
          {product.name}
        </Link>
        {specs.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {specs.map((s, i) => (
              <span key={i} className="es-chip">{s}</span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, fontSize: 12, color: 'var(--text-meta)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--down)' }} />
            En stock chez {product.prices.length} boutique{product.prices.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--text-meta)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Évolution 30 jours
        </div>
        <Sparkline data={[bestPrice.price * 1.15, bestPrice.price * 1.1, bestPrice.price * 1.05, bestPrice.price * 1.02, bestPrice.price]} width={200} height={50} color="var(--down)" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'stretch' }}>
        <div>
          <Price value={bestPrice.price} big />
        </div>
        {bestPrice.store && <StoreBadge name={bestPrice.store} />}
        <Link href={`/produits/${product.slug}`}>
          <button className="es-btn is-primary" style={{ width: '100%' }}>
            Voir la fiche <Icon name="chevron" size={14} />
          </button>
        </Link>
        <button className="es-btn is-sm is-ghost" style={{ width: '100%' }}>
          + Ajouter au comparateur
        </button>
      </div>
    </div>
  )
}

function EmptyState({ slug }: { slug: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-muted)' }}>
      <Icon name="search" size={48} />
      <h2 style={{ marginTop: 16, fontSize: 22 }}>Aucun produit trouvé</h2>
      <p style={{ marginTop: 8, fontSize: 14 }}>
        La catégorie <strong style={{ color: 'var(--text)' }}>{slug}</strong> ne contient pas encore de produits.
      </p>
      <Link href="/">
        <button className="es-btn is-primary" style={{ marginTop: 24 }}>
          Retour à l&apos;accueil
        </button>
      </Link>
    </div>
  )
}

export default async function ListingPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageParam = '0', sort = 'price,asc' } = await searchParams
  const page = parseInt(pageParam, 10)

  let data = null
  try {
    data = await api.listProducts(slug, page, 20, sort)
  } catch {
    // API might not be running; show empty state
  }

  const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <>
      {/* Header section */}
      <section style={{ padding: '32px 48px 24px', borderBottom: '1px solid var(--border-soft)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-meta)', fontSize: 13, marginBottom: 18 }}>
          <Link href="/" style={{ color: 'var(--text-meta)' }}>Accueil</Link>
          <Icon name="chevron" size={12} />
          <span style={{ color: 'var(--text)' }}>{categoryName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 38, letterSpacing: '-0.025em' }}>{categoryName}</h1>
            <div style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: 14 }}>
              {data ? (
                <>
                  <span className="mono" style={{ color: 'var(--text)' }}>{data.totalElements} produits</span>
                  {' · '}comparés sur 5 boutiques
                </>
              ) : (
                <span>Chargement...</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="es-btn is-sm"><Icon name="bell" size={14} /> Créer une alerte</button>
            <button className="es-btn is-sm"><Icon name="share" size={14} /> Partager</button>
          </div>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '280px 1fr', padding: '24px 48px 48px', gap: 32 }}>
        {/* Filters sidebar */}
        <aside>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h3 style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="filter" size={16} /> Filtres
            </h3>
            <button style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12 }}>
              Tout effacer
            </button>
          </div>

          {/* Price range */}
          <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border-soft)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Prix</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <div style={{ flex: 1, padding: '8px 10px', background: 'var(--surface)', border: '1px solid var(--border-soft)', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                Min €
              </div>
              <div style={{ flex: 1, padding: '8px 10px', background: 'var(--surface)', border: '1px solid var(--border-soft)', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                Max €
              </div>
            </div>
          </div>

          {/* Stores */}
          <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border-soft)' }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Boutique</div>
            {['Amazon', 'Cdiscount', 'LDLC', 'Fnac', 'Boulanger'].map((store) => (
              <label key={store} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 4px', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)' }}>
                <span style={{ width: 16, height: 16, borderRadius: 4, border: '1.5px solid var(--border)', background: 'transparent', display: 'inline-block' }} />
                {store}
              </label>
            ))}
          </div>
        </aside>

        {/* Results */}
        <div>
          {/* Toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 18px', marginBottom: 16,
            background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--border-soft)',
          }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {data ? `${data.totalElements} produits` : 'Chargement...'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--text-meta)' }}>Trier par</span>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', background: 'var(--bg)', borderRadius: 6,
                border: '1px solid var(--border-soft)', fontSize: 13,
              }}>
                Prix croissant <Icon name="chevronDown" size={13} />
              </div>
              <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 6, border: '1px solid var(--border-soft)' }}>
                <button style={{ padding: 8, background: 'var(--surface-2)', border: 'none', color: 'var(--text)', borderRadius: 6 }}><Icon name="list" size={14} /></button>
                <button style={{ padding: 8, background: 'transparent', border: 'none', color: 'var(--text-meta)' }}><Icon name="grid" size={14} /></button>
              </div>
            </div>
          </div>

          {!data || data.content.length === 0 ? (
            <EmptyState slug={slug} />
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {data.content.map((product: Product) => (
                  <ProductRow key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 28 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-meta)' }}>
                    Affichage {page * 20 + 1}–{Math.min((page + 1) * 20, data.totalElements)} sur {data.totalElements} produits
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {page > 0 && (
                      <Link href={`/categories/${slug}?page=${page - 1}`}>
                        <button style={{ minWidth: 36, height: 36, borderRadius: 6, border: '1px solid var(--border-soft)', background: 'var(--surface)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>‹</button>
                      </Link>
                    )}
                    {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => i).map((i) => (
                      <Link key={i} href={`/categories/${slug}?page=${i}`}>
                        <button style={{
                          minWidth: 36, height: 36, borderRadius: 6,
                          border: '1px solid var(--border-soft)',
                          background: i === page ? 'var(--accent)' : 'var(--surface)',
                          color: i === page ? '#1a0a00' : 'var(--text-muted)',
                          fontFamily: 'var(--font-mono)', fontSize: 13,
                          fontWeight: i === page ? 600 : 400,
                        }}>{i + 1}</button>
                      </Link>
                    ))}
                    {!data.last && (
                      <Link href={`/categories/${slug}?page=${page + 1}`}>
                        <button style={{ minWidth: 36, height: 36, borderRadius: 6, border: '1px solid var(--border-soft)', background: 'var(--surface)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>›</button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
