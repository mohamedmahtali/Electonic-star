function formatPrice(value: number): [string, string] {
  const fixed = value.toFixed(2)
  const [int, dec] = fixed.split('.')
  const intFormatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return [intFormatted, dec]
}

interface PriceProps {
  value: number
  big?: boolean
}

export function Price({ value, big = false }: PriceProps) {
  const [int, dec] = formatPrice(value)
  return (
    <span className="es-price" style={{ fontSize: big ? 32 : 'inherit' }}>
      {int}
      <span style={{ fontSize: big ? 18 : 'inherit', opacity: 0.7 }}>,{dec}</span>
      <span className="euro"> €</span>
    </span>
  )
}

export function formatPriceStr(value: number): string {
  const [int, dec] = formatPrice(value)
  return `${int},${dec}`
}
