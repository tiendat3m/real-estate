import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Home, MapPin, Newspaper, ShieldCheck, Sparkles } from 'lucide-react'
import { apiGetFeatured, apiGetPosts } from '@/apis/post'
import PostGrid from '@/components/post/PostGrid'
import SearchBar from '@/components/search/SearchBar'
import { provinces, rentCategories, rentalGuides } from '@/lib/constants'
import { pathnames } from '@/lib/pathname'

const HomePage = () => {
    const [latestRent, setLatestRent] = useState([])
    const [featured, setFeatured] = useState([])
    const [homestays, setHomestays] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        const fetchData = async () => {
            setLoading(true)
            try {
                const [latestRentRes, featuredRes, homestayRes] = await Promise.all([
                    apiGetPosts({ listingType: 'Cho thuê', order: 'newest', limit: 8 }),
                    apiGetFeatured({ limit: 8 }),
                    apiGetPosts({ listingType: 'Cho thuê', propertyType: 'Homestay', order: 'featured', limit: 4 }),
                ])
                if (!mounted) return
                setLatestRent(latestRentRes.data?.data || [])
                setFeatured(featuredRes.data?.data || [])
                setHomestays(homestayRes.data?.data || [])
            } catch {
                if (!mounted) return
                setLatestRent([])
                setFeatured([])
                setHomestays([])
            } finally {
                if (mounted) setLoading(false)
            }
        }
        fetchData()
        return () => { mounted = false }
    }, [])

    return (
        <div className="min-h-screen bg-secondary pb-12">
            <section className="relative overflow-hidden bg-primary text-white">
                <div className="absolute inset-0">
                    <img src="/jpg/banner-3.jpg" alt="" className="h-full w-full object-cover opacity-35" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/35" />
                </div>
                <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:py-14">
                    <div className="flex min-h-[360px] flex-col justify-center">
                        <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-sm font-semibold text-white/90">
                            <Sparkles className="h-4 w-4" /> Phòng trọ, căn hộ, ở ghép, homestay
                        </p>
                        <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-5xl">
                            Tìm kiếm chỗ thuê giá tốt, rõ thông tin, liên hệ nhanh.
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-white/85">
                            REST06 gom tin thuê và mua bán theo khu vực, ngân sách, diện tích, trạng thái xác thực để bạn chọn nơi ở hoặc đầu tư dễ hơn.
                        </p>
                        <div className="mt-6 grid max-w-2xl gap-3 text-sm text-white/90 sm:grid-cols-3">
                            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Tin có ảnh, có vị trí</div>
                            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Báo cáo tin sai</div>
                            <div className="flex items-center gap-2"><Home className="h-4 w-4 text-emerald-300" /> Có homestay ngắn ngày</div>
                        </div>
                    </div>

                    <div className="w-full max-w-[420px] self-center justify-self-end">
                        <SearchBar />
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pt-8">
                <div className="grid gap-3 md:grid-cols-5">
                    {rentCategories.map((category) => (
                        <Link
                            key={category.value}
                            to={`${pathnames.publics.rentProperty}?propertyType=${encodeURIComponent(category.value)}`}
                            className="rounded-lg border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-main/40 hover:shadow-md"
                        >
                            <p className="font-bold text-primary">{category.label}</p>
                            <p className="mt-1 min-h-[40px] text-sm text-slate-500">{category.hint}</p>
                            <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-main">
                                Xem tin <ArrowRight className="h-4 w-4" />
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pt-10">
                <div className="mb-4 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-primary">Gợi ý khu vực thuê nhiều</h2>
                        <p className="mt-1 text-sm text-slate-500">Chọn nhanh những thị trường đang có nhu cầu thuê mạnh.</p>
                    </div>
                    <Link to={pathnames.publics.rentProperty} className="hidden text-sm font-semibold text-main hover:underline sm:inline">Xem tất cả</Link>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {provinces.slice(0, 6).map((province) => (
                        <Link
                            key={province.name}
                            to={`${pathnames.publics.rentProperty}?province=${encodeURIComponent(province.name)}`}
                            className="group relative h-44 overflow-hidden rounded-lg bg-slate-200 shadow-sm"
                        >
                            <img src={province.img} alt={province.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                                <p className="flex items-center gap-1 text-lg font-bold text-white"><MapPin className="h-4 w-4" /> {province.name}</p>
                                <p className="mt-1 line-clamp-2 text-xs text-white/80">{province.rentHint}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pt-10">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-primary">Tin cho thuê mới đăng</h2>
                    <Link to={pathnames.publics.rentProperty} className="text-sm font-semibold text-main hover:underline">Xem tất cả</Link>
                </div>
                <PostGrid posts={latestRent} loading={loading} emptyTitle="Chưa có tin cho thuê mới" />
            </section>

            <section className="mx-auto max-w-7xl px-4 pt-10">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-primary">Homestay nổi bật</h2>
                        <p className="mt-1 text-sm text-slate-500">Phù hợp thuê ngắn ngày, nhóm bạn, nghỉ dưỡng hoặc công tác.</p>
                    </div>
                    <Link to={`${pathnames.publics.rentProperty}?propertyType=Homestay`} className="text-sm font-semibold text-main hover:underline">Xem homestay</Link>
                </div>
                <PostGrid posts={homestays} loading={loading} emptyTitle="Chưa có homestay phù hợp" />
            </section>

            <section className="mx-auto max-w-7xl px-4 pt-10">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-primary">Tin nổi bật toàn thị trường</h2>
                            <Link to={pathnames.publics.soldProperty} className="text-sm font-semibold text-main hover:underline">Xem mua bán</Link>
                        </div>
                        <PostGrid posts={featured} loading={loading} emptyTitle="Chưa có tin nổi bật" />
                    </div>

                    <aside className="h-fit rounded-lg border bg-white p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <Newspaper className="h-5 w-5 text-main" />
                            <h2 className="text-xl font-bold text-primary">Kinh nghiệm thuê</h2>
                        </div>
                        <div className="space-y-3">
                            {rentalGuides.map((item) => (
                                <Link key={item.title} to={pathnames.publics.newsDetailBySlug(item.slug)} className="block rounded-md border border-slate-100 p-3 hover:border-main/30 hover:bg-slate-50">
                                    <p className="text-xs font-semibold text-slate-400">{item.date}</p>
                                    <p className="mt-1 font-semibold leading-5 text-slate-700">{item.title}</p>
                                </Link>
                            ))}
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    )
}

export default HomePage
