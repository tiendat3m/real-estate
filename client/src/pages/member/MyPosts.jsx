import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Eye, PlusCircle, Trash2 } from 'lucide-react'
import { apiDeletePost, apiGetMyPosts } from '@/apis/post'
import EmptyState from '@/components/common/EmptyState'
import Spinner from '@/components/common/Spinner'
import { Button } from '@/components/ui/button'
import { approvalStatuses, availabilityStatuses, formatArea, formatDate, formatPrice, labelOf } from '@/lib/constants'
import { pathnames } from '@/lib/pathname'
import { cn, toast } from '@/lib/utils'

const approvalCn = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
}

const MyPosts = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchPosts = async () => {
        setLoading(true)
        try {
            const { data } = await apiGetMyPosts()
            setPosts(data?.data || [])
        } catch {
            setPosts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const remove = async (post) => {
        if (!window.confirm(`Xóa tin "${post.title}"?`)) return
        try {
            await apiDeletePost(post.id)
            toast('Đã xóa tin đăng')
            fetchPosts()
        } catch (err) {
            toast(err?.response?.data?.msg || 'Không thể xóa tin', true)
        }
    }

    return (
        <div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Tin của tôi</h1>
                    <p className="mt-1 text-sm text-slate-500">Quản lý tin đăng, trạng thái duyệt và tình trạng giao dịch.</p>
                </div>
                <Button asChild>
                    <Link to={`${pathnames.users.layout}${pathnames.users.newPost}`}><PlusCircle className="h-4 w-4" /> Đăng tin</Link>
                </Button>
            </div>

            {loading ? <Spinner label="Đang tải tin..." /> : posts.length === 0 ? <EmptyState title="Bạn chưa có tin đăng" /> : (
                <div className="overflow-x-auto rounded-lg border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="p-3 text-left">Tin đăng</th>
                                <th className="p-3 text-left">Giá</th>
                                <th className="p-3 text-left">Diện tích</th>
                                <th className="p-3 text-left">Duyệt tin</th>
                                <th className="p-3 text-left">Giao dịch</th>
                                <th className="p-3 text-left">Ngày đăng</th>
                                <th className="p-3 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id} className="border-t align-top">
                                    <td className="min-w-[300px] p-3">
                                        <p className="font-bold text-primary line-clamp-1">{post.title}</p>
                                        <p className="text-xs text-slate-500">{post.province} · {post.propertyType}</p>
                                        {post.rejectReason && <p className="mt-1 max-w-xs text-xs text-red-500">{post.rejectReason}</p>}
                                    </td>
                                    <td className="p-3 font-semibold text-main">{formatPrice(post.price, post.listingType, post.propertyType)}</td>
                                    <td className="p-3">{formatArea(post.size)}</td>
                                    <td className="p-3">
                                        <span className={cn('rounded px-2 py-1 text-xs font-semibold', approvalCn[post.approvalStatus] || 'bg-slate-100 text-slate-600')}>
                                            {labelOf(approvalStatuses, post.approvalStatus)}
                                        </span>
                                    </td>
                                    <td className="p-3">{labelOf(availabilityStatuses, post.availabilityStatus)}</td>
                                    <td className="p-3 whitespace-nowrap">{formatDate(post.createdAt)}</td>
                                    <td className="p-3">
                                        <div className="flex justify-end gap-2">
                                            <Button asChild size="sm" variant="outline">
                                                <Link to={pathnames.publics.postDetailById(post.slug || post.id)}><Eye className="h-4 w-4" /> Xem</Link>
                                            </Button>
                                            <Button asChild size="sm" variant="outline">
                                                <Link to={`${pathnames.users.layout}/tin-cua-toi/${post.id}/sua`}><Edit className="h-4 w-4" /> Sửa</Link>
                                            </Button>
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

export default MyPosts
