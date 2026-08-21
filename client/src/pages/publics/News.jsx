import { Link } from 'react-router-dom'
import { CalendarDays } from 'lucide-react'

const News = () => {
    const news = [
        {
            title: 'Kinh nghiệm xem nhà lần đầu để không bỏ sót chi tiết quan trọng',
            image: '/jpg/banner-1.jpg',
            date: '21/08/2026',
        },
        {
            title: 'Các yếu tố nên cân nhắc khi chọn căn hộ cho gia đình trẻ',
            image: '/jpg/banner-2.jpg',
            date: '18/08/2026',
        },
        {
            title: 'Thuê nhà dài hạn: kiểm tra hợp đồng và chi phí phát sinh',
            image: '/jpg/banner-3.jpg',
            date: '15/08/2026',
        },
        {
            title: 'Xu hướng tìm kiếm bất động sản tại các đô thị vệ tinh',
            image: '/jpg/banner-4.jpg',
            date: '10/08/2026',
        },
        {
            title: 'Gợi ý chuẩn bị hồ sơ trước khi giao dịch nhà đất',
            image: '/jpg/hanoi.jpg',
            date: '05/08/2026',
        },
        {
            title: 'Cách đọc thông tin tin đăng bất động sản nhanh và chính xác',
            image: '/jpg/hcm.jpg',
            date: '01/08/2026',
        },
    ]

    return (
        <div className="bg-secondary min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-primary">Tin tức bất động sản</h1>
                    <p className="text-sm text-slate-500 mt-1">Góc tham khảo nhanh cho người mua, thuê và đăng tin.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {news.map((item) => (
                        <Link key={item.title} to="#" className="group overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition">
                            <div className="h-52 overflow-hidden bg-slate-100">
                                <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                            </div>
                            <div className="p-4">
                                <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                                    <CalendarDays className="w-3.5 h-3.5" /> {item.date}
                                </p>
                                <h2 className="font-bold text-primary leading-snug group-hover:text-main">{item.title}</h2>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default News
