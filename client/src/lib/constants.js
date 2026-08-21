import slugify from 'slugify'

export const listingTypes = ['Bán', 'Cho thuê']

export const soldPropertyTypes = [
    'Căn hộ chung cư',
    'Nhà mặt phố',
    'Nhà riêng',
    'Nhà phố thương mại',
    'Biệt thự',
    'Đất nền',
    'Bán đất',
    'Trang trại',
    'Khu nghỉ dưỡng',
    'Kho',
    'Nhà xưởng',
    'Khác',
]

export const rentPropertyTypes = [
    'Phòng trọ',
    'Nhà nguyên căn',
    'Căn hộ chung cư',
    'Ở ghép',
    'Homestay',
    'Nhà riêng',
    'Biệt thự',
    'Khu nghỉ dưỡng',
    'Kho',
    'Nhà xưởng',
    'Khác',
]

export const propertyTypes = Array.from(new Set([...soldPropertyTypes, ...rentPropertyTypes]))

export const rentCategories = [
    { label: 'Phòng trọ', value: 'Phòng trọ', hint: 'Giá mềm, gần trường và khu công nghiệp' },
    { label: 'Nhà nguyên căn', value: 'Nhà nguyên căn', hint: 'Không gian riêng cho gia đình hoặc nhóm bạn' },
    { label: 'Căn hộ', value: 'Căn hộ chung cư', hint: 'Tiện ích đầy đủ, an ninh tốt' },
    { label: 'Ở ghép', value: 'Ở ghép', hint: 'Tối ưu chi phí, tìm bạn cùng nhà' },
    { label: 'Homestay', value: 'Homestay', hint: 'Thuê ngắn ngày, du lịch và nghỉ dưỡng' },
]

export const postStatuses = ['Còn trống', 'Đang đàm phán', 'Đã bàn giao']
export const directions = ['Đông - Bắc', 'Tây - Nam', 'Đông - Nam', 'Tây - Bắc', 'Đông', 'Tây', 'Nam', 'Bắc']
export const legalStatuses = ['Sổ hồng', 'Sổ đỏ', 'Hợp đồng mua bán', 'Đang chờ sổ', 'Giấy tay', 'Khác']

export const approvalStatuses = [
    { value: 'pending', label: 'Chờ duyệt' },
    { value: 'approved', label: 'Đã duyệt' },
    { value: 'rejected', label: 'Từ chối' },
]

export const availabilityStatuses = [
    { value: 'available', label: 'Còn giao dịch' },
    { value: 'negotiating', label: 'Đang đàm phán' },
    { value: 'handed_over', label: 'Đã bàn giao' },
    { value: 'hidden', label: 'Tạm ẩn' },
]

export const leadStatuses = [
    { value: 'new', label: 'Mới' },
    { value: 'contacted', label: 'Đã liên hệ' },
    { value: 'qualified', label: 'Tiềm năng' },
    { value: 'closed', label: 'Đã chốt' },
    { value: 'lost', label: 'Không phù hợp' },
]

export const reportStatuses = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'resolved', label: 'Đã xử lý' },
    { value: 'rejected', label: 'Bỏ qua' },
]

export const reportReasons = ['Sai giá', 'Tin không có thật', 'Thông tin liên hệ sai', 'Ảnh không đúng', 'Đã giao dịch', 'Lý do khác']

