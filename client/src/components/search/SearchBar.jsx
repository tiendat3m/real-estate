import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RotateCcw, Search } from 'lucide-react'
import {
    areaRanges,
    getDistrictsByProvince,
    getPropertyTypesForListing,
    getRentPriceRanges,
    listingTypes,
    provinceNames,
    rentCategories,
    soldPriceRanges,
} from '@/lib/constants'
import { pathnames } from '@/lib/pathname'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SearchBar = ({ compact = false, defaultListingType = 'Cho thuê', wide = false }) => {
    const navigate = useNavigate()
    const [listingType, setListingType] = useState(defaultListingType)
    const [province, setProvince] = useState('')
    const [district, setDistrict] = useState('')
    const [propertyType, setPropertyType] = useState('')
    const [priceKey, setPriceKey] = useState('')
    const [areaKey, setAreaKey] = useState('')
    const [q, setQ] = useState('')

    const propertyOptions = useMemo(() => getPropertyTypesForListing(listingType), [listingType])
    const districtOptions = useMemo(() => getDistrictsByProvince(province), [province])
    const priceRanges = listingType === 'Cho thuê' ? getRentPriceRanges(propertyType) : soldPriceRanges

    const reset = () => {
        setProvince('')
        setDistrict('')
        setPropertyType('')
        setPriceKey('')
        setAreaKey('')
        setQ('')
    }

    const submit = (e) => {
        e.preventDefault()
        const base = listingType === 'Cho thuê' ? pathnames.publics.rentProperty : pathnames.publics.soldProperty
        const params = new URLSearchParams()
        const priceRange = priceKey !== '' ? priceRanges[Number(priceKey)] : null
        const areaRange = areaKey !== '' ? areaRanges[Number(areaKey)] : null

        if (province) params.set('province', province)
        if (district) params.set('district', district)
        if (propertyType) params.set('propertyType', propertyType)
        if (q) params.set('q', q)
        if (priceRange) {
            params.set('minPrice', priceRange.min)
            if (priceRange.max) params.set('maxPrice', priceRange.max)
        }
        if (areaRange) {
            params.set('minSize', areaRange.min)
            if (areaRange.max) params.set('maxSize', areaRange.max)
        }
        navigate(`${base}?${params.toString()}`)
    }

    const selectCn = 'h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-main/30'

    return (
        <form onSubmit={submit} className={cn('w-full rounded-lg border bg-white p-4 shadow-xl', compact && 'shadow-sm')}>
            <div className={cn(
                'grid min-w-0 gap-3',
                wide && !compact ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-[180px_1fr_1fr_1fr_1fr_1fr_120px]' : 'grid-cols-1'
            )}>
                <div className="flex gap-1 rounded-md bg-slate-100 p-1">
                    {listingTypes.map((type) => (
                        <button
                            type="button"
                            key={type}
                            onClick={() => {
                                setListingType(type)
                                setPropertyType('')
                                setPriceKey('')
                            }}
                            className={cn('h-9 flex-1 rounded text-sm font-bold transition', listingType === type ? 'bg-main text-white shadow-sm' : 'text-slate-600 hover:text-main')}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <select className={cn(selectCn, 'min-w-0')} value={propertyType} onChange={(e) => { setPropertyType(e.target.value); setPriceKey('') }}>
                    <option value="">Loại nhà đất</option>
                    {propertyOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>

                <select className={cn(selectCn, 'min-w-0')} value={province} onChange={(e) => { setProvince(e.target.value); setDistrict('') }}>
                    <option value="">Tỉnh thành</option>
                    {provinceNames.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>

                <select className={cn(selectCn, 'min-w-0')} value={district} onChange={(e) => setDistrict(e.target.value)} disabled={!province}>
                    <option value="">{province ? 'Quận/Huyện' : 'Chọn tỉnh trước'}</option>
                    {districtOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>

                <select className={cn(selectCn, 'min-w-0')} value={priceKey} onChange={(e) => setPriceKey(e.target.value)}>
                    <option value="">Khoảng giá</option>
                    {priceRanges.map((range, index) => <option key={range.label} value={index}>{range.label}</option>)}
                </select>

                <select className={cn(selectCn, 'min-w-0')} value={areaKey} onChange={(e) => setAreaKey(e.target.value)}>
                    <option value="">Diện tích</option>
                    {areaRanges.map((range, index) => <option key={range.label} value={index}>{range.label}</option>)}
                </select>

                <div className="flex gap-2">
                    <Button type="submit" className="h-11 flex-1">
                        <Search className="h-4 w-4" /> Tìm
                    </Button>
                    <button type="button" onClick={reset} className="grid h-11 w-11 place-items-center rounded-md border text-slate-500 hover:bg-slate-50" aria-label="Đặt lại bộ lọc">
                        <RotateCcw className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                {rentCategories.map((category) => (
                    <button
                        type="button"
                        key={category.value}
                        onClick={() => {
                            setListingType('Cho thuê')
                            setPropertyType(category.value)
                            setPriceKey('')
                        }}
                        className={cn(
                            'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                            listingType === 'Cho thuê' && propertyType === category.value
                                ? 'border-main bg-main text-white'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-main/40 hover:text-main'
                        )}
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            <input
                className="mt-3 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-main/30"
                placeholder="Từ khóa, tên đường, khu vực, tiện ích..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
            />
        </form>
    )
}

export default SearchBar
