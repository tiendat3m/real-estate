import PostCard from './PostCard'
import EmptyState from '../common/EmptyState'
import Spinner from '../common/Spinner'

const PostGrid = ({ posts, loading, emptyTitle }) => {
    if (loading) return <Spinner label="Đang tải tin đăng..." />
    if (!posts?.length) return <EmptyState title={emptyTitle || 'Không có tin đăng'} />
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
    )
}

export default PostGrid