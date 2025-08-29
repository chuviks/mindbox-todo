import * as React from 'react'
import { useMemo, useRef, useState, useEffect } from 'react'
import TodoItem from './components/TodoItem'
import FilterBar from './components/FilterBar'
import Footer from './components/Footer'
import { useTodos } from './hooks/useTodos'

const PHRASES = [
    'What needs to be done?',
    'Напиши задачу…',
]

export default function App() {
    const {
        filtered, filter, setFilter,
        add, toggle, remove, clearCompleted, rename,
        remaining, anyCompleted
    } = useTodos()

    const inputRef = useRef<HTMLInputElement>(null)
    const [placeholder] = useState(() =>
        PHRASES[Math.floor(Math.random() * PHRASES.length)]
    )

    // Если поле пустое — меняем placeholder раз в несколько секунд
    useEffect(() => {
        const id = setInterval(() => {
            const el = inputRef.current
            if (!el || el.value.trim() !== '') return
            el.placeholder = PHRASES[Math.floor(Math.random() * PHRASES.length)]
        }, 7000)
        return () => clearInterval(id)
    }, [])

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const val = inputRef.current?.value ?? ''
        add(val)
        if (inputRef.current) inputRef.current.value = ''
    }

    const empty = useMemo(() => filtered.length === 0, [filtered])

    // Прогресс считаем от "all"; на других фильтрах держим последнее total
    const lastTotalRef = useRef<number>(0)
    useEffect(() => {
        if (filter === 'all') lastTotalRef.current = filtered.length
    }, [filter, filtered])

    const totalForProgress =
        filter === 'all' ? filtered.length : lastTotalRef.current || filtered.length

    const completedCount = Math.max(totalForProgress - remaining, 0)
    const percent = totalForProgress > 0
        ? Math.round((completedCount / totalForProgress) * 100)
        : 0

    // Простая анимация конфетти при достижении 100%
    const prevRemaining = useRef(remaining)
    useEffect(() => {
        const justCompletedAll =
            prevRemaining.current > 0 &&
            remaining === 0 &&
            (lastTotalRef.current || totalForProgress) > 0

        if (justCompletedAll) burstConfetti()
        prevRemaining.current = remaining
    }, [remaining, totalForProgress])

    function burstConfetti() {
        const host = document.querySelector('.card') as HTMLElement | null
        if (!host) return
        const midX = host.clientWidth / 2
        const y = 26

        for (let i = 0; i < 26; i++) {
            const node = document.createElement('span')
            node.className = 'confetti'
            node.style.left = `${midX}px`
            node.style.top = `${y}px`
            node.style.setProperty('--x', `${Math.random() * 240 - 120}px`)
            const hue = 200 + Math.floor(Math.random() * 140)
            node.style.background = `hsl(${hue} 90% 60%)`
            host.appendChild(node)
            setTimeout(() => node.remove(), 1200)
        }
    }

    return (
        <div className="container">
            <div className="card" role="application">
                <h1 className="title">
                    ToDos — управляй и властвуй
                    <img className="logo-pepe" src="/pepe.png" alt="" aria-hidden="true" />
                </h1>

                {/* прогресс-бар с ракетой */}
                <div className="progress" aria-label="progress">
                    <div className="progress-fill" style={{ width: `${percent}%` }} />
                    <div
                        className="progress-rocket"
                        style={{ left: `calc(${percent}% + 8px)` }}
                        aria-hidden
                    >
                        🚀
                    </div>
                </div>

                <form onSubmit={handleSubmit} aria-label="add todo">
                    <input
                        placeholder={placeholder}
                        className="input"
                        ref={inputRef}
                        aria-label="todo input"
                    />
                </form>
                <div className="hint muted">Нажми <b>Enter</b>, чтобы добавить задачу</div>

                {empty ? (
                    <div className="empty" aria-live="polite">
                        <span>🎯</span>
                        <span className="muted">Список пуст. Добавь цель выше — и погнали.</span>
                    </div>
                ) : (
                    <ul aria-label="todo list">
                        {filtered.map(todo => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggle={toggle}
                                onRemove={remove}
                                onRename={rename}
                            />
                        ))}
                    </ul>
                )}

                <FilterBar filter={filter} setFilter={setFilter} />
                <Footer
                    remaining={remaining}
                    onClearCompleted={clearCompleted}
                    canClear={anyCompleted}
                />

                <div className="footnote">made during a test task ☕</div>
            </div>
        </div>
    )
}