export const provinces = [
    { name: 'Hà Nội', code: 'HN', img: '/jpg/hanoi.jpg', rentHint: 'Phòng trọ, căn hộ mini, ở ghép quanh các trường lớn' },
    { name: 'Hồ Chí Minh', code: 'HCM', img: '/jpg/hcm.jpg', rentHint: 'Nguồn tin thuê sôi động, nhiều phòng và căn hộ dịch vụ' },
    { name: 'Đà Nẵng', code: 'DN', img: '/jpg/danang.jpg', rentHint: 'Căn hộ biển, homestay, nhà nguyên căn theo tháng' },
    { name: 'Bình Dương', code: 'BD', img: '/jpg/binhduong.jpg', rentHint: 'Phòng trọ gần khu công nghiệp, giá dễ tiếp cận' },
    { name: 'Đồng Nai', code: 'DNA', img: '/jpg/dongnai.jpg', rentHint: 'Nhà thuê, phòng trọ và kho xưởng quanh trục kết nối' },
    { name: 'Nha Trang', code: 'NT', img: '/jpg/nhatrang.jpg', rentHint: 'Homestay, căn hộ nghỉ dưỡng và nhà gần biển' },
    { name: 'Hải Phòng', code: 'HP', img: '/jpg/hanoi.jpg', rentHint: 'Nhà thuê, căn hộ và phòng trọ quanh khu công nghiệp, cảng biển' },
    { name: 'Cần Thơ', code: 'CT', img: '/jpg/hcm.jpg', rentHint: 'Phòng trọ sinh viên, nhà nguyên căn và mặt bằng trung tâm' },
    { name: 'Huế', code: 'HUE', img: '/jpg/danang.jpg', rentHint: 'Phòng trọ, homestay và nhà thuê gần khu đại học' },
    { name: 'Quảng Ninh', code: 'QN', img: '/jpg/nhatrang.jpg', rentHint: 'Căn hộ du lịch, homestay và nhà thuê gần biển' },
    { name: 'Bà Rịa - Vũng Tàu', code: 'BRVT', img: '/jpg/nhatrang.jpg', rentHint: 'Homestay, căn hộ biển, nhà nguyên căn cuối tuần' },
    { name: 'Lâm Đồng', code: 'LD', img: '/jpg/danang.jpg', rentHint: 'Homestay Đà Lạt, villa nghỉ dưỡng và nhà thuê dài hạn' },
    { name: 'Long An', code: 'LA', img: '/jpg/dongnai.jpg', rentHint: 'Nhà thuê, đất nền và kho xưởng giáp TP.HCM' },
    { name: 'Tây Ninh', code: 'TN', img: '/jpg/binhduong.jpg', rentHint: 'Phòng trọ, nhà thuê và đất khu vực phát triển mới' },
    { name: 'Bắc Ninh', code: 'BN', img: '/jpg/hanoi.jpg', rentHint: 'Phòng trọ và căn hộ quanh các khu công nghiệp lớn' },
    { name: 'Hưng Yên', code: 'HY', img: '/jpg/hanoi.jpg', rentHint: 'Căn hộ, nhà phố và phòng trọ vùng vệ tinh Hà Nội' },
    { name: 'Khánh Hòa', code: 'KH', img: '/jpg/nhatrang.jpg', rentHint: 'Homestay, căn hộ biển và nhà nghỉ dưỡng' },
    { name: 'Quảng Nam', code: 'QNA', img: '/jpg/danang.jpg', rentHint: 'Homestay Hội An, nhà thuê gần khu du lịch' },
]

export const provinceNames = provinces.map((p) => p.name)

