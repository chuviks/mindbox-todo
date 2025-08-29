import { useEffect, useMemo, useState } from 'react'
import type { Todo, Filter } from '../types'

const STORAGE_KEY = 'mindbox_todos'

function load(): Todo[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? (JSON.parse(raw) as Todo[]) : []
    } catch {
        return []
    }
}
function save(data: Todo[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>(() => load())
    const [filter, setFilter] = useState<Filter>('all')

    useEffect(() => save(todos), [todos])

    const remaining = useMemo(() => todos.filter(t => !t.completed).length, [todos])
    const anyCompleted = useMemo(() => todos.some(t => t.completed), [todos])
    const filtered = useMemo(() => {
        if (filter === 'active') return todos.filter(t => !t.completed)
        if (filter === 'completed') return todos.filter(t => t.completed)
        return todos
    }, [todos, filter])

    function add(title: string) {
        const text = title.trim()
        if (!text) return
        setTodos(prev => [...prev, { id: crypto.randomUUID(), title: text, completed: false, createdAt: Date.now() }])
    }
    function toggle(id: string) {
        setTodos(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
    }
    function remove(id: string) {
        setTodos(prev => prev.filter(t => t.id !== id))
    }
    function clearCompleted() {
        setTodos(prev => prev.filter(t => !t.completed))
    }
    function rename(id: string, title: string) {
        const text = title.trim()
        if (!text) { remove(id); return }
        setTodos(prev => prev.map(t => (t.id === id ? { ...t, title: text } : t)))
    }

    return { todos, filtered, filter, setFilter, add, toggle, remove, clearCompleted, rename, remaining, anyCompleted }
}
