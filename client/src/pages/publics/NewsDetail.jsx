import { Link, useParams } from 'react-router-dom'
import { CalendarDays, ChevronLeft, Newspaper } from 'lucide-react'
import EmptyState from '@/components/common/EmptyState'
import { newsArticles } from '@/lib/constants'
import { pathnames } from '@/lib/pathname'

const NewsDetail = () => {
    const { slug } = useParams()
    const article = newsArticles.find((item) => item.slug === slug)
    const related = newsArticles.filter((item) => item.slug !== slug).slice(0, 4)

    if (!article) {
        return (
            <div className="min-h-screen bg-secondary py-16">
                <EmptyState title="Không tìm thấy bài viết" subtitle="Bài viết có thể đã được cập nhật hoặc không còn tồn tại." />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-secondary">
            <div className="mx-auto max-w-7xl px-4 py-8">
                <Link to={pathnames.publics.news} className="inline-flex items-center gap-1 text-sm font-semibold text-main hover:underline">
                    <ChevronLeft className="h-4 w-4" /> Quay lại tin tức
                </Link>

                <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <article className="overflow-hidden rounded-lg border bg-white">
                        <div className="h-[260px] bg-slate-100 md:h-[420px]">
                            <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="p-5 md:p-8">
                            <p className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-slate-500">
                                <CalendarDays className="h-4 w-4" /> {article.date}
                            </p>
                            <h1 className="text-3xl font-black leading-tight text-primary md:text-4xl">{article.title}</h1>
                            <p className="mt-4 text-lg leading-8 text-slate-600">{article.excerpt}</p>
                            <div className="mt-6 space-y-4 border-t pt-6 text-base leading-8 text-slate-700">
                                {article.content.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </article>

                    <aside className="h-fit rounded-lg border bg-white p-5 lg:sticky lg:top-24">
                        <div className="mb-4 flex items-center gap-2">
                            <Newspaper className="h-5 w-5 text-main" />
                            <h2 className="text-xl font-bold text-primary">Bài viết liên quan</h2>
                        </div>
                        <div className="space-y-3">
                            {related.map((item) => (
                                <Link key={item.slug} to={pathnames.publics.newsDetailBySlug(item.slug)} className="block rounded-md border border-slate-100 p-3 hover:border-main/30 hover:bg-slate-50">
                                    <p className="text-xs font-semibold text-slate-400">{item.date}</p>
                                    <p className="mt-1 font-semibold leading-5 text-slate-700">{item.title}</p>
                                </Link>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default NewsDetail
