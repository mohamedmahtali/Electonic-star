const STORE_COLORS: Record<string, string> = {
  amazon: '#FCD34D',
  Amazon: '#FCD34D',
  cdiscount: '#A7F3D0',
  Cdiscount: '#A7F3D0',
  ldlc: '#7DD3FC',
  LDLC: '#7DD3FC',
  fnac: '#FDA4AF',
  Fnac: '#FDA4AF',
  boulanger: '#C4B5FD',
  Boulanger: '#C4B5FD',
  topachat: '#FBBF24',
  TopAchat: '#FBBF24',
  materiel: '#86EFAC',
  'Materiel.net': '#86EFAC',
}

const STORE_LABELS: Record<string, string> = {
  amazon: 'Amazon',
  cdiscount: 'Cdiscount',
  ldlc: 'LDLC',
  fnac: 'Fnac',
  boulanger: 'Boulanger',
}

interface StoreBadgeProps {
  name: string
  size?: number
  showLabel?: boolean
}

export function StoreBadge({ name, size = 28, showLabel = true }: StoreBadgeProps) {
  const label = STORE_LABELS[name] ?? name
  const color = STORE_COLORS[name] ?? '#94A3B8'
  const monogram = label.slice(0, 2).toUpperCase()

  return (
    <span className="es-store">
      <span
        className="mono-badge"
        style={{
          background: color,
          width: size,
          height: size,
          fontSize: size * 0.42,
        }}
      >
        {monogram}
      </span>
      {showLabel && <span>{label}</span>}
    </span>
  )
}

export { STORE_COLORS, STORE_LABELS }
