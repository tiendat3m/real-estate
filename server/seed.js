// Seed dữ liệu mẫu cho REST06
// Chạy: node seed.js
require('dotenv').config()
const db = require('./models')
const bcrypt = require('bcryptjs')

const TOTAL_POSTS = 96

const hashPassword = (p) => bcrypt.hashSync(p, bcrypt.genSaltSync(10))

const slugify = (value = '') => String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 90) || 'tin-dang'

const IMG = [
    'https://images.unsplash.com/photo-1564013799919-ab6000bffc1e?w=1200',
    'https://images.unsplash.com/photo-1568605114967-8130fc81cb9c?w=1200',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200',
    'https://images.unsplash.com/photo-1600596542815-7ad1eb4f3b94?w=1200',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200',
    'https://images.unsplash.com/photo-1613490493576-ca7de2bd4c52?w=1200',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
]

const img = (i) => JSON.stringify([IMG[i % IMG.length], IMG[(i + 1) % IMG.length], IMG[(i + 2) % IMG.length]])

const locations = {
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

const provinces = Object.keys(locations)
const soldTypes = ['Căn hộ chung cư', 'Nhà riêng', 'Biệt thự', 'Đất nền', 'Nhà mặt phố', 'Nhà phố thương mại', 'Khu nghỉ dưỡng']
const rentTypes = ['Phòng trọ', 'Nhà nguyên căn', 'Căn hộ chung cư', 'Ở ghép', 'Homestay', 'Nhà riêng', 'Biệt thự']
const statuses = ['Còn trống', 'Còn trống', 'Còn trống', 'Đang đàm phán', 'Đã bàn giao']
const directions = ['Đông', 'Tây', 'Nam', 'Bắc', 'Đông - Nam', 'Tây - Bắc', 'Đông - Bắc', 'Tây - Nam']
const legalStatuses = ['Sổ hồng', 'Sổ đỏ', 'Hợp đồng mua bán', 'Đang chờ sổ', 'Khác']
const availabilityStatuses = ['available', 'available', 'available', 'negotiating', 'handed_over']
const approvalStatuses = ['approved', 'approved', 'approved', 'approved', 'pending', 'rejected']
const wards = ['Phường trung tâm', 'Phường 1', 'Phường 2', 'Phường 3', 'Khu đô thị mới', 'Khu dân cư an ninh']

const rand = (arr, i) => arr[i % arr.length]
const rint = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const makePrice = (listingType, propertyType) => {
    if (listingType !== 'Cho thuê') return rint(12, 180) * 100000000
    if (propertyType === 'Homestay') return rint(35, 280) * 10000
    if (propertyType === 'Ở ghép') return rint(12, 45) * 100000
    if (propertyType === 'Phòng trọ') return rint(18, 85) * 100000
    if (propertyType === 'Nhà nguyên căn') return rint(55, 420) * 100000
    return rint(45, 650) * 100000
}

const makeDescription = ({ listingType, propertyType, size, district, province, bedroom, bathroom, floor, direction }) => {
    if (propertyType === 'Homestay') {
        return `Homestay ${size}m² tại ${district}, ${province}, phù hợp nghỉ dưỡng ngắn ngày, công tác hoặc nhóm bạn. Có ${bedroom} phòng ngủ, ${bathroom} nhà tắm, bếp, wifi, máy giặt, khu sinh hoạt chung và hướng dẫn check-in rõ ràng. Giá theo đêm, liên hệ để giữ lịch cuối tuần.`
    }
    if (propertyType === 'Ở ghép') {
        return `Tìm người ở ghép tại ${district}, ${province}. Không gian ${size}m², chi phí rõ ràng, khu an ninh, gần trục đi lại. Phù hợp sinh viên hoặc người đi làm, ưu tiên người thuê lâu dài.`
    }
    if (propertyType === 'Phòng trọ') {
        return `Cho thuê phòng trọ ${size}m² tại ${district}, ${province}. Khu vực an ninh, giờ giấc linh hoạt, gần chợ, trường học và tuyến xe buýt. Có nội thất cơ bản, điện nước minh bạch.`
    }
    return `${listingType} ${propertyType} diện tích ${size}m² tại ${district}, ${province}. Nhà ${bedroom} phòng ngủ, ${bathroom} nhà tắm, ${floor} tầng, hướng ${direction}. Vị trí giao thông thuận tiện, gần tiện ích, pháp lý rõ ràng và có thể xem nhà theo lịch hẹn.`
}

const run = async () => {
    try {
        console.log('⏳ Xoá dữ liệu cũ...')
        await Promise.all([
            db.Tag_Post.destroy({ where: {}, truncate: true, cascade: true }),
            db.Comment.destroy({ where: {} }),
            db.Rating.destroy({ where: {} }),
            db.Wishlist.destroy({ where: {} }),
            db.Lead.destroy({ where: {} }),
            db.Report.destroy({ where: {} }),
            db.Post.destroy({ where: {} }),
            db.Tag.destroy({ where: {} }),
            db.User.destroy({ where: {} }),
        ])

        console.log('⏳ Tạo users...')
        const users = await db.User.bulkCreate([
            {
                email: 'admin@rest06.vn',
                password: hashPassword('123456'),
                fullname: 'Quản trị viên REST06',
                role: 'admin',
                emailVerified: true,
                score: 100,
                userStatus: 'active',
                verifiedAgent: true,
                companyName: 'REST06',
                phone: '0900000001',
                avatar: 'https://ui-avatars.com/api/?name=Admin&background=005163&color=fff',
            },
            {
                email: 'demo@rest06.vn',
                password: hashPassword('123456'),
                phone: '0901234567',
                fullname: 'Nguyễn Văn Demo',
                emailVerified: true,
                score: 50,
                userStatus: 'active',
                verifiedAgent: false,
                avatar: 'https://ui-avatars.com/api/?name=Demo&background=005163&color=fff',
            },
            {
                email: 'agent@rest06.vn',
                password: hashPassword('123456'),
                phone: '0909876543',
                fullname: 'Trần Thị Môi Giới',
                emailVerified: true,
                score: 82,
                userStatus: 'active',
                verifiedAgent: true,
                companyName: 'REST06 Premier Agent',
                avatar: 'https://ui-avatars.com/api/?name=Agent&background=005163&color=fff',
            },
            {
                email: 'homestay@rest06.vn',
                password: hashPassword('123456'),
                phone: '0912222333',
                fullname: 'Lê Homestay',
                emailVerified: true,
                score: 76,
                userStatus: 'active',
                verifiedAgent: true,
                companyName: 'REST06 Stay',
                avatar: 'https://ui-avatars.com/api/?name=Stay&background=005163&color=fff',
            },
            {
                email: 'landlord@rest06.vn',
                password: hashPassword('123456'),
                phone: '0933334444',
                fullname: 'Chủ Nhà An Tâm',
                emailVerified: true,
                score: 65,
                userStatus: 'active',
                verifiedAgent: false,
                avatar: 'https://ui-avatars.com/api/?name=Landlord&background=005163&color=fff',
            },
        ])
        const [admin, demo, agent, stayHost, landlord] = users

        console.log('⏳ Tạo tags...')
        const tagNames = [
            'Căn hộ cao cấp', 'View đẹp', 'Gần metro', 'Có gara', 'Cho sinh viên', 'Khu an ninh',
            'Đủ nội thất', 'Đầu tư', 'Homestay', 'Ở ghép', 'Gần biển', 'Gần khu công nghiệp',
            'Cho gia đình', 'Có ban công', 'Pet friendly', 'Gần đại học',
        ]
        const tags = await db.Tag.bulkCreate(tagNames.map((tag) => ({ tag })))

        console.log(`⏳ Tạo ${TOTAL_POSTS} posts...`)
        const owners = [demo, agent, admin, stayHost, landlord]
        const postsData = []

        for (let i = 0; i < TOTAL_POSTS; i++) {
            const isRent = i % 5 !== 1 && i % 5 !== 4
            const listingType = isRent ? 'Cho thuê' : 'Bán'
            const propertyType = isRent ? rand(rentTypes, i + Math.floor(i / 7)) : rand(soldTypes, i)
            const province = rand(provinces, i)
            const district = rand(locations[province], i + 3)
            const size = propertyType === 'Ở ghép' ? rint(18, 45) : propertyType === 'Phòng trọ' ? rint(18, 55) : propertyType === 'Homestay' ? rint(32, 130) : rint(45, 260)
            const bedroom = propertyType === 'Phòng trọ' || propertyType === 'Ở ghép' ? rint(1, 2) : rint(1, 5)
            const bathroom = propertyType === 'Phòng trọ' || propertyType === 'Ở ghép' ? 1 : rint(1, 4)
            const floor = propertyType === 'Căn hộ chung cư' ? rint(2, 35) : rint(1, 5)
            const direction = rand(directions, i)
            const images = JSON.parse(img(i))
            let approvalStatus = rand(approvalStatuses, i)

            if (['Homestay', 'Phòng trọ', 'Ở ghép'].includes(propertyType) || i % 9 === 0) approvalStatus = 'approved'

            postsData.push({
                title: `${propertyType} ${size}m² ${district}, ${province} - ${listingType === 'Bán' ? 'giá tốt' : propertyType === 'Homestay' ? 'thuê theo đêm' : 'cho thuê nhanh'}`,
                address: `${rint(1, 250)} Đường ${rint(1, 60)}, ${district}, ${province}`,
                province,
                district,
                ward: rand(wards, i),
                price: makePrice(listingType, propertyType),
                size,
                priceUnit: 1,
                description: makeDescription({ listingType, propertyType, size, district, province, bedroom, bathroom, floor, direction }),
                floor,
                bathroom,
                bedroom,
                isFurniture: isRent || i % 2 === 0,
                listingType,
                propertyType,
                direction,
                balonDirection: rand(directions, i + 2),
                status: rand(statuses, i),
                approvalStatus,
                availabilityStatus: approvalStatus === 'approved' ? rand(availabilityStatuses, i) : 'available',
                rejectReason: approvalStatus === 'rejected' ? 'Ảnh hoặc mô tả chưa đủ rõ, vui lòng cập nhật lại.' : null,
                legalStatus: rand(legalStatuses, i),
                verified: i % 4 === 0 || ownerHasVerified(owners[i % owners.length]),
                isFeatured: i % 7 === 0 || propertyType === 'Homestay',
                isBoosted: i % 6 === 0,
                coverImage: images[0],
                latitude: Number((10.75 + (i % 18) / 100).toFixed(7)),
                longitude: Number((106.66 + (i % 18) / 100).toFixed(7)),
                expiredDate: new Date(Date.now() + (20 + (i % 20)) * 86400000),
                images: JSON.stringify(images),
                views: rint(30, 4500),
                idUser: owners[i % owners.length].id,
            })
        }

        const posts = await db.Post.bulkCreate(postsData)
        for (const post of posts) {
            await post.update({ slug: `${slugify(post.title)}-${post.id}` })
        }

        console.log('⏳ Gán tags cho post...')
        for (let i = 0; i < posts.length; i++) {
            const pick = [tags[i % tags.length], tags[(i + 3) % tags.length], tags[(i + 7) % tags.length]]
            await posts[i].setTags(pick)
        }

        console.log('⏳ Tạo ratings + comments + wishlist + leads + reports...')
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i]

            if (i % 2 === 0) {
                const ratingUser = owners[(i + 1) % owners.length]
                await db.Rating.create({
                    idPost: post.id,
                    idUser: ratingUser.id,
                    star: rint(3, 5),
                    content: 'Tin đăng rõ ràng, hình ảnh đầy đủ, vị trí dễ tìm.',
                })
            }

            if (i % 3 === 0) {
                const c1 = await db.Comment.create({
                    idPost: post.id,
                    idUser: demo.id,
                    content: 'Cho mình xin thêm thông tin chi phí và lịch xem thực tế nhé.',
                })
                await db.Comment.create({
                    idPost: post.id,
                    idUser: owners[i % owners.length].id,
                    content: 'Mình đã nhận thông tin, sẽ liên hệ lại trong ngày.',
                    idParent: c1.id,
                })
            }

            if (i % 4 === 0) {
                await db.Wishlist.create({ idPost: post.id, idUser: demo.id })
            }

            if (i % 3 === 1) {
                await db.Lead.create({
                    idPost: post.id,
                    idUser: demo.id,
                    fullname: rand(['Nguyễn Văn Khách', 'Trần Minh Anh', 'Lê Thanh Tùng', 'Phạm Hoài Thu'], i),
                    phone: `09${rint(10000000, 99999999)}`,
                    email: `khach${i}@example.com`,
                    message: post.propertyType === 'Homestay'
                        ? 'Tôi muốn hỏi lịch trống cuối tuần này và phụ thu số khách.'
                        : 'Tôi muốn xem nhà/phòng trong tuần này.',
                    status: rand(['new', 'contacted', 'qualified', 'closed', 'lost'], i),
                    source: i % 2 === 0 ? 'homepage' : 'post_detail',
                })
            }

            if (i % 11 === 2) {
                await db.Report.create({
                    idPost: post.id,
                    idUser: demo.id,
                    reason: rand(['Sai giá', 'Tin không có thật', 'Thông tin liên hệ sai', 'Ảnh không đúng', 'Đã giao dịch'], i),
                    description: 'Người dùng báo cần admin kiểm tra lại thông tin.',
                    status: rand(['pending', 'resolved', 'rejected'], i),
                })
            }
        }

        for (const post of posts) {
            const ratings = await db.Rating.findAll({ where: { idPost: post.id }, attributes: ['star'] })
            if (ratings.length) {
                const avg = ratings.reduce((sum, rating) => sum + rating.star, 0) / ratings.length
                await post.update({ avgScore: Math.round(avg * 10) / 10 })
            }
        }

        console.log('\n✅ Seed xong!')
        console.log('  Admin:    admin@rest06.vn / 123456')
        console.log('  Member:   demo@rest06.vn / 123456')
        console.log('  Agent:    agent@rest06.vn / 123456')
        console.log('  Homestay: homestay@rest06.vn / 123456')
        console.log('  Owner:    landlord@rest06.vn / 123456')
        console.log(`  Posts: ${posts.length} | Provinces: ${provinces.length} | Tags: ${tags.length}`)
        process.exit(0)
    } catch (err) {
        console.error('❌ Seed lỗi:', err)
        process.exit(1)
    }
}

const ownerHasVerified = (owner) => Boolean(owner?.verifiedAgent)

run()
