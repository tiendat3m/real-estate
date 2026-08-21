import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Search, Star, Trash2 } from 'lucide-react'
import { apiAdminDeletePost, apiAdminListPosts, apiAdminUpdatePostModeration } from '@/apis/admin'
import EmptyState from '@/components/common/EmptyState'
import Spinner from '@/components/common/Spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { approvalStatuses, availabilityStatuses, formatDate, formatPrice, labelOf, postStatuses } from '@/lib/constants'
import { pathnames } from '@/lib/pathname'
import { toast } from '@/lib/utils'

const AdminPosts = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({ status: '', approvalStatus: '', availabilityStatus: '', q: '' })

    const fetchPosts = useCallback(async (params = {}) => {
        setLoading(true)
        try {
            const { data } = await apiAdminListPosts(params)
            setPosts(data?.data || [])
        } catch {
            setPosts([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    const filter = (event) => {
        event.preventDefault()
        fetchPosts(filters)
    }

    const updatePost = async (post, patch) => {
        try {
            await apiAdminUpdatePostModeration(post.id, patch)
            toast('Đã cập nhật tin đăng')
            fetchPosts(filters)
        } catch (err) {
            toast(err?.response?.data?.msg || 'Không thể cập nhật tin', true)
        }
    }

    const reject = async (post) => {
        const reason = window.prompt('Lý do từ chối tin này?')
        if (reason === null) return
        updatePost(post, { approvalStatus: 'rejected', rejectReason: reason || 'Tin chưa đạt yêu cầu duyệt' })
    }

    const remove = async (post) => {
        if (!window.confirm(`Xóa tin "${post.title}"?`)) return
        try {
            await apiAdminDeletePost(post.id)
            toast('Đã xóa tin')
            fetchPosts(filters)
        } catch (err) {
            toast(err?.response?.data?.msg || 'Không thể xóa tin', true)
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-primary">Quản lý tin đăng</h1>
                <p className="mt-1 text-sm text-slate-500">Duyệt tin, từ chối có lý do, ẩn tin và đánh dấu nổi bật.</p>
            </div>

            <form onSubmit={filter} className="mb-4 grid gap-3 rounded-lg border bg-white p-4 lg:grid-cols-[1fr_180px_180px_180px_auto]">
                <Input value={filters.q} onChange={(e) => setFilters((cur) => ({ ...cur, q: e.target.value }))} placeholder="Tìm theo tiêu đề hoặc địa chỉ" />
                <select className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm" value={filters.approvalStatus} onChange={(e) => setFilters((cur) => ({ ...cur, approvalStatus: e.target.value }))}>
                    <option value="">Tất cả duyệt tin</option>
                    {approvalStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                <select className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm" value={filters.availabilityStatus} onChange={(e) => setFilters((cur) => ({ ...cur, availabilityStatus: e.target.value }))}>
                    <option value="">Tất cả giao dịch</option>
                    {availabilityStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                <select className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm" value={filters.status} onChange={(e) => setFilters((cur) => ({ ...cur, status: e.target.value }))}>
                    <option value="">Trạng thái cũ</option>
                    {postStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <Button type="submit"><Search className="h-4 w-4" /> Lọc</Button>
            </form>

            {loading ? <Spinner label="Đang tải tin..." /> : posts.length === 0 ? <EmptyState title="Không có tin đăng" /> : (
                <div className="overflow-x-auto rounded-lg border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="p-3 text-left">Tin đăng</th>
                                <th className="p-3 text-left">Người đăng</th>
                                <th className="p-3 text-left">Giá</th>
                                <th className="p-3 text-left">Duyệt tin</th>
                                <th className="p-3 text-left">Giao dịch</th>
                                <th className="p-3 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id} className="border-t align-top">
                                    <td className="min-w-[320px] p-3">
                                        <div className="flex gap-3">
                                            <img src={post.coverImage || post.images?.[0] || '/jpg/banner-1.jpg'} alt="" className="h-16 w-20 rounded object-cover" />
                                            <div>
                                                <p className="font-bold text-primary line-clamp-2">{post.title}</p>
                                                <p className="text-xs text-slate-500">{post.address}</p>
                                                <p className="mt-1 text-xs text-slate-400">{formatDate(post.createdAt)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">{post.user?.fullname || post.user?.email || '-'}</td>
                                    <td className="p-3 font-semibold text-main">{formatPrice(post.price, post.listingType, post.propertyType)}</td>
                                    <td className="p-3">
                                        <select className="h-9 rounded border border-slate-300 px-2" value={post.approvalStatus || 'pending'} onChange={(e) => updatePost(post, { approvalStatus: e.target.value })}>
                                            {approvalStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                                        </select>
                                        {post.approvalStatus === 'rejected' && <p className="mt-1 max-w-[180px] text-xs text-red-500">{post.rejectReason}</p>}
                                    </td>
                                    <td className="p-3">
                                        <select className="h-9 rounded border border-slate-300 px-2" value={post.availabilityStatus || 'available'} onChange={(e) => updatePost(post, { availabilityStatus: e.target.value })}>
                                            {availabilityStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                                        </select>
                                        <p className="mt-1 text-xs text-slate-400">{labelOf(approvalStatuses, post.approvalStatus)}</p>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex justify-end gap-2">
                                            <Button asChild size="sm" variant="outline">
                                                <Link to={pathnames.publics.postDetailById(post.slug || post.id)}><Eye className="h-4 w-4" /> Xem</Link>
                                            </Button>
                                            <Button size="sm" variant={post.isFeatured ? 'default' : 'outline'} onClick={() => updatePost(post, { isFeatured: !post.isFeatured })}>
                                                <Star className="h-4 w-4" /> {post.isFeatured ? 'Bỏ nổi bật' : 'Nổi bật'}
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => reject(post)}>Từ chối</Button>
                                            <Button size="sm" variant="destructive" onClick={() => remove(post)}>
                                                <Trash2 className="h-4 w-4" /> Xóa
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AdminPosts
