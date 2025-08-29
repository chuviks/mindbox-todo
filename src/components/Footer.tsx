type Props = {
    remaining: number
    onClearCompleted: () => void
    canClear: boolean
}
export default function Footer({ remaining, onClearCompleted, canClear }: Props) {
    return (
        <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
            <span className="muted">{remaining} item{remaining === 1 ? '' : 's'} left</span>
            <button className="pill" onClick={onClearCompleted} disabled={!canClear} title={!canClear ? 'Nothing to clear' : ''}>
                Clear completed
            </button>
        </div>
    )
}