export const districtsByProvince = {
    'Hà Nội': ['Ba Đình', 'Hoàn Kiếm', 'Đống Đa', 'Hai Bà Trưng', 'Cầu Giấy', 'Thanh Xuân', 'Nam Từ Liêm', 'Bắc Từ Liêm', 'Long Biên', 'Hà Đông', 'Hoài Đức', 'Đông Anh'],
    'Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 7', 'Quận 10', 'Quận 12', 'Bình Thạnh', 'Gò Vấp', 'Tân Bình', 'Tân Phú', 'Phú Nhuận', 'Bình Tân', 'Thủ Đức', 'Nhà Bè'],
    'Đà Nẵng': ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ', 'Hòa Vang'],
    'Bình Dương': ['Thủ Dầu Một', 'Dĩ An', 'Thuận An', 'Tân Uyên', 'Bến Cát', 'Bàu Bàng'],
    'Đồng Nai': ['Biên Hòa', 'Long Khánh', 'Nhơn Trạch', 'Trảng Bom', 'Long Thành', 'Vĩnh Cửu'],
    'Nha Trang': ['Lộc Thọ', 'Vĩnh Hải', 'Vĩnh Phước', 'Phước Long', 'Phước Hải', 'Vĩnh Nguyên'],
    'Hải Phòng': ['Hồng Bàng', 'Lê Chân', 'Ngô Quyền', 'Hải An', 'Kiến An', 'Thủy Nguyên', 'An Dương'],
    'Cần Thơ': ['Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Ô Môn', 'Thốt Nốt', 'Phong Điền'],
    'Huế': ['Thuận Hóa', 'Phú Xuân', 'Hương Thủy', 'Hương Trà', 'Phú Vang', 'Quảng Điền'],
    'Quảng Ninh': ['Hạ Long', 'Cẩm Phả', 'Uông Bí', 'Móng Cái', 'Đông Triều', 'Vân Đồn'],
    'Bà Rịa - Vũng Tàu': ['Vũng Tàu', 'Bà Rịa', 'Phú Mỹ', 'Long Điền', 'Đất Đỏ', 'Xuyên Mộc'],
    'Lâm Đồng': ['Đà Lạt', 'Bảo Lộc', 'Đức Trọng', 'Lâm Hà', 'Di Linh', 'Bảo Lâm'],
    'Long An': ['Tân An', 'Bến Lức', 'Đức Hòa', 'Cần Giuộc', 'Cần Đước', 'Thủ Thừa'],
    'Tây Ninh': ['Tây Ninh', 'Trảng Bàng', 'Gò Dầu', 'Hòa Thành', 'Dương Minh Châu', 'Châu Thành'],
    'Bắc Ninh': ['Bắc Ninh', 'Từ Sơn', 'Yên Phong', 'Quế Võ', 'Tiên Du', 'Thuận Thành'],
    'Hưng Yên': ['Hưng Yên', 'Văn Giang', 'Mỹ Hào', 'Yên Mỹ', 'Khoái Châu', 'Ân Thi'],
    'Khánh Hòa': ['Nha Trang', 'Cam Ranh', 'Ninh Hòa', 'Diên Khánh', 'Cam Lâm', 'Vạn Ninh'],
    'Quảng Nam': ['Tam Kỳ', 'Hội An', 'Điện Bàn', 'Duy Xuyên', 'Núi Thành', 'Thăng Bình'],
}

export const getDistrictsByProvince = (province) => districtsByProvince[province] || []

export const soldPriceRanges = [
    { label: 'Dưới 1 tỷ', min: 0, max: 1_000_000_000 },
    { label: '1 - 3 tỷ', min: 1_000_000_000, max: 3_000_000_000 },
    { label: '3 - 5 tỷ', min: 3_000_000_000, max: 5_000_000_000 },
    { label: '5 - 10 tỷ', min: 5_000_000_000, max: 10_000_000_000 },
    { label: 'Trên 10 tỷ', min: 10_000_000_000, max: null },
]

export const rentPriceRanges = [
    { label: 'Dưới 3 triệu', min: 0, max: 3_000_000 },
    { label: '3 - 5 triệu', min: 3_000_000, max: 5_000_000 },
    { label: '5 - 10 triệu', min: 5_000_000, max: 10_000_000 },
    { label: '10 - 20 triệu', min: 10_000_000, max: 20_000_000 },
    { label: '20 - 50 triệu', min: 20_000_000, max: 50_000_000 },
    { label: 'Trên 50 triệu', min: 50_000_000, max: null },
]

export const homestayPriceRanges = [
    { label: 'Dưới 500 nghìn/đêm', min: 0, max: 500_000 },
    { label: '500 nghìn - 1 triệu/đêm', min: 500_000, max: 1_000_000 },
    { label: '1 - 2 triệu/đêm', min: 1_000_000, max: 2_000_000 },
    { label: 'Trên 2 triệu/đêm', min: 2_000_000, max: null },
]

export const areaRanges = [
    { label: 'Dưới 20 m²', min: 0, max: 20 },
    { label: '20 - 40 m²', min: 20, max: 40 },
    { label: '40 - 70 m²', min: 40, max: 70 },
    { label: '70 - 100 m²', min: 70, max: 100 },
    { label: 'Trên 100 m²', min: 100, max: null },
]

