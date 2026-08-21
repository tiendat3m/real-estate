import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { apiGetPosts } from '@/apis/post'
import Pagination from '@/components/common/Pagination'
import FilterSidebar from '@/components/post/FilterSidebar'
import PostGrid from '@/components/post/PostGrid'
import SortSelect from '@/components/post/SortSelect'

const queryKeys = ['propertyType', 'province', 'district', 'q', 'minPrice', 'maxPrice', 'minSize', 'maxSize', 'direction']

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

    const applyFilters = () => {
        pushParams({ ...filters, order: urlOrder, page: 1 })
    }

    const resetFilters = () => {
        navigate(location.pathname)
    }

    const changeSort = (order) => {
        pushParams({ ...urlFilters, order, page: 1 })
    }

    const changePage = (page) => {
        pushParams({ ...urlFilters, order: urlOrder, page })
    }

    const title = listingType === 'Cho thuê' ? 'Nhà đất cho thuê' : 'Nhà đất bán'

    return (
        <div className="bg-secondary min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-primary">{title}</h1>
                    <p className="text-sm text-slate-500 mt-1">Tìm kiếm theo khu vực, loại bất động sản, ngân sách và diện tích.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <FilterSidebar
                        listingType={listingType}
                        filters={filters}
                        setFilters={setFilters}
                        onApply={applyFilters}
                        onReset={resetFilters}
                    />

                    <main className="flex-1 min-w-0">
                        <div className="bg-white border rounded-lg p-4 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <p className="font-bold text-primary">{pagination.total || 0} kết quả</p>
                                <p className="text-xs text-slate-500">Trang {pagination.page || urlPage} / {pagination.totalPages || 1}</p>
                            </div>
                            <SortSelect value={urlOrder} onChange={changeSort} />
                        </div>

                        <PostGrid posts={posts} loading={loading} emptyTitle="Không tìm thấy tin đăng phù hợp" />
                        <Pagination page={urlPage} totalPages={pagination.totalPages} onChange={changePage} />
                    </main>
                </div>
            </div>
        </div>
    )
}

export default PropertyListing
