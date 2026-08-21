import { Inbox } from 'lucide-react'

const EmptyState = ({ title = 'Không có dữ liệu', subtitle }) => (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <Inbox className="w-12 h-12 mb-3" />
        <p className="font-medium text-slate-600">{title}</p>
        {subtitle && <p className="text-sm">{subtitle}</p>}
    </div>
)

export default EmptyState