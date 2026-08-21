import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AlertTriangle, Bath, BedDouble, Building2, CheckCircle2, Compass, Copy, Eye, Heart, Home, Layers, MapPin, Phone, Ruler, Send, Sofa, Tag } from 'lucide-react'
import { apiGetPostDetail, apiGetRelatedPosts } from '@/apis/post'
import { apiCreateLead } from '@/apis/lead'
import { apiCreateReport } from '@/apis/report'
import { apiCheckWishlist, apiToggleWishlist } from '@/apis/wishlist'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import CommentSection from '@/components/post/CommentSection'
import ImageGallery from '@/components/post/ImageGallery'
import PostGrid from '@/components/post/PostGrid'
import RatingStars from '@/components/post/RatingStars'
import { availabilityStatuses, formatArea, formatDate, formatPrice, labelOf, reportReasons } from '@/lib/constants'
import { pathnames } from '@/lib/pathname'
import { cn, toast } from '@/lib/utils'
import useMeStore from '@/zustand/useMeStore'

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 rounded-lg border bg-white p-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-main/10 text-main">
            <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="break-words font-semibold text-primary">{value || '-'}</p>
        </div>
    </div>
)

const ContactLeadForm = ({ post }) => {
    const { me } = useMeStore()
    const [form, setForm] = useState({
        fullname: me?.fullname || '',
        phone: me?.phone || '',
        email: me?.email || '',
        message: `Tôi quan tâm tin "${post.title}". Vui lòng liên hệ lại.`,
    })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        setForm((current) => ({ ...current, fullname: me?.fullname || current.fullname, phone: me?.phone || current.phone, email: me?.email || current.email }))
    }, [me])

    const submit = async (event) => {
        event.preventDefault()
        setSubmitting(true)
        try {
            await apiCreateLead({ ...form, idPost: post.id })
            toast('Đã gửi yêu cầu liên hệ')
        } catch (err) {
            toast(err?.response?.data?.msg || 'Không thể gửi yêu cầu liên hệ', true)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={submit} className="space-y-3">
            <div className="grid gap-2">
                <input className="h-10 rounded-md border border-slate-300 px-3 text-sm" placeholder="Họ tên" value={form.fullname} onChange={(e) => setForm((cur) => ({ ...cur, fullname: e.target.value }))} required />
                <input className="h-10 rounded-md border border-slate-300 px-3 text-sm" placeholder="Số điện thoại" value={form.phone} onChange={(e) => setForm((cur) => ({ ...cur, phone: e.target.value }))} required />
                <input className="h-10 rounded-md border border-slate-300 px-3 text-sm" placeholder="Email" value={form.email} onChange={(e) => setForm((cur) => ({ ...cur, email: e.target.value }))} />
                <textarea rows={3} className="rounded-md border border-slate-300 p-3 text-sm" value={form.message} onChange={(e) => setForm((cur) => ({ ...cur, message: e.target.value }))} />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
                <Send className="h-4 w-4" /> {submitting ? 'Đang gửi...' : 'Gửi yêu cầu liên hệ'}
            </Button>
        </form>
    )
}

