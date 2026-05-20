'use client'

import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { Logo } from '@/components/ui/Logo'

export function Header() {
  return (
    <header
      style={{
        height: 64,
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '0 32px',
        background: 'var(--bg)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Link href="/">
        <Logo />
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 22, fontSize: 14, color: 'var(--text-muted)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          Catégories <Icon name="chevronDown" size={14} />
        </span>
        <Link href="/comparer" style={{ color: 'var(--text-muted)' }}>Comparateur</Link>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <span style={{ color: 'var(--accent)' }}><Icon name="flame" size={14} /></span>
          Bons plans
        </span>
        <span style={{ cursor: 'pointer' }}>Guide d&apos;achat</span>
      </nav>

      <div
        style={{
          flex: 1,
          maxWidth: 460,
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          height: 40,
          padding: '0 14px',
          background: 'var(--surface)',
          border: '1px solid var(--border-soft)',
          borderRadius: 999,
          color: 'var(--text-muted)',
        }}
      >
        <Icon name="search" size={16} />
        <input
          placeholder="Rechercher un produit, une marque..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
            fontSize: 14,
            fontFamily: 'inherit',
          }}
        />
        <kbd
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            padding: '2px 6px',
            borderRadius: 4,
            background: 'var(--bg-deep)',
            color: 'var(--text-meta)',
            border: '1px solid var(--border-soft)',
          }}
        >
          ⌘K
        </kbd>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'var(--text-muted)' }}>
        <span style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="bell" size={18} />
          <span
            style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              background: 'var(--accent)',
              color: '#1a0a00',
              padding: '1px 5px',
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            3
          </span>
        </span>
        <Icon name="heart" size={18} />
        <Icon name="user" size={18} />
      </div>
    </header>
  )
}
