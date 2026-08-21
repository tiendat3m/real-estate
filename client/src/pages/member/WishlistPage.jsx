import { useEffect, useState } from 'react'
import { apiGetMyWishlist } from '@/apis/wishlist'
import PostGrid from '@/components/post/PostGrid'

const parsePost = (post) => {
    if (!post) return post
    if (typeof post.images === 'string') {
        try { return { ...post, images: JSON.parse(post.images) } }
        catch { return { ...post, images: post.images.split(',').map((item) => item.trim()).filter(Boolean) } }
    }
    return post
}

const WishlistPage = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        const fetchWishlist = async () => {
            setLoading(true)
            try {
                const { data } = await apiGetMyWishlist()
                if (mounted) setPosts((data?.data || []).map((item) => parsePost(item.post)).filter(Boolean))
            } catch {
                if (mounted) setPosts([])
            } finally {
                if (mounted) setLoading(false)
            }
        }
        fetchWishlist()
        return () => { mounted = false }
    }, [])

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-primary">Tin yêu thích</h1>
                <p className="text-sm text-slate-500 mt-1">Các tin bạn đã lưu để xem lại sau.</p>
            </div>
            <PostGrid posts={posts} loading={loading} emptyTitle="Bạn chưa lưu tin nào" />
        </div>
    )
}

export default WishlistPage
