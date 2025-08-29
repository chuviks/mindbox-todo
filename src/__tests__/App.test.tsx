/// <reference types="vitest" />

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../App'

afterEach(() => cleanup())

function addTodo(text: string) {
    const input = screen.getByLabelText('todo input') as HTMLInputElement
    fireEvent.change(input, { target: { value: text } })
    fireEvent.submit(screen.getByLabelText('add todo'))
}

describe('Mindbox ToDo (key features)', () => {
    beforeEach(() => {
        localStorage.clear()
        render(<App />)
    })

    it('adds todo', () => {
        addTodo('Write tests')
        expect(screen.getByText('Write tests')).toBeInTheDocument()
    })

    it('toggles completion', () => {
        addTodo('A')
        const item = screen.getByText('A').closest('li')!
        fireEvent.click(within(item).getByRole('checkbox'))
        expect(item.className).toContain('completed')
    })

    it('filters active/completed', () => {
        addTodo('A'); addTodo('B')
        const b = screen.getByText('B').closest('li')!
        fireEvent.click(within(b).getByRole('checkbox'))

        fireEvent.click(screen.getByRole('button', { name: 'Active' }))
        expect(screen.queryByText('B')).not.toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', { name: 'Completed' }))
        expect(screen.getByText('B')).toBeInTheDocument()
    })

    it('edits on double click and saves with Enter', () => {
        addTodo('Temp')
        const item = screen.getByText('Temp').closest('li')!
        fireEvent.doubleClick(within(item).getByText('Temp'))
        const editor = within(item).getByLabelText('edit todo') as HTMLInputElement
        fireEvent.change(editor, { target: { value: 'Renamed' } })
        fireEvent.keyDown(editor, { key: 'Enter' })
        expect(screen.getByText('Renamed')).toBeInTheDocument()
    })

    it('clears completed', () => {
        addTodo('C1'); addTodo('C2')
        const c1 = screen.getByText('C1').closest('li')!
        fireEvent.click(within(c1).getByRole('checkbox'))
        fireEvent.click(screen.getByRole('button', { name: 'Clear completed' }))
        expect(screen.queryByText('C1')).not.toBeInTheDocument()
    })
})
