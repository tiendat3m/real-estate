import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiCreateComment } from '@/apis/comment'
import { apiUpsertRating } from '@/apis/rating'
import useMeStore from '@/zustand/useMeStore'
import { toast } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import RatingStars from './RatingStars'
import { MessageSquare, Send } from 'lucide-react'
import { formatDate } from '@/lib/constants'

const CommentSection = ({ postId, comments = [], ratings = [], onRefresh }) => {
    const { token } = useMeStore()
    const navigate = useNavigate()
    const [content, setContent] = useState('')
    const [replyTo, setReplyTo] = useState(null)
    const [replyContent, setReplyContent] = useState('')
    const [star, setStar] = useState(5)
    const [ratingText, setRatingText] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const requireLogin = () => {
        if (!token) { toast('Vui lòng đăng nhập để tương tác', true); navigate('/'); return true }
        return false
    }

    const submitComment = async (e, parentId = null, text = content) => {
        e.preventDefault()
        if (requireLogin()) return
        if (!text.trim()) return
        setSubmitting(true)
        try {
            await apiCreateComment({ idPost: postId, content: text, idParent: parentId })
            setContent(''); setReplyTo(null); setReplyContent('')
            toast('Đã gửi bình luận')
            onRefresh?.()
        } catch (err) { toast(err?.response?.data?.msg || 'Lỗi gửi bình luận', true) }
        finally { setSubmitting(false) }
    }

    const submitRating = async (e) => {
        e.preventDefault()
        if (requireLogin()) return
        setSubmitting(true)
        try {
            await apiUpsertRating({ idPost: postId, star, content: ratingText })
            setRatingText('')
            toast('Đã gửi đánh giá')
            onRefresh?.()
        } catch (err) { toast(err?.response?.data?.msg || 'Lỗi gửi đánh giá', true) }
        finally { setSubmitting(false) }
    }

    return (
        <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* Bình luận */}
            <div>
                <h3 className="font-bold text-main text-lg mb-3 flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Bình luận ({comments.length})</h3>

                <form onSubmit={(e) => submitComment(e)} className="mb-4">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={3}
                        placeholder={token ? 'Viết bình luận...' : 'Đăng nhập để bình luận'}
                        className="w-full rounded-md border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-main/30"
                    />
                    <Button type="submit" size="sm" className="mt-2" disabled={submitting || !content.trim()}>
                        <Send className="w-4 h-4" /> Gửi
                    </Button>
                </form>

                <div className="space-y-4">
                    {comments.length === 0 && <p className="text-sm text-slate-400">Chưa có bình luận.</p>}
                    {comments.map((c) => (
                        <div key={c.id} className="bg-slate-50 rounded-md p-3">
                            <div className="flex items-center gap-2">
                                {c.user?.avatar
                                    ? <img src={c.user.avatar} className="w-7 h-7 rounded-full" alt="" />
                                    : <div className="w-7 h-7 rounded-full bg-main text-white grid place-items-center text-xs font-bold">{c.user?.fullname?.[0]}</div>}
                                <span className="font-medium text-sm">{c.user?.fullname || 'Ẩn danh'}</span>
                                <span className="text-xs text-slate-400">{formatDate(c.createdAt)}</span>
                            </div>
                            <p className="text-sm mt-1 ml-9">{c.content}</p>
                            <div className="ml-9 mt-1">
                                <button onClick={() => setReplyTo(replyTo === c.id ? null : c.id)} className="text-xs text-main hover:underline">
                                    {replyTo === c.id ? 'Huỷ trả lời' : 'Trả lời'}
                                </button>
                            </div>

                            {c.replies?.length > 0 && (
                                <div className="ml-9 mt-3 space-y-3 border-l-2 border-slate-200 pl-3">
                                    {c.replies.map((r) => (
                                        <div key={r.id}>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">{r.user?.fullname}</span>
                                                <span className="text-xs text-slate-400">{formatDate(r.createdAt)}</span>
                                            </div>
                                            <p className="text-sm mt-0.5">{r.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {replyTo === c.id && (
                                <form onSubmit={(e) => submitComment(e, c.id, replyContent)} className="ml-9 mt-2">
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        rows={2}
                                        placeholder="Phản hồi..."
                                        className="w-full rounded border border-slate-300 p-2 text-sm"
                                    />
                                    <Button type="submit" size="sm" className="mt-1" disabled={!replyContent.trim()}>Gửi phản hồi</Button>
                                </form>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Đánh giá */}
            <div>
                <h3 className="font-bold text-main text-lg mb-3">Đánh giá ({ratings.length})</h3>

                <form onSubmit={submitRating} className="bg-slate-50 rounded-md p-3 mb-4">
                    <p className="text-sm font-medium mb-1">Chấm điểm của bạn:</p>
                    <RatingStars value={star} editable onSelect={setStar} size={22} className="mb-2" />
                    <textarea
                        value={ratingText}
                        onChange={(e) => setRatingText(e.target.value)}
                        rows={2}
                        placeholder="Nhận xét của bạn (tuỳ chọn)..."
                        className="w-full rounded border border-slate-300 p-2 text-sm"
                    />
                    <Button type="submit" size="sm" className="mt-2" disabled={submitting}>Gửi đánh giá</Button>
                </form>

                <div className="space-y-3">
                    {ratings.length === 0 && <p className="text-sm text-slate-400">Chưa có đánh giá.</p>}
                    {ratings.map((r) => (
                        <div key={r.id} className="border-b pb-3">
                            <div className="flex items-center gap-2">
                                {r.user?.avatar
                                    ? <img src={r.user.avatar} className="w-6 h-6 rounded-full" alt="" />
                                    : <div className="w-6 h-6 rounded-full bg-main text-white grid place-items-center text-[10px] font-bold">{r.user?.fullname?.[0]}</div>}
                                <span className="font-medium text-sm">{r.user?.fullname}</span>
                                <RatingStars value={r.star} size={12} />
                            </div>
                            {r.content && <p className="text-sm mt-1 ml-8 text-slate-700">{r.content}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CommentSection
