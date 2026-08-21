import { areaRanges, directions, getDistrictsByProvince, getPropertyTypesForListing, getRentPriceRanges, provinceNames, soldPriceRanges } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { CheckCircle2, Image, X } from 'lucide-react'

const FilterSidebar = ({ listingType, filters, setFilters, onApply, onReset }) => {
    const propertyOptions = getPropertyTypesForListing(listingType)
    const districtOptions = getDistrictsByProvince(filters.province)
    const priceRanges = listingType === 'Cho thuê' ? getRentPriceRanges(filters.propertyType) : soldPriceRanges
    const update = (patch) => setFilters({ ...filters, ...patch })

    return (
        <aside className="w-full shrink-0 rounded-lg border bg-white p-4 lg:sticky lg:top-28 lg:w-72">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-main">Bộ lọc</h3>
                <button onClick={onReset} className="flex items-center gap-1 text-xs text-red-500 hover:underline">
                    <X className="h-3 w-3" /> Xóa lọc
                </button>
            </div>

            <div className="space-y-4 text-sm">
                <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">Loại nhà đất</label>
                    <select className="h-9 w-full rounded border border-slate-300 px-2" value={filters.propertyType || ''} onChange={(e) => update({ propertyType: e.target.value, minPrice: '', maxPrice: '' })}>
                        <option value="">Tất cả</option>
                        {propertyOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">Tỉnh thành</label>
                    <select className="h-9 w-full rounded border border-slate-300 px-2" value={filters.province || ''} onChange={(e) => update({ province: e.target.value, district: '' })}>
                        <option value="">Toàn quốc</option>
                        {provinceNames.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">Quận/Huyện</label>
                    <select className="h-9 w-full rounded border border-slate-300 px-2 disabled:bg-slate-50 disabled:text-slate-400" value={filters.district || ''} onChange={(e) => update({ district: e.target.value })} disabled={!filters.province}>
                        <option value="">{filters.province ? 'Tất cả quận/huyện' : 'Chọn tỉnh trước'}</option>
                        {districtOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-500">Khoảng giá</label>
                    <div className="space-y-1">
                        {priceRanges.map((range) => {
                            const active = Number(filters.minPrice) === range.min && String(filters.maxPrice || '') === String(range.max || '')
                            return (
                                <button
                                    type="button"
                                    key={range.label}
                                    onClick={() => update({ minPrice: range.min, maxPrice: range.max || '' })}
                                    className={cn('block w-full rounded px-2 py-1.5 text-left', active ? 'bg-main text-white' : 'hover:bg-slate-100')}
                                >
                                    {range.label}
                                </button>
                            )
                        })}
                        <button type="button" onClick={() => update({ minPrice: '', maxPrice: '' })} className="block w-full rounded px-2 py-1 text-left text-xs text-slate-400 hover:underline">
                            Bỏ chọn giá
                        </button>
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-500">Diện tích</label>
                    <div className="grid grid-cols-2 gap-1">
                        {areaRanges.map((range) => {
                            const active = Number(filters.minSize) === range.min && String(filters.maxSize || '') === String(range.max || '')
                            return (
                                <button
                                    type="button"
                                    key={range.label}
                                    onClick={() => update({ minSize: range.min, maxSize: range.max || '' })}
                                    className={cn('rounded px-2 py-1.5 text-left text-xs', active ? 'bg-main text-white' : 'bg-slate-50 hover:bg-slate-100')}
                                >
                                    {range.label}
                                </button>
                            )
                        })}
                    </div>
                    <div className="mt-2 flex gap-2">
                        <input type="number" placeholder="Từ" className="h-9 w-1/2 rounded border border-slate-300 px-2" value={filters.minSize || ''} onChange={(e) => update({ minSize: e.target.value })} />
                        <input type="number" placeholder="Đến" className="h-9 w-1/2 rounded border border-slate-300 px-2" value={filters.maxSize || ''} onChange={(e) => update({ maxSize: e.target.value })} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-500">Phòng ngủ</label>
                        <select className="h-9 w-full rounded border border-slate-300 px-2" value={filters.minBedroom || ''} onChange={(e) => update({ minBedroom: e.target.value })}>
                            <option value="">Tất cả</option>
                            {[1, 2, 3, 4].map((item) => <option key={item} value={item}>Từ {item}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-500">Hướng</label>
                        <select className="h-9 w-full rounded border border-slate-300 px-2" value={filters.direction || ''} onChange={(e) => update({ direction: e.target.value })}>
                            <option value="">Tất cả</option>
                            {directions.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-2 rounded-md bg-slate-50 p-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <input type="checkbox" className="h-4 w-4 accent-main" checked={filters.hasImages === 'true'} onChange={(e) => update({ hasImages: e.target.checked ? 'true' : '' })} />
                        <Image className="h-4 w-4" /> Có hình ảnh
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <input type="checkbox" className="h-4 w-4 accent-main" checked={filters.verified === 'true'} onChange={(e) => update({ verified: e.target.checked ? 'true' : '' })} />
                        <CheckCircle2 className="h-4 w-4" /> Tin xác thực
                    </label>
                </div>

                <button onClick={onApply} className="h-10 w-full rounded bg-main text-sm font-bold text-white hover:bg-main/90">
                    Áp dụng
                </button>
            </div>
        </aside>
    )
}

export default FilterSidebar
