import { useRef } from 'react'
import { categories, collections } from '../../../data.ts'
import { isPriceSort } from '../../../modules/products/products.logic.ts'
import type { ProductSelection } from '../../../modules/products/products.types.ts'
import Button from '../../../components/Button.tsx'
import FormField from '../../../components/FormField.tsx'
import {
  entranceDelay,
  joinClasses,
  useEntranceMotion,
} from '../../entrance/entrance-motion.ts'

interface Props {
  readonly selection: ProductSelection
  onChange: (selection: ProductSelection) => void
  onReset: () => void
}

export default function CatalogueControls({
  selection,
  onChange,
  onReset,
}: Props) {
  const searchInput = useRef<HTMLInputElement>(null)
  const motion = useEntranceMotion('search', entranceDelay.search)

  return (
    <div className="catalogue-controls">
      <div
        className={joinClasses('search-field', motion.className)}
        style={motion.style}
      >
        <FormField id="product-search" label="Find something for your home">
          <div className="search-input">
            <span aria-hidden="true">{'\u2315'}</span>
            <input
              ref={searchInput}
              id="product-search"
              type="search"
              autoComplete="off"
              placeholder="Search product names..."
              value={selection.query || ''}
              onChange={(event) =>
                onChange({ ...selection, query: event.currentTarget.value })
              }
            />
            {selection.query ? (
              <button
                id="clear-search"
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  onChange({ ...selection, query: '' })
                  searchInput.current?.focus()
                }}
              >
                <span aria-hidden="true">{'\u00d7'}</span>
              </button>
            ) : null}
          </div>
        </FormField>
      </div>
      <div className="product-tools">
        <div className="catalogue-selects">
          <FormField
            id="category-filter"
            label="Category"
            className="catalogue-control"
          >
            <select
              id="category-filter"
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
            className="catalogue-control"
          >
            <select
              id="price-sort"
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
        <Button tone="secondary" className="catalogue-reset" onClick={onReset}>
          Reset search and filters
        </Button>
      </div>
    </div>
  )
}
