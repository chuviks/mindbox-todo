import { useEffect, useRef, useState } from 'react'
import type { Todo } from '../types'

type Props = {
    todo: Todo
    onToggle: (id: string) => void
    onRemove: (id: string) => void
    onRename: (id: string, title: string) => void
}
export default function TodoItem({ todo, onToggle, onRemove, onRename }: Props) {
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(todo.title)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

    function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') { onRename(todo.id, draft); setEditing(false) }
        if (e.key === 'Escape') { setDraft(todo.title); setEditing(false) }
    }

    return (
        <li className={`todo ${todo.completed ? 'completed' : ''}`}>
            <input
                aria-label={`toggle ${todo.title}`}
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
            />

            {!editing ? (
                <span
                    className="text grow"
                    onDoubleClick={() => setEditing(true)}
                    title="Double-click to edit"
                >
                    {todo.title}
                </span>
            ) : (
                <input
                    ref={inputRef}
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={handleKey}
                    onBlur={() => { onRename(todo.id, draft); setEditing(false) }}
                    className="input grow"
                    aria-label="edit todo"
                />
            )}

            <button aria-label={`delete ${todo.title}`} className="clear" onClick={() => onRemove(todo.id)}>
                ✕
            </button>
        </li>
    )
}
