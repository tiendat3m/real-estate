import { Link } from 'react-router-dom'
import { Building2, Facebook, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { postRentTypes, postSoldTypes, provinces, seoRentGroups } from '@/lib/constants'
import { pathnames } from '@/lib/pathname'

const topProvinces = provinces.slice(0, 6)
const soldLinks = postSoldTypes.slice(0, 6)
const rentLinks = postRentTypes.slice(0, 6)

const FooterLink = ({ to, children }) => (
    <Link to={to} className="block text-sm leading-7 text-slate-300 hover:text-white hover:underline">
        {children}
    </Link>
)

const PublicFooter = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-[#091a2b] text-white">
            <div className="mx-auto max-w-7xl px-4 py-10">
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr_1fr]">
                    <div>
                        <Link to="/" className="inline-flex items-center gap-2" aria-label="REST06 home">
                            <span className="grid h-10 w-10 place-items-center rounded-md bg-white text-lg font-black text-main">R</span>
                            <span className="text-2xl font-black tracking-wider">REST06</span>
                        </Link>
                        <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
                            Nền tảng tìm kiếm phòng trọ, nhà thuê, homestay và bất động sản mua bán với thông tin rõ ràng, hình ảnh đầy đủ và liên hệ trực tiếp.
                        </p>
                        <div className="mt-4 space-y-2 text-sm text-slate-300">
                            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-cyan-300" /> 32-34 Điện Biên Phủ, Quận 1, TP.HCM</p>
                            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-cyan-300" /> 0938 346 879</p>
                            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-cyan-300" /> support@rest06.vn</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="mb-3 flex items-center gap-2 font-bold"><Building2 className="h-4 w-4 text-cyan-300" /> Nhà đất bán</h2>
                        {soldLinks.map((item) => (
                            <FooterLink key={item.name} to={`${pathnames.publics.soldProperty}?propertyType=${encodeURIComponent(item.name)}`}>
                                {item.name}
                            </FooterLink>
                        ))}
                    </div>

                    <div>
                        <h2 className="mb-3 font-bold">Nhà đất cho thuê</h2>
                        {rentLinks.map((item) => (
                            <FooterLink key={item.name} to={`${pathnames.publics.rentProperty}?propertyType=${encodeURIComponent(item.name)}`}>
                                {item.name}
                            </FooterLink>
                        ))}
                    </div>

                    <div>
                        <h2 className="mb-3 font-bold">Khu vực phổ biến</h2>
                        {topProvinces.map((province) => (
                            <FooterLink key={province.name} to={`${pathnames.publics.rentProperty}?province=${encodeURIComponent(province.name)}`}>
                                Cho thuê tại {province.name}
                            </FooterLink>
                        ))}
                    </div>

                    <div>
                        <h2 className="mb-3 flex items-center gap-2 font-bold"><ShieldCheck className="h-4 w-4 text-cyan-300" /> Hỗ trợ</h2>
                        <FooterLink to={pathnames.publics.news}>Tin tức</FooterLink>
                        {seoRentGroups.slice(0, 3).map((group) => (
                            <FooterLink key={group.type} to={`${pathnames.publics.rentProperty}?propertyType=${encodeURIComponent(group.type)}`}>
                                {group.title}
                            </FooterLink>
                        ))}
                        <Link to={pathnames.publics.news} className="mt-4 inline-flex h-9 items-center gap-2 rounded-md border border-white/20 px-3 text-sm font-semibold text-white hover:bg-white/10">
                            <Facebook className="h-4 w-4" /> Theo dõi REST06
                        </Link>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
                    <p>Copyright © {currentYear} REST06. Thông tin đăng tải chỉ có giá trị tham khảo tại thời điểm hiển thị.</p>
                    <div className="flex flex-wrap gap-4">
                        <Link to={pathnames.publics.news} className="hover:text-white hover:underline">Quy định đăng tin</Link>
                        <Link to={pathnames.publics.news} className="hover:text-white hover:underline">Chính sách bảo mật</Link>
                        <Link to={pathnames.publics.news} className="hover:text-white hover:underline">Cơ chế giải quyết tranh chấp</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default PublicFooter
