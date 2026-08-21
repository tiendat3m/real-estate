import { Star } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

// Hiển thị: value số; Nhập: onSelect(star)
const RatingStars = ({ value = 0, size = 16, editable = false, onSelect, className }) => {
    const [hover, setHover] = useState(0)
    const shown = hover || value
    return (
        <div className={cn('flex items-center gap-0.5', className)}>
            {[1, 2, 3, 4, 5].map((i) => (
                <button
                    key={i}
                    type="button"
                    disabled={!editable}
                    onMouseEnter={() => editable && setHover(i)}
                    onMouseLeave={() => editable && setHover(0)}
                    onClick={() => editable && onSelect?.(i)}
                    className={cn(editable && 'cursor-pointer', !editable && 'cursor-default')}
                >
                    <Star
                        style={{ width: size, height: size }}
                        className={cn(
                            i <= shown ? 'text-amber-500 fill-amber-500' : 'text-slate-300 fill-slate-200'
                        )}
                    />
                </button>
            ))}
        </div>
    )
}

export default RatingStars