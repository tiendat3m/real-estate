import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGetFeatured } from '@/apis/post'
import Carousel from '@/components/common/Carousel'
import PostGrid from '@/components/post/PostGrid'
import SearchBar from '@/components/search/SearchBar'
import { provinces } from '@/lib/constants'
import { pathnames } from '@/lib/pathname'

const HomePage = () => {
    const [featured, setFeatured] = useState([])
    const [rentFeatured, setRentFeatured] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        const fetchData = async () => {
            setLoading(true)
            try {
                const [soldRes, rentRes] = await Promise.all([
                    apiGetFeatured({ limit: 8 }),
                    apiGetFeatured({ listingType: 'Cho thuê', limit: 4 }),
                ])
                if (!mounted) return
                setFeatured(soldRes.data?.data || [])
                setRentFeatured(rentRes.data?.data || [])
            } catch {
                if (!mounted) return
                setFeatured([])
                setRentFeatured([])
            } finally {
                if (mounted) setLoading(false)
            }
        }
        fetchData()
        return () => { mounted = false }
    }, [])

    const banners = [
        { src: '/jpg/banner-1.jpg', title: 'Tìm nhà đúng gu, đúng ngân sách', subtitle: 'Khám phá những tin đăng mới nhất được cập nhật mỗi ngày.' },
        { src: '/jpg/banner-2.jpg', title: 'Không gian sống cho bước tiếp theo', subtitle: 'Căn hộ, nhà phố, biệt thự và đất nền tại các thành phố lớn.' },
        { src: '/jpg/banner-3.jpg', title: 'Thuê nhanh, chọn kỹ', subtitle: 'Lọc theo khu vực, giá thuê và loại bất động sản bạn cần.' },
        { src: '/jpg/banner-4.jpg', title: 'REST06 đồng hành cùng quyết định lớn', subtitle: 'Thông tin rõ ràng, hình ảnh đầy đủ, kết nối trực tiếp chủ tin.' },
    ]

    return (
        <div className="bg-secondary min-h-screen pb-12">
            <section className="max-w-7xl mx-auto px-4 pt-6">
                <Carousel items={banners} />
                <div className="relative z-10 max-w-5xl mx-auto -mt-10">
                    <SearchBar />
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 mt-12">
                <div className="flex items-end justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-primary">Khám phá theo tỉnh thành</h2>
                        <p className="text-sm text-slate-500 mt-1">Chọn nhanh những thị trường đang được quan tâm.</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {provinces.map((province) => (
                        <Link
                            key={province.name}
                            to={`${pathnames.publics.soldProperty}?province=${encodeURIComponent(province.name)}`}
                            className="group relative h-40 overflow-hidden rounded-lg bg-slate-200 shadow-sm"
                        >
                            <img src={province.img} alt={province.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                                <p className="text-white font-bold text-lg">{province.name}</p>
                                <p className="text-white/80 text-xs">Xem tin mua bán</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 mt-12">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-primary">Tin nổi bật</h2>
                    <Link to={pathnames.publics.soldProperty} className="text-sm font-semibold text-main hover:underline">Xem tất cả</Link>
                </div>
                <PostGrid posts={featured} loading={loading} emptyTitle="Chưa có tin nổi bật" />
            </section>

            <section className="max-w-7xl mx-auto px-4 mt-12">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-primary">Cho thuê nổi bật</h2>
                    <Link to={pathnames.publics.rentProperty} className="text-sm font-semibold text-main hover:underline">Xem tất cả</Link>
                </div>
                <PostGrid posts={rentFeatured} loading={loading} emptyTitle="Chưa có tin cho thuê nổi bật" />
            </section>
        </div>
    )
}

export default HomePage
