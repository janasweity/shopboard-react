import { useRef } from 'react'
import { categories, collections } from '../../../data.ts'
import { isPriceSort } from '../../../modules/products/products.logic.ts'
import type { ProductSelection } from '../../../modules/products/products.types.ts'
import FormField from '../../../components/FormField.tsx'
import { Button } from '../../../components/ui/button.tsx'
import { Input } from '../../../components/ui/input.tsx'
import { cn } from '../../../lib/utils.ts'
import {
  entranceDelay,
  useEntranceMotion,
} from '../../entrance/entrance-motion.ts'

interface Props {
  readonly selection: ProductSelection
  onChange: (selection: ProductSelection) => void
  onReset: () => void
}

const labelClass = 'mb-2.5'

// data-slot="select" keeps the shared field rule in globals.css off these
// selects, so their own classes apply.
const selectClass =
  'min-h-12 w-full min-w-0 rounded-control border border-stone-grey bg-soft-white py-2.5 pr-8 pl-3.25 text-xs text-foreground'

export default function CatalogueControls({
  selection,
  onChange,
  onReset,
}: Props) {
  const searchInput = useRef<HTMLInputElement>(null)
  const motion = useEntranceMotion('search', entranceDelay.search)

  return (
    <div>
      <div
        className={cn('mt-4 mb-5.5 max-w-170', motion.className)}
        style={motion.style}
      >
        <FormField id="product-search" label="Find something for your home">
          <div className="flex items-center gap-2.5 rounded-control border border-stone-grey bg-soft-white px-3.5">
            <span aria-hidden="true">{'⌕'}</span>
            {/* The field keeps the shared Input look inside the box, as the
                site has always shown it. */}
            <Input
              ref={searchInput}
              id="product-search"
              type="search"
              autoComplete="off"
              placeholder="Search product names..."
              className="flex-1"
              value={selection.query || ''}
              onChange={(event) =>
                onChange({ ...selection, query: event.currentTarget.value })
              }
            />
            {selection.query ? (
              <Button
                id="clear-search"
                variant="plain"
                size="icon"
                aria-label="Clear search"
                onClick={() => {
                  onChange({ ...selection, query: '' })
                  searchInput.current?.focus()
                }}
              >
                <span aria-hidden="true">{'×'}</span>
              </Button>
            ) : null}
          </div>
        </FormField>
      </div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="grid w-full grid-cols-1 gap-4 md:max-w-140 md:grid-cols-2">
          <FormField
            id="category-filter"
            label="Category"
            className="min-w-0"
            labelClassName={labelClass}
          >
            <select
              id="category-filter"
              data-slot="select"
              className={selectClass}
              value={selection.category || 'all'}
              onChange={(event) =>
                onChange({ ...selection, category: event.currentTarget.value })
              }
            >
              {categories.map(([id, name]) => (
                <option key={id} value={id}>
                  {id === 'all' ? 'All categories' : name}
                </option>
              ))}
              <optgroup label="Collections">
                {collections.map((collection) => (
                  <option
                    key={collection.id}
                    value={'collection:' + collection.id}
                  >
                    {collection.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </FormField>
          <FormField
            id="price-sort"
            label="Sort by price"
            className="min-w-0"
            labelClassName={labelClass}
          >
            <select
              id="price-sort"
              data-slot="select"
              className={selectClass}
              value={selection.sort || 'default'}
              onChange={(event) => {
                const sort = event.currentTarget.value
                if (isPriceSort(sort)) onChange({ ...selection, sort })
              }}
            >
              <option value="default">Default order</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </FormField>
        </div>
        <Button variant="secondary" className="self-end" onClick={onReset}>
          Reset search and filters
        </Button>
      </div>
    </div>
  )
}