export const rentalGuides = [
    {
        slug: 'checklist-xem-phong-truoc-khi-dat-coc',
        title: 'Checklist xem phòng trước khi đặt cọc',
        date: '05/12/2024',
        image: '/jpg/banner-1.jpg',
        excerpt: 'Các điểm cần kiểm tra về chi phí, hiện trạng phòng và người cho thuê trước khi chuyển cọc.',
        content: [
            'Trước khi đặt cọc, hãy kiểm tra kỹ hiện trạng phòng, khóa cửa, điện nước, wifi, chỗ gửi xe và lối thoát hiểm. Những chi tiết nhỏ này ảnh hưởng trực tiếp đến trải nghiệm sống hằng ngày.',
            'Bạn nên hỏi rõ tiền điện, nước, internet, rác, gửi xe, phí quản lý và điều kiện hoàn cọc. Nếu có thể, hãy chụp lại hiện trạng phòng và lưu tin nhắn thỏa thuận với chủ nhà.',
            'Chỉ chuyển cọc khi thông tin người nhận tiền trùng với chủ nhà hoặc người được ủy quyền rõ ràng, có biên nhận hoặc hợp đồng đặt cọc.'
        ],
    },
    {
        slug: 'cach-nhan-biet-tin-cho-thue-thieu-minh-bach',
        title: 'Cách nhận biết tin cho thuê thiếu minh bạch',
        date: '18/08/2024',
        image: '/jpg/banner-2.jpg',
        excerpt: 'Nhận diện tin đăng dùng ảnh không thật, giá bất thường hoặc thông tin liên hệ mập mờ.',
        content: [
            'Tin thiếu minh bạch thường có giá thấp bất thường, ảnh quá đẹp nhưng mô tả sơ sài, không nêu rõ địa chỉ hoặc liên tục yêu cầu chuyển phí giữ chỗ trước khi xem.',
            'Hãy ưu tiên tin có hình ảnh thật, địa chỉ cụ thể, số điện thoại rõ ràng và người đăng phản hồi nhất quán. Với tin giá rẻ hơn mặt bằng nhiều, nên kiểm tra thêm bằng bản đồ và hỏi video hiện trạng.',
            'Nếu phát hiện tin sai, hãy dùng chức năng báo cáo để admin kiểm tra và hạn chế rủi ro cho người thuê sau.'
        ],
    },
    {
        slug: 'kinh-nghiem-chon-homestay-cho-nhom-ban',
        title: 'Kinh nghiệm chọn homestay cho nhóm bạn',
        date: '09/03/2024',
        image: '/jpg/banner-3.jpg',
        excerpt: 'Chọn homestay theo số khách, vị trí, phụ thu cuối tuần và tiện ích sinh hoạt chung.',
        content: [
            'Với nhóm bạn, tiêu chí quan trọng nhất là số khách tối đa, số phòng ngủ, số nhà tắm và không gian sinh hoạt chung. Một căn đẹp nhưng thiếu nhà tắm có thể làm lịch trình rất bất tiện.',
            'Nên hỏi rõ giờ check-in/check-out, phụ thu cuối tuần, phụ thu khách thêm, quy định nấu ăn, karaoke, thú cưng và chỗ đậu xe.',
            'Hãy lưu lại xác nhận đặt lịch, tổng chi phí và điều kiện hủy phòng để tránh phát sinh khi gần ngày đi.'
        ],
    },
    {
        slug: 'nhung-khoan-phi-can-hoi-ro-khi-thue-nha',
        title: 'Những khoản phí cần hỏi rõ khi thuê nhà',
        date: '09/03/2024',
        image: '/jpg/banner-4.jpg',
        excerpt: 'Ngoài tiền thuê, người thuê cần hỏi trước các khoản phí vận hành để tính đúng ngân sách.',
        content: [
            'Ngoài tiền thuê chính, bạn cần hỏi rõ điện, nước, internet, gửi xe, vệ sinh, phí quản lý, phí thang máy và phí bảo trì nếu có.',
            'Với căn hộ hoặc nhà nguyên căn, hãy kiểm tra thêm tiền cọc, kỳ thanh toán, điều kiện tăng giá, điều kiện sửa chữa và trách nhiệm khi thiết bị hư hỏng.',
            'Tổng chi phí mỗi tháng nên được tính trước khi ký hợp đồng, vì giá thuê thấp nhưng phí phụ cao có thể vượt ngân sách ban đầu.'
        ],
    },
]

