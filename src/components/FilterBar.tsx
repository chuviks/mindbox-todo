import type { Filter } from '../types'

type Props = { filter: Filter; setFilter: (f: Filter) => void }
export default function FilterBar({ filter, setFilter }: Props) {
    const Item = ({ id, label }: { id: Filter; label: string }) => (
        <button
            className={`pill ${filter === id ? 'active' : ''}`}
            onClick={() => setFilter(id)}
            aria-pressed={filter === id}
        >
            {label}
        </button>
    )
    return (
        <div className="filters" role="tablist" aria-label="filters">
            <Item id="all" label="All" />
            <Item id="active" label="Active" />
            <Item id="completed" label="Completed" />
        </div>
    )
}
