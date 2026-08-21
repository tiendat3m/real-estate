import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const Pagination = ({ page, totalPages, onChange }) => {
    if (!totalPages || totalPages <= 1) return null
    const pages = []
    const start = Math.max(1, page - 2)
    const end = Math.min(totalPages, start + 4)
    for (let i = start; i <= end; i++) pages.push(i)

    return (
        <div className="flex items-center justify-center gap-1 mt-8">
            <button
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
                className="w-9 h-9 grid place-items-center rounded border disabled:opacity-40 hover:bg-slate-100"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onChange(p)}
                    className={cn(
                        'w-9 h-9 grid place-items-center rounded border text-sm',
                        p === page ? 'bg-main text-white border-main' : 'hover:bg-slate-100'
                    )}
                >
                    {p}
                </button>
            ))}
            <button
                disabled={page >= totalPages}
                onClick={() => onChange(page + 1)}
                className="w-9 h-9 grid place-items-center rounded border disabled:opacity-40 hover:bg-slate-100"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    )
}

export default Pagination