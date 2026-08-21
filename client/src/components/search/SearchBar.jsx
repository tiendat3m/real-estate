import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { listingTypes, propertyTypes, provinceNames } from '@/lib/constants'
import { pathnames } from '@/lib/pathname'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SearchBar = ({ compact = false }) => {
    const navigate = useNavigate()
    const [listingType, setListingType] = useState('Bán')
    const [province, setProvince] = useState('')
    const [propertyType, setPropertyType] = useState('')
    const [q, setQ] = useState('')

    const submit = (e) => {
        e.preventDefault()
        const base = listingType === 'Cho thuê' ? pathnames.publics.rentProperty : pathnames.publics.soldProperty
        const params = new URLSearchParams()
        if (province) params.set('province', province)
        if (propertyType) params.set('propertyType', propertyType)
        if (q) params.set('q', q)
        navigate(`${base}?${params.toString()}`)
    }

    const selectCn = 'h-10 rounded-md border border-main bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-main/30'

    return (
        <form onSubmit={submit} className={cn('bg-white rounded-lg shadow-lg p-4 grid gap-3', compact ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-5')}>
            <div className="flex gap-1 bg-slate-100 rounded-md p-1 md:col-span-1">
                {listingTypes.map((t) => (
                    <button
                        type="button"
                        key={t}
                        onClick={() => setListingType(t)}
                        className={cn('flex-1 h-8 rounded text-sm font-medium transition', listingType === t ? 'bg-main text-white' : 'text-slate-600')}
                    >
                        {t}
                    </button>
                ))}
            </div>
            <select className={selectCn} value={province} onChange={(e) => setProvince(e.target.value)}>
                <option value="">Tỉnh thành</option>
                {provinceNames.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select className={selectCn} value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                <option value="">Loại BĐS</option>
                {propertyTypes.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <input
                className="h-10 rounded-md border border-main bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-main/30"
                placeholder="Từ khoá (vd: chung cư, view đẹp...)"
                value={q}
                onChange={(e) => setQ(e.target.value)}
            />
            <Button type="submit" className="md:col-span-1">
                <Search className="w-4 h-4" /> Tìm kiếm
            </Button>
        </form>
    )
}

export default SearchBar