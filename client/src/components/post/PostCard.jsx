import { Link } from 'react-router-dom'
import { Bath, BedDouble, CheckCircle2, Eye, MapPin, Maximize, Star } from 'lucide-react'
import { availabilityStatuses, formatArea, formatPrice, labelOf } from '@/lib/constants'
import { pathnames } from '@/lib/pathname'
import { cn } from '@/lib/utils'

const PostCard = ({ post }) => {
    const cover = post.coverImage || post.images?.[0]
    const isRent = post.listingType === 'Cho thuê'

    return (
        <Link to={pathnames.publics.postDetailById(post.slug || post.id)} className="group block overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md">
            <div className="relative h-48 overflow-hidden bg-slate-100">
                {cover ? (
                    <img src={cover} alt={post.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                ) : (
                    <div className="grid h-full w-full place-items-center text-slate-300"><MapPin className="h-10 w-10" /></div>
                )}
                <span className={cn('absolute left-2 top-2 rounded px-2 py-1 text-xs font-bold text-white', isRent ? 'bg-amber-500' : 'bg-main')}>
                    {post.listingType}
                </span>
                {post.verified && (
                    <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white">
                        <CheckCircle2 className="h-4 w-4" />
                    </span>
                )}
                {post.isFeatured && <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">Nổi bật</span>}
            </div>
            <div className="p-3">
                <p className="truncate text-lg font-bold text-main">{formatPrice(post.price, post.listingType)}</p>
                <p className="mt-1 min-h-[40px] text-sm font-medium text-slate-800 line-clamp-2">{post.title}</p>
                <p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-500">
                    <MapPin className="h-3 w-3 shrink-0" /> {post.address || `${post.district}, ${post.province}`}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1"><Maximize className="h-3.5 w-3.5" /> {formatArea(post.size)}</span>
                    {post.bedroom > 0 && <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" /> {post.bedroom}</span>}
                    {post.bathroom > 0 && <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {post.bathroom}</span>}
                </div>
                <div className="mt-2 flex items-center justify-between border-t pt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        {post.avgScore ? Number(post.avgScore).toFixed(1) : 'Chưa có'}
                    </span>
                    <span>{labelOf(availabilityStatuses, post.availabilityStatus)}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {post.views || 0}</span>
                </div>
            </div>
        </Link>
    )
}

export default PostCard
