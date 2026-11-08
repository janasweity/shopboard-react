import { Suspense, useRef } from 'react'
import { ApiError } from '../../../shared/api/api-client.ts'
import ErrorBoundary from '../../../components/ErrorBoundary.tsx'
import StatusMessage from '../../../components/StatusMessage.tsx'
import NotFoundPage from '../../../pages/NotFoundPage.tsx'
import { retryProduct } from '../api/products-resource.ts'
import ProductDetails from '../components/ProductDetails.tsx'

interface Props {
  readonly productId: string
  readonly colorId: string | null
}

export default function ProductDetailsPage({ productId, colorId }: Props) {
  // Try again removes its own button, so focus moves to this region instead.
  const region = useRef<HTMLDivElement>(null)

  return (
    <div id="product-region" ref={region} tabIndex={-1}>
      {/* A new product ID starts with a fresh boundary. */}
      <ErrorBoundary
        key={productId}
        onRetry={() => retryProduct(productId)}
        fallback={(error, retry) =>
          error instanceof ApiError && error.status === 404 ? (
            <NotFoundPage heading="We couldn't find that product." />
          ) : (
            <section className="page-intro">
              <p className="eyebrow">RAHA / PRODUCT DETAILS</p>
              <h1>We could not load this product.</h1>
              <StatusMessage
                kind="error"
                message="The product details did not load. Please try again."
                onRetry={() => {
                  retry()
                  region.current?.focus()
                }}
              />
            </section>
          )
        }
      >
        <Suspense
          fallback={
            <section className="page-intro">
              <StatusMessage kind="loading" message="Loading product..." />
            </section>
          }
        >
          <ProductDetails productId={productId} colorId={colorId} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
