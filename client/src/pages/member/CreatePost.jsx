import { useNavigate } from 'react-router-dom'
import { apiCreatePost } from '@/apis/post'
import PostForm from '@/components/post/PostForm'
import { pathnames } from '@/lib/pathname'
import { toast } from '@/lib/utils'

const CreatePost = () => {
    const navigate = useNavigate()

    const submit = async (payload) => {
        await apiCreatePost(payload)
        toast('Đã tạo tin đăng, tin đang chờ admin duyệt')
        navigate(`${pathnames.users.layout}${pathnames.users.myPosts}`)
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-primary">Đăng tin mới</h1>
                <p className="mt-1 text-sm text-slate-500">Tin mới sẽ vào hàng chờ duyệt trước khi xuất hiện công khai.</p>
            </div>
            <PostForm submitLabel="Đăng tin" onSubmit={submit} />
        </div>
    )
}

export default CreatePost
