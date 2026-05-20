interface LogoProps {
  size?: number
}

export function Logo({ size = 18 }: LogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={28} height={28} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="es-mark-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0.75" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="7" fill="url(#es-mark-grad)" />
        <path
          d="M16 7l2.2 5.6 6 .4-4.6 3.9 1.5 5.8L16 19.5l-5.1 3.2 1.5-5.8L7.8 13l6-.4z"
          fill="#0B1120"
        />
      </svg>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 6,
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: size,
          letterSpacing: '-0.02em',
        }}
      >
        <span>Electronic</span>
        <span style={{ color: 'var(--accent)' }}>Star</span>
      </div>
    </div>
  )
}
