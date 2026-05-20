export interface Brand {
  id: string
  name: string
  slug: string
  logoUrl?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  level: number
  position: number
  icon?: string
  productCount?: number
  children?: Category[]
  parent?: { id: string; name: string; slug: string }
}

export interface Price {
  store: string
  price: number
  url: string
  shipping?: string
  delivery?: string
  stock?: string
  updatedAt: string
}

export interface PriceHistory {
  store: string
  price: number
  recordedAt: string
}

export interface ProductImage {
  url: string
  alt: string
  position: number
}

export interface Tag {
  name: string
  slug: string
}

export interface ProductDescription {
  shortDesc?: string
  features?: string[]
  typeDetails: Record<string, string | number>
}

export interface Product {
  id: string
  name: string
  slug: string
  brand: Brand
  category: Category
  description?: ProductDescription
  prices: Price[]
  images: ProductImage[]
  tags: Tag[]
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

export interface CriterionResult {
  winner: number | 'tie' | null
  values: (string | number | null)[]
}

export interface CompareResult {
  products: Product[]
  criteriaResults: Record<string, CriterionResult>
  scores: number[]
  overallWinner: number
  priceComparison: {
    productId: string
    bestPrice: number
    bestStore: string
  }[]
}

export type SearchResult = PageResponse<Product>