export const newsArticles = [
    ...rentalGuides,
    {
        slug: 'kinh-nghiem-xem-nha-lan-dau',
        title: 'Kinh nghiệm xem nhà lần đầu để không bỏ sót chi tiết quan trọng',
        date: '21/08/2026',
        image: '/jpg/hanoi.jpg',
        excerpt: 'Những điểm nên quan sát khi đi xem nhà mua hoặc thuê lần đầu.',
        content: [
            'Khi xem nhà lần đầu, đừng chỉ nhìn nội thất. Hãy quan sát ánh sáng, độ thoáng, tiếng ồn, mùi ẩm, áp lực nước và chất lượng cửa khóa.',
            'Bạn nên đi xem vào cả ban ngày và buổi tối nếu có thể, vì môi trường xung quanh có thể thay đổi rất nhiều theo thời điểm.',
            'Ghi lại ưu nhược điểm ngay sau khi xem từng căn để dễ so sánh và tránh bị ấn tượng ban đầu chi phối.'
        ],
    },
    {
        slug: 'chon-can-ho-cho-gia-dinh-tre',
        title: 'Các yếu tố nên cân nhắc khi chọn căn hộ cho gia đình trẻ',
        date: '18/08/2026',
        image: '/jpg/hcm.jpg',
        excerpt: 'Ưu tiên tiện ích, trường học, y tế, giao thông và khả năng mở rộng nhu cầu sống.',
        content: [
            'Gia đình trẻ nên ưu tiên căn hộ có kết nối giao thông tốt, gần trường học, siêu thị, công viên và cơ sở y tế.',
            'Ngoài diện tích hiện tại, hãy cân nhắc nhu cầu trong 3 đến 5 năm tới như phòng làm việc, phòng cho trẻ nhỏ hoặc khu vui chơi.',
            'Phí quản lý, chất lượng ban quản trị và mật độ cư dân cũng là các yếu tố ảnh hưởng lâu dài.'
        ],
    },
]

export const seoRentGroups = [
    { title: 'Cho thuê phòng trọ', type: 'Phòng trọ' },
    { title: 'Nhà nguyên căn', type: 'Nhà nguyên căn' },
    { title: 'Cho thuê căn hộ', type: 'Căn hộ chung cư' },
    { title: 'Tìm người ở ghép', type: 'Ở ghép' },
    { title: 'Cho thuê homestay', type: 'Homestay' },
]

export const labelOf = (items, value) => items.find((item) => item.value === value)?.label || value || '-'

export const isHomestay = (propertyType) => String(propertyType || '').toLowerCase().includes('homestay')

export const getPropertyTypesForListing = (listingType) => (listingType === 'Cho thuê' ? rentPropertyTypes : soldPropertyTypes)

export const getRentPriceRanges = (propertyType) => (isHomestay(propertyType) ? homestayPriceRanges : rentPriceRanges)

export const formatPrice = (price, listingType, propertyType) => {
    const value = Number(price)
    if (price == null || Number.isNaN(value)) return 'Thỏa thuận'
    if (listingType === 'Cho thuê') {
        if (isHomestay(propertyType)) {
            if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 ? 1 : 0)} triệu/đêm`
            return `${value.toLocaleString('vi-VN')} đ/đêm`
        }
        if (propertyType === 'Ở ghép') {
            if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 ? 1 : 0)} triệu/người/tháng`
            return `${value.toLocaleString('vi-VN')} đ/người/tháng`
        }
        if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 ? 1 : 0)} triệu/tháng`
        return `${value.toLocaleString('vi-VN')} đ/tháng`
    }
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(value % 1_000_000_000 ? 2 : 0)} tỷ`
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} triệu`
    return `${value.toLocaleString('vi-VN')} đ`
}

export const formatArea = (size) => (size ? `${size} m²` : '-')

export const formatDate = (d) => {
    if (!d) return ''
    const date = new Date(d)
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export const postSoldTypes = soldPropertyTypes.map((el) => ({ name: el, pathname: slugify(el) }))
export const postRentTypes = rentPropertyTypes.map((el) => ({ name: el, pathname: slugify(el) }))
