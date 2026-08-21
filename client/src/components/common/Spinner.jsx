import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const Spinner = ({ className, label }) => (
    <div className={cn('flex items-center justify-center gap-2 text-main py-10', className)}>
        <Loader2 className="w-5 h-5 animate-spin" />
        {label && <span className="text-sm text-slate-500">{label}</span>}
    </div>
)

export default Spinner