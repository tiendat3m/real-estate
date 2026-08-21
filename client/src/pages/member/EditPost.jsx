import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiGetPostDetail, apiUpdatePost } from '@/apis/post'
import EmptyState from '@/components/common/EmptyState'
import Spinner from '@/components/common/Spinner'
import PostForm from '@/components/post/PostForm'
import { pathnames } from '@/lib/pathname'
import { toast } from '@/lib/utils'

const EditPost = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        const fetchPost = async () => {
            setLoading(true)
            try {
                const { data } = await apiGetPostDetail(id)
                if (mounted) setPost(data?.data || null)
            } catch {
                if (mounted) setPost(null)
            } finally {
                if (mounted) setLoading(false)
            }
        }
        fetchPost()
        return () => { mounted = false }
    }, [id])

    const submit = async (payload) => {
        await apiUpdatePost(id, payload)
        toast('Đã cập nhật tin đăng')
        navigate(`${pathnames.users.layout}${pathnames.users.myPosts}`)
    }

    if (loading) return <Spinner label="Đang tải tin đăng..." />
    if (!post) return <EmptyState title="Không tìm thấy tin đăng" />

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-primary">Sửa tin đăng</h1>
                <p className="text-sm text-slate-500 mt-1">Cập nhật nội dung, hình ảnh và thông tin liên hệ của tin.</p>
            </div>
            <PostForm initialPost={post} submitLabel="Cập nhật tin" onSubmit={submit} />
        </div>
    )
}

export default EditPost
