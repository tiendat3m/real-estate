import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

// Carousel banner đơn giản: nhận mảng {src, title, subtitle}
const Carousel = ({ items = [], interval = 5000 }) => {
    const [idx, setIdx] = useState(0)
    const count = items.length
    const next = useCallback(() => setIdx((i) => (i + 1) % count), [count])
    const prev = () => setIdx((i) => (i - 1 + count) % count)

    useEffect(() => {
        if (count <= 1) return
        const t = setInterval(next, interval)
        return () => clearInterval(t)
    }, [count, interval, next])

    if (!count) return null

    return (
        <div className="relative w-full h-[420px] overflow-hidden rounded-lg">
            {items.map((it, i) => (
                <div
                    key={i}
                    className={cn('absolute inset-0 transition-opacity duration-700', i === idx ? 'opacity-100' : 'opacity-0 pointer-events-none')}
                >
                    <img src={it.src} alt={it.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-10 left-10 text-white max-w-xl">
                        <h2 className="text-3xl font-bold mb-2 drop-shadow">{it.title}</h2>
                        <p className="text-base drop-shadow">{it.subtitle}</p>
                    </div>
                </div>
            ))}

            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 text-white grid place-items-center">‹</button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 text-white grid place-items-center">›</button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {items.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIdx(i)}
                        className={cn('w-2.5 h-2.5 rounded-full transition', i === idx ? 'bg-white w-6' : 'bg-white/50')}
                    />
                ))}
            </div>
        </div>
    )
}

export default Carousel