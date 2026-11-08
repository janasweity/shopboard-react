import type { ProductSelection } from '../modules/products/products.types.ts'

export type Route =
  | { readonly page: 'home' }
  | { readonly page: 'products'; readonly selection: ProductSelection }
  | {
      readonly page: 'product'
      readonly productId: string | null
      readonly colorId: string | null
    }
  | { readonly page: 'inspiration' }
  | { readonly page: 'about' }
  | { readonly page: 'checkout' }
  | { readonly page: 'not-found' }