const ReportForm = ({ postId }) => {
    const [reason, setReason] = useState(reportReasons[0])
    const [description, setDescription] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const submit = async (event) => {
        event.preventDefault()
        setSubmitting(true)
        try {
            await apiCreateReport({ idPost: postId, reason, description })
            setDescription('')
            toast('Đã gửi báo cáo cho admin')
        } catch (err) {
            toast(err?.response?.data?.msg || 'Không thể gửi báo cáo', true)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={submit} className="space-y-2">
            <select className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm" value={reason} onChange={(e) => setReason(e.target.value)}>
                {reportReasons.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <textarea rows={2} className="w-full rounded-md border border-slate-300 p-3 text-sm" placeholder="Mô tả thêm nếu cần" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Button type="submit" variant="outline" className="w-full" disabled={submitting}>
                <AlertTriangle className="h-4 w-4" /> Báo cáo tin
            </Button>
        </form>
    )
}

const PostDetail = () => {
    const { idDetail } = useParams()
    const { token } = useMeStore()
    const [post, setPost] = useState(null)
    const [related, setRelated] = useState([])
    const [loading, setLoading] = useState(true)
    const [wished, setWished] = useState(false)
    const [wishlistLoading, setWishlistLoading] = useState(false)

    const fetchDetail = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = await apiGetPostDetail(idDetail)
            setPost(data?.data || null)
        } catch {
            setPost(null)
        } finally {
            setLoading(false)
        }
    }, [idDetail])

    useEffect(() => {
        fetchDetail()
    }, [fetchDetail])

    useEffect(() => {
        let mounted = true
        const fetchRelated = async () => {
            if (!post?.id) return
            try {
                const { data } = await apiGetRelatedPosts(post.id, { limit: 4 })
                if (mounted) setRelated(data?.data || [])
            } catch {
                if (mounted) setRelated([])
            }
        }
        fetchRelated()
        return () => { mounted = false }
    }, [post?.id])

    useEffect(() => {
        let mounted = true
        const checkWishlist = async () => {
            if (!token || !post?.id) {
                setWished(false)
                return
            }
            try {
                const { data } = await apiCheckWishlist(post.id)
                if (mounted) setWished(!!data?.wished)
            } catch {
                if (mounted) setWished(false)
            }
        }
        checkWishlist()
        return () => { mounted = false }
    }, [token, post?.id])

    const toggleWishlist = async () => {
        if (!token) {
            toast('Vui lòng đăng nhập để lưu tin yêu thích', true)
            return
        }
        setWishlistLoading(true)
        try {
            const { data } = await apiToggleWishlist(post.id)
            setWished(!!data?.wished)
            toast(data?.wished ? 'Đã thêm vào yêu thích' : 'Đã bỏ khỏi yêu thích')
        } catch (err) {
            toast(err?.response?.data?.msg || 'Không thể cập nhật yêu thích', true)
        } finally {
            setWishlistLoading(false)
        }
    }

    const copyLink = async () => {
        await navigator.clipboard?.writeText(window.location.href)
        toast('Đã copy link tin đăng')
    }

    if (loading) {
        return <div className="min-h-screen bg-secondary py-16"><Spinner label="Đang tải tin đăng..." /></div>
    }

    if (!post) {
        return <div className="min-h-screen bg-secondary py-16"><EmptyState title="Không tìm thấy tin đăng" subtitle="Tin đăng có thể đã bị xóa hoặc không còn khả dụng." /></div>
    }

    const address = post.address || [post.ward, post.district, post.province].filter(Boolean).join(', ')
    const user = post.user || {}
    const tags = post.tags || []
    const info = [
        { icon: Ruler, label: 'Diện tích', value: formatArea(post.size) },
        { icon: BedDouble, label: 'Phòng ngủ', value: post.bedroom ? `${post.bedroom} phòng` : '-' },
        { icon: Bath, label: 'Phòng tắm', value: post.bathroom ? `${post.bathroom} phòng` : '-' },
        { icon: Layers, label: 'Số tầng', value: post.floor ? `${post.floor} tầng` : '-' },
        { icon: Compass, label: 'Hướng nhà', value: post.direction },
        { icon: Sofa, label: 'Nội thất', value: post.isFurniture ? 'Có nội thất' : 'Không nội thất' },
        { icon: Building2, label: 'Loại BĐS', value: post.propertyType },
        { icon: Home, label: 'Pháp lý', value: post.legalStatus || 'Đang cập nhật' },
    ]

    return (
        <div className="min-h-screen bg-secondary">
            <div className="mx-auto max-w-7xl px-4 py-8">
                <Link to={post.listingType === 'Cho thuê' ? pathnames.publics.rentProperty : pathnames.publics.soldProperty} className="text-sm font-semibold text-main hover:underline">
                    Quay lại danh sách
                </Link>

                <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
                    <main className="min-w-0">
                        <div className="mb-4 rounded-lg border bg-white p-4">
                            <div className="mb-3 flex flex-wrap gap-2">
                                <span className="rounded bg-main px-2.5 py-1 text-xs font-bold text-white">{post.listingType}</span>
                                <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{labelOf(availabilityStatuses, post.availabilityStatus)}</span>
                                {post.verified && <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 className="h-3 w-3" /> Đã xác thực</span>}
                                {post.isFeatured && <span className="rounded bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">Nổi bật</span>}
                            </div>
                            <h1 className="text-3xl font-bold leading-tight text-primary">{post.title}</h1>
                            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-main">{formatPrice(post.price, post.listingType)}</p>
                                    <p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><MapPin className="h-4 w-4 shrink-0" /> {address}</p>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {post.views || 0} lượt xem</span>
                                    <span>{formatDate(post.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        <ImageGallery images={post.images || []} />

                        <section className="mt-6">
                            <h2 className="mb-3 text-xl font-bold text-primary">Thông tin bất động sản</h2>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {info.map((item) => <InfoItem key={item.label} {...item} />)}
                            </div>
                        </section>

                        <section className="mt-6 rounded-lg border bg-white p-5">
                            <h2 className="mb-3 text-xl font-bold text-primary">Mô tả</h2>
                            <div className="whitespace-pre-line leading-7 text-slate-700">{post.description || 'Chưa có mô tả chi tiết.'}</div>
                        </section>

                        {tags.length > 0 && (
                            <section className="mt-6 rounded-lg border bg-white p-5">
                                <h2 className="mb-3 text-xl font-bold text-primary">Từ khóa</h2>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((item) => <span key={item.id || item.tag} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"><Tag className="h-3 w-3" /> {item.tag || item}</span>)}
                                </div>
                            </section>
                        )}

                        <section className="mt-6 rounded-lg border bg-white p-5">
                            <h2 className="mb-3 text-xl font-bold text-primary">Vị trí</h2>
                            <div className="h-[320px] overflow-hidden rounded-lg bg-slate-100">
                                <iframe title="Bản đồ vị trí" src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`} className="h-full w-full border-0" loading="lazy" />
                            </div>
                        </section>

                        <section className="mt-6">
                            <h2 className="mb-3 text-xl font-bold text-primary">Tin tương tự</h2>
                            <PostGrid posts={related} loading={false} emptyTitle="Chưa có tin tương tự" />
                        </section>

                        <CommentSection postId={post.id} comments={post.comments || []} ratings={post.ratings || []} onRefresh={fetchDetail} />
                    </main>

                    <aside className="h-fit space-y-4 lg:sticky lg:top-20">
                        <div className="rounded-lg border bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Giá</p>
                            <p className="mt-1 text-2xl font-bold text-main">{formatPrice(post.price, post.listingType)}</p>
                            <div className="mt-3 flex items-center gap-2">
                                <RatingStars value={post.avgScore || 0} />
                                <span className="text-sm text-slate-500">{post.avgScore || 0} ({post.ratingCount || 0} đánh giá)</span>
                            </div>
                            <div className="mt-5 grid grid-cols-2 gap-2">
                                <Button type="button" variant={wished ? 'default' : 'outline'} disabled={wishlistLoading} onClick={toggleWishlist}>
                                    <Heart className={cn('h-4 w-4', wished && 'fill-current')} /> {wished ? 'Đã lưu' : 'Lưu tin'}
                                </Button>
                                <Button type="button" variant="outline" onClick={copyLink}>
                                    <Copy className="h-4 w-4" /> Copy link
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-white p-5 shadow-sm">
                            <h2 className="mb-4 font-bold text-primary">Liên hệ người đăng</h2>
                            <div className="flex items-center gap-3">
                                {user.avatar ? <img src={user.avatar} alt={user.fullname} className="h-14 w-14 rounded-full object-cover" /> : <div className="grid h-14 w-14 place-items-center rounded-full bg-main text-xl font-bold text-white">{user.fullname?.[0] || 'R'}</div>}
                                <div className="min-w-0">
                                    <p className="truncate font-bold text-primary">{user.fullname || 'Người đăng tin'}</p>
                                    <p className="text-sm text-slate-500">Mã tin #{post.id}</p>
                                    {user.verifiedAgent && <p className="text-xs font-semibold text-emerald-600">Môi giới đã xác thực</p>}
                                </div>
                            </div>
                            {user.phone ? <Button asChild className="mt-4 w-full"><a href={`tel:${user.phone}`}><Phone className="h-4 w-4" /> {user.phone}</a></Button> : <Button className="mt-4 w-full" disabled><Phone className="h-4 w-4" /> Chưa có số điện thoại</Button>}
                        </div>

                        <div className="rounded-lg border bg-white p-5 shadow-sm">
                            <h2 className="mb-4 font-bold text-primary">Gửi yêu cầu tư vấn</h2>
                            <ContactLeadForm post={post} />
                        </div>

                        <div className="rounded-lg border bg-white p-5 shadow-sm">
                            <h2 className="mb-4 font-bold text-primary">Báo cáo tin sai</h2>
                            <ReportForm postId={post.id} />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default PostDetail
