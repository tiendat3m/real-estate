import { propertyTypes, provinceNames, soldPriceRanges, rentPriceRanges, directions } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

// filters: object state; onApply(filters), onReset
const FilterSidebar = ({ listingType, filters, setFilters, onApply, onReset }) => {
    const priceRanges = listingType === 'Cho thuê' ? rentPriceRanges : soldPriceRanges
    const update = (patch) => setFilters({ ...filters, ...patch })

    return (
        <aside className="w-full lg:w-64 shrink-0 bg-white border rounded-lg p-4 lg:sticky lg:top-28 h-fit">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-main">Bộ lọc</h3>
                <button onClick={onReset} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                    <X className="w-3 h-3" /> Xoá lọc
                </button>
            </div>

            <div className="space-y-4 text-sm">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Tỉnh thành</label>
                    <select className="w-full h-9 rounded border border-slate-300 px-2" value={filters.province || ''} onChange={(e) => update({ province: e.target.value })}>
                        <option value="">Tất cả</option>
                        {provinceNames.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Loại BĐS</label>
                    <select className="w-full h-9 rounded border border-slate-300 px-2" value={filters.propertyType || ''} onChange={(e) => update({ propertyType: e.target.value })}>
                        <option value="">Tất cả</option>
                        {propertyTypes.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2">Khoảng giá</label>
                    <div className="space-y-1">
                        {priceRanges.map((r) => {
                            const active = filters.minPrice == r.min && filters.maxPrice == r.max
                            return (
                                <button
                                    key={r.label}
                                    onClick={() => update({ minPrice: r.min, maxPrice: r.max || '' })}
                                    className={cn('block w-full text-left px-2 py-1 rounded', active ? 'bg-main text-white' : 'hover:bg-slate-100')}
                                >
                                    {r.label}
                                </button>
                            )
                        })}
                        <button onClick={() => update({ minPrice: '', maxPrice: '' })} className="block w-full text-left px-2 py-1 rounded text-xs text-slate-400 hover:underline">
                            Bỏ chọn giá
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Diện tích (m²)</label>
                    <div className="flex gap-2">
                        <input type="number" placeholder="Từ" className="w-1/2 h-9 rounded border border-slate-300 px-2" value={filters.minSize || ''} onChange={(e) => update({ minSize: e.target.value })} />
                        <input type="number" placeholder="Đến" className="w-1/2 h-9 rounded border border-slate-300 px-2" value={filters.maxSize || ''} onChange={(e) => update({ maxSize: e.target.value })} />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Hướng</label>
                    <select className="w-full h-9 rounded border border-slate-300 px-2" value={filters.direction || ''} onChange={(e) => update({ direction: e.target.value })}>
                        <option value="">Tất cả</option>
                        {directions.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>

                <button onClick={onApply} className="w-full h-9 rounded bg-main text-white text-sm font-medium hover:bg-main/90">
                    Áp dụng
                </button>
            </div>
        </aside>
    )
}

export default FilterSidebar