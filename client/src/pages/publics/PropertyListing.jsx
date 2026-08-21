import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { apiGetPosts } from '@/apis/post'
import Pagination from '@/components/common/Pagination'
import FilterSidebar from '@/components/post/FilterSidebar'
import PostGrid from '@/components/post/PostGrid'
import SortSelect from '@/components/post/SortSelect'
import SearchBar from '@/components/search/SearchBar'
import { rentCategories, seoRentGroups } from '@/lib/constants'
import { pathnames } from '@/lib/pathname'
import { cn } from '@/lib/utils'

const queryKeys = ['propertyType', 'province', 'district', 'q', 'minPrice', 'maxPrice', 'minSize', 'maxSize', 'direction', 'minBedroom', 'verified', 'hasImages']

const getFiltersFromParams = (searchParams) => {
    const filters = {}
    queryKeys.forEach((key) => {
        filters[key] = searchParams.get(key) || ''
    })
    return filters
}

const cleanParams = (params) => {
    const cleaned = {}
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') cleaned[key] = value
    })
    return cleaned
}

const PropertyListing = ({ listingType }) => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const location = useLocation()
    const paramsString = searchParams.toString()
    const currentParams = useMemo(() => new URLSearchParams(paramsString), [paramsString])

    const urlFilters = useMemo(() => getFiltersFromParams(currentParams), [currentParams])
    const urlOrder = currentParams.get('order') || 'newest'
    const urlPage = Math.max(1, Number(currentParams.get('page')) || 1)

    const [filters, setFilters] = useState(urlFilters)
    const [posts, setPosts] = useState([])
    const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 })
    const [loading, setLoading] = useState(true)
    const [showSearch, setShowSearch] = useState(false)

    useEffect(() => {
        setFilters(urlFilters)
    }, [urlFilters])

    useEffect(() => {
        let mounted = true
        const fetchPosts = async () => {
            setLoading(true)
            try {
                const { data } = await apiGetPosts(cleanParams({
                    listingType,
                    ...urlFilters,
                    order: urlOrder,
                    page: urlPage,
                    limit: 12,
                }))
                if (!mounted) return
                setPosts(data?.data || [])
                setPagination(data?.pagination || { page: urlPage, total: 0, totalPages: 1 })
            } catch {
                if (!mounted) return
                setPosts([])
                setPagination({ page: urlPage, total: 0, totalPages: 1 })
            } finally {
                if (mounted) setLoading(false)
            }
        }
        fetchPosts()
        return () => { mounted = false }
    }, [listingType, urlFilters, urlOrder, urlPage])

    const pushParams = (next) => {
        const params = new URLSearchParams()
        Object.entries(cleanParams(next)).forEach(([key, value]) => params.set(key, value))
        navigate(`${location.pathname}${params.toString() ? `?${params.toString()}` : ''}`)
    }

    const applyFilters = () => pushParams({ ...filters, order: urlOrder, page: 1 })
    const resetFilters = () => navigate(location.pathname)
    const changeSort = (order) => pushParams({ ...urlFilters, order, page: 1 })
    const changePage = (page) => pushParams({ ...urlFilters, order: urlOrder, page })

    const isRent = listingType === 'Cho thuê'
    const selectedType = urlFilters.propertyType
    const title = selectedType
        ? `${listingType} ${selectedType}`
        : isRent
            ? 'Tìm chỗ thuê giá tốt'
            : 'Nhà đất bán'

    return (
        <div className="min-h-screen bg-secondary">
            <div className="border-b bg-white">
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-main">{isRent ? 'Thuê phòng, nhà, căn hộ, homestay' : 'Mua bán nhà đất'}</p>
                            <h1 className="mt-1 text-3xl font-bold text-primary">{title}</h1>
                            <p className="mt-1 max-w-2xl text-sm text-slate-500">
                                Lọc theo khu vực, loại hình, ngân sách, diện tích và độ tin cậy của tin đăng.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowSearch((open) => !open)}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-bold text-primary hover:bg-slate-50"
                        >
                            <SlidersHorizontal className="h-4 w-4" /> Tìm kiếm nhanh
                        </button>
                    </div>

                    {isRent && (
                        <div className="mt-5 flex flex-wrap gap-2">
                            {rentCategories.map((category) => {
                                const active = selectedType === category.value
                                return (
                                    <Link
                                        key={category.value}
                                        to={`${pathnames.publics.rentProperty}?propertyType=${encodeURIComponent(category.value)}`}
                                        className={cn('rounded-full border px-3 py-1.5 text-sm font-semibold transition', active ? 'border-main bg-main text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-main hover:text-main')}
                                    >
                                        {category.label}
                                    </Link>
                                )
                            })}
                        </div>
                    )}

                    {showSearch && (
                        <div className="mt-5">
                            <SearchBar compact defaultListingType={listingType} />
                        </div>
                    )}
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col gap-6 lg:flex-row">
                    <FilterSidebar
                        listingType={listingType}
                        filters={filters}
                        setFilters={setFilters}
                        onApply={applyFilters}
                        onReset={resetFilters}
                    />

                    <main className="min-w-0 flex-1">
                        <div className="mb-4 flex flex-col gap-3 rounded-lg border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-bold text-primary">{pagination.total || 0} kết quả phù hợp</p>
                                <p className="text-xs text-slate-500">Trang {pagination.page || urlPage} / {pagination.totalPages || 1}</p>
                            </div>
                            <SortSelect value={urlOrder} onChange={changeSort} />
                        </div>

                        <PostGrid posts={posts} loading={loading} emptyTitle="Không tìm thấy tin đăng phù hợp" />
                        <Pagination page={urlPage} totalPages={pagination.totalPages} onChange={changePage} />
                    </main>
                </div>

                {isRent && (
                    <section className="mt-10 rounded-lg border bg-white p-5">
                        <h2 className="text-xl font-bold text-primary">Tìm nhanh theo nhu cầu thuê</h2>
                        <div className="mt-4 grid gap-3 md:grid-cols-5">
                            {seoRentGroups.map((group) => (
                                <div key={group.type}>
                                    <p className="mb-2 font-bold text-slate-700">{group.title}</p>
                                    <div className="space-y-1">
                                        {['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng'].map((province) => (
                                            <Link
                                                key={province}
                                                to={`${pathnames.publics.rentProperty}?propertyType=${encodeURIComponent(group.type)}&province=${encodeURIComponent(province)}`}
                                                className="block text-sm text-slate-500 hover:text-main hover:underline"
                                            >
                                                {group.title} {province}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}

export default PropertyListing
