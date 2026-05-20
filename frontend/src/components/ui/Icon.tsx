interface IconProps {
  name: string
  size?: number
  stroke?: number
  className?: string
}

const paths: Record<string, React.ReactNode> = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  chevron: <path d="m9 6 6 6-6 6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  heart: <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />,
  bell: <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" /></>,
  bolt: <path d="M13 3 4 14h7l-1 7 9-11h-7l1-7z" />,
  cart: <><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l3 13h12l2-9H6" /></>,
  arrowUp: <path d="M12 19V5m-6 6 6-6 6 6" />,
  arrowDown: <path d="M12 5v14m6-6-6 6-6-6" />,
  star: <path d="M12 3l2.7 5.5 6 .9-4.4 4.3 1 6-5.3-2.8L6.7 19.7l1-6L3.3 9.4l6-.9z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  filter: <path d="M3 5h18l-7 9v6l-4-2v-4z" />,
  grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
  list: <><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></>,
  share: <><circle cx="6" cy="12" r="3" /><circle cx="18" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><path d="m8.5 10.5 7-3M8.5 13.5l7 3" /></>,
  download: <path d="M12 4v12m-5-5 5 5 5-5M4 20h16" />,
  check: <path d="m5 12 5 5L20 7" />,
  cross: <path d="m6 6 12 12M18 6 6 18" />,
  crown: <path d="M3 18h18M5 8l3 4 4-6 4 6 3-4v10H5z" />,
  truck: <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.5" /><circle cx="17" cy="18" r="1.5" /></>,
  cpu: <><rect x="6" y="6" width="12" height="12" rx="1.5" /><rect x="9" y="9" width="6" height="6" /><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" /></>,
  gpu: <><rect x="3" y="6" width="18" height="12" rx="1.5" /><circle cx="9" cy="12" r="2.5" /><circle cx="16" cy="12" r="1.5" /></>,
  ssd: <><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M7 9h10M7 12h10M7 15h6" /></>,
  ram: <><rect x="2" y="8" width="20" height="8" rx="1" /><path d="M5 8v-2M9 8v-2M13 8v-2M17 8v-2M5 18v-2M9 18v-2M13 18v-2M17 18v-2" /></>,
  mobo: <><rect x="3" y="3" width="18" height="18" rx="1.5" /><rect x="6" y="6" width="6" height="6" /><circle cx="17" cy="8" r="1.5" /><path d="M14 14h5M14 17h5M6 16h3M6 19h3" /></>,
  monitor: <><rect x="2" y="4" width="20" height="13" rx="1.5" /><path d="M8 21h8M12 17v4" /></>,
  headphones: <path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H4zM17 14h3v6h-3z" />,
  keyboard: <><rect x="2" y="6" width="20" height="12" rx="1.5" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12" /></>,
  smartphone: <><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" /></>,
  laptop: <><rect x="4" y="5" width="16" height="10" rx="1" /><path d="M2 19h20l-1-2H3z" /></>,
  chip: <><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="10" y="10" width="4" height="4" /></>,
  sparkle: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l2.8 2.8M15.7 15.7l2.8 2.8M5.5 18.5l2.8-2.8M15.7 8.3l2.8-2.8" />,
  flame: <path d="M12 22c-4 0-7-2.5-7-6.5 0-3 2-5 3.5-6 0 2 1 3 2 3 0-4 1-7 4.5-9 0 4 4 6 4 11 0 4.5-3 7.5-7 7.5z" />,
}

export function Icon({ name, size = 18, stroke = 1.6, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name] ?? null}
    </svg>
  )
}
