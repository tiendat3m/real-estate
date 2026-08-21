import { Link } from 'react-router-dom'
import { CalendarDays } from 'lucide-react'
import { newsArticles } from '@/lib/constants'
import { pathnames } from '@/lib/pathname'

const News = () => {
    return (
        <div className="min-h-screen bg-secondary">
            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-primary">Tin tức bất động sản</h1>
                    <p className="mt-1 text-sm text-slate-500">Góc tham khảo nhanh cho người mua, thuê và đăng tin.</p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {newsArticles.map((item) => (
                        <Link key={item.slug} to={pathnames.publics.newsDetailBySlug(item.slug)} className="group overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md">
                            <div className="h-52 overflow-hidden bg-slate-100">
                                <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                            </div>
                            <div className="p-4">
                                <p className="mb-2 flex items-center gap-1 text-xs text-slate-500">
                                    <CalendarDays className="h-3.5 w-3.5" /> {item.date}
                                </p>
                                <h2 className="font-bold leading-snug text-primary group-hover:text-main">{item.title}</h2>
                                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{item.excerpt}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default News
