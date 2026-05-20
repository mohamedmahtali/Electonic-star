import type { Category, CompareResult, PageResponse, PriceHistory, Product, SearchResult } from './types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

async function fetchAPI<T>(path: string, revalidate = 3600): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { next: { revalidate } })
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  return res.json() as Promise<T>
}

export const api = {
  getProduct: (slug: string) =>
    fetchAPI<Product>(`/api/products/${slug}`),

  listProducts: (categorySlug: string, page = 0, size = 20, sort = 'price,asc') =>
    fetchAPI<PageResponse<Product>>(
      `/api/products?category=${encodeURIComponent(categorySlug)}&page=${page}&size=${size}&sort=${sort}`
    ),

  getPriceHistory: (productId: string) =>
    fetchAPI<PriceHistory[]>(`/api/products/${productId}/prices/history`, 1800),

  getCategories: () =>
    fetchAPI<Category[]>(`/api/categories`, 21600),

  search: (query: string, page = 0, size = 20) =>
    fetchAPI<SearchResult>(
      `/api/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`,
      300
    ),

  compare: (ids: string[]) =>
    fetchAPI<CompareResult>(`/api/compare?ids=${ids.join(',')}`, 1800),

  getDeals: (page = 0, size = 8) =>
    fetchAPI<PageResponse<Product>>(`/api/products/deals?page=${page}&size=${size}`, 1800),
}
