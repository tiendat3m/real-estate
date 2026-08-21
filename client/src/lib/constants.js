import slugify from 'slugify'

export const listingTypes = ['Bán', 'Cho thuê']
export const propertyTypes = [
    'Căn hộ chung cư', 'Nhà mặt phố', 'Nhà riêng', 'Nhà phố thương mại',
    'Biệt thự', 'Đất nền', 'Bán đất', 'Trang trại', 'Khu nghỉ dưỡng',
    'Kho', 'Nhà xưởng', 'Khác',
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
    { name: 'Hà Nội', code: 'HN', img: '/jpg/hanoi.jpg' },
    { name: 'Hồ Chí Minh', code: 'HCM', img: '/jpg/hcm.jpg' },
    { name: 'Đà Nẵng', code: 'DN', img: '/jpg/danang.jpg' },
    { name: 'Bình Dương', code: 'BD', img: '/jpg/binhduong.jpg' },
    { name: 'Đồng Nai', code: 'DNA', img: '/jpg/dongnai.jpg' },
    { name: 'Nha Trang', code: 'NT', img: '/jpg/nhatrang.jpg' },
]

export const provinceNames = provinces.map((p) => p.name)

export const soldPriceRanges = [
    { label: 'Dưới 1 tỷ', min: 0, max: 1_000_000_000 },
    { label: '1 - 3 tỷ', min: 1_000_000_000, max: 3_000_000_000 },
    { label: '3 - 5 tỷ', min: 3_000_000_000, max: 5_000_000_000 },
    { label: '5 - 10 tỷ', min: 5_000_000_000, max: 10_000_000_000 },
    { label: 'Trên 10 tỷ', min: 10_000_000_000, max: null },
]
export const rentPriceRanges = [
    { label: 'Dưới 5 triệu', min: 0, max: 5_000_000 },
    { label: '5 - 10 triệu', min: 5_000_000, max: 10_000_000 },
    { label: '10 - 20 triệu', min: 10_000_000, max: 20_000_000 },
    { label: '20 - 50 triệu', min: 20_000_000, max: 50_000_000 },
    { label: 'Trên 50 triệu', min: 50_000_000, max: null },
]

export const labelOf = (items, value) => items.find((item) => item.value === value)?.label || value || '-'

export const formatPrice = (price, listingType) => {
    const value = Number(price)
    if (price == null || Number.isNaN(value)) return 'Thỏa thuận'
    if (listingType === 'Cho thuê') {
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

export const postSoldTypes = propertyTypes.map((el) => ({ name: el, pathname: slugify(el) }))
export const postRentTypes = propertyTypes.map((el) => ({ name: el, pathname: slugify(el) }))
