// Seed dữ liệu mẫu cho REST06
// Chạy: node seed.js
require('dotenv').config()
const db = require('./models')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
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
]
const img = (i) => JSON.stringify([IMG[i % IMG.length], IMG[(i + 1) % IMG.length], IMG[(i + 2) % IMG.length]])

const PROVINCES = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Bình Dương', 'Đồng Nai', 'Nha Trang']
const DISTRICTS = ['Quận 1', 'Quận 2', 'Hoàn Kiếm', 'Cầu Giấy', 'Nam Từ Liêm', 'Bình Thạnh', 'Gò Vấp', 'Hải Châu', 'Thủ Đức', 'Long Biên']

const soldTypes = ['Căn hộ chung cư', 'Nhà riêng', 'Biệt thự', 'Đất nền', 'Nhà mặt phố', 'Nhà phố thương mại']
const rentTypes = ['Căn hộ chung cư', 'Nhà riêng', 'Biệt thự', 'Kho', 'Nhà xưởng']
const statuses = ['Còn trống', 'Còn trống', 'Còn trống', 'Đang đàm phán', 'Đã bàn giao']
const directions = ['Đông', 'Tây', 'Nam', 'Bắc', 'Đông - Nam', 'Tây - Bắc']
const legalStatuses = ['Sổ hồng', 'Sổ đỏ', 'Hợp đồng mua bán', 'Đang chờ sổ']
const availabilityStatuses = ['available', 'available', 'available', 'negotiating', 'handed_over']
const approvalStatuses = ['approved', 'approved', 'approved', 'pending', 'rejected']

const rand = (arr, i) => arr[i % arr.length]
const rint = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

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
        const admin = await db.User.create({
            email: 'admin@rest06.vn', password: hashPassword('123456'),
            fullname: 'Quản trị viên', role: 'admin', emailVerified: true, score: 100,
            userStatus: 'active', verifiedAgent: true, companyName: 'REST06',
            avatar: 'https://ui-avatars.com/api/?name=Admin&background=005163&color=fff',
        })
        const demo = await db.User.create({
            email: 'demo@rest06.vn', password: hashPassword('123456'),
            phone: '0901234567', fullname: 'Nguyễn Văn Demo', emailVerified: true, score: 50,
            userStatus: 'active', verifiedAgent: false,
            avatar: 'https://ui-avatars.com/api/?name=Demo&background=005163&color=fff',
        })
        const agent = await db.User.create({
            email: 'agent@rest06.vn', password: hashPassword('123456'),
            phone: '0909876543', fullname: 'Trần Thị Môi giới', emailVerified: true, score: 75,
            userStatus: 'active', verifiedAgent: true, companyName: 'REST06 Premier Agent',
            avatar: 'https://ui-avatars.com/api/?name=Agent&background=005163&color=fff',
        })

        console.log('⏳ Tạo tags...')
        const tagNames = ['Căn hộ cao cấp', 'View đẹp', 'Gần метро', 'Có gara', 'Cho sinh viên', 'Khu an ninh', 'Đủ nội thất', 'Đầu tư']
        const tags = await db.Tag.bulkCreate(tagNames.map((t) => ({ tag: t })))

        console.log('⏳ Tạo posts...')
        const postsData = []
        for (let i = 0; i < 16; i++) {
            const isRent = i % 3 === 0
            const listingType = isRent ? 'Cho thuê' : 'Bán'
            const propertyType = isRent ? rand(rentTypes, i) : rand(soldTypes, i)
            const province = rand(PROVINCES, i)
            const district = rand(DISTRICTS, i + 2)
            const size = rint(30, 200)
            const price = isRent ? rint(5, 40) * 1000000 : rint(1, 50) * 100000000
            const bedroom = rint(1, 5)
            const bathroom = rint(1, 4)
            const floor = rint(1, 30)
            const owner = [demo, agent, admin][i % 3]
            const images = JSON.parse(img(i))
            const approvalStatus = rand(approvalStatuses, i)
            postsData.push({
                title: `${propertyType} ${size}m² ${district} ${province} - ${listingType === 'Bán' ? 'bán' : 'cho thuê'} giá tốt`,
                address: `${rint(1, 200)} Đường ${rint(1, 30)}, ${district}, ${province}`,
                province, district, ward: 'Phường ' + rint(1, 12),
                price, size,
                priceUnit: isRent ? 1 : 1,
                description: `Bán/cho thuê ${propertyType} diện tích ${size}m² tại ${district}, ${province}. ` +
                    `Nhà ${bedroom} phòng ngủ, ${bathroom} nhà tắm, ${floor} tầng, hướng ${rand(directions, i)}. ` +
                    `Vị trí giao thông thuận tiện, gần trường học, chợ, bệnh viện. Pháp lý sổ hồng chính chủ. Liên hệ ngay.`,
                floor, bathroom, bedroom,
                isFurniture: i % 2 === 0,
                listingType, propertyType,
                direction: rand(directions, i),
                balonDirection: rand(directions, i + 1),
                status: rand(statuses, i),
                approvalStatus,
                availabilityStatus: rand(availabilityStatuses, i),
                rejectReason: approvalStatus === 'rejected' ? 'Ảnh hoặc mô tả chưa đủ rõ, vui lòng cập nhật lại.' : null,
                legalStatus: rand(legalStatuses, i),
                verified: i % 4 === 0,
                isFeatured: i % 5 === 0,
                isBoosted: i % 4 === 0,
                coverImage: images[0],
                latitude: 10.75 + (i / 100),
                longitude: 106.66 + (i / 100),
                expiredDate: new Date(Date.now() + 30 * 86400000),
                images: JSON.stringify(images),
                views: rint(10, 1500),
                idUser: owner.id,
            })
        }
        const posts = await db.Post.bulkCreate(postsData)
        for (const p of posts) {
            await p.update({ slug: `${slugify(p.title)}-${p.id}` })
        }

        // gán tags ngẫu nhiên
        console.log('⏳ Gán tags cho post...')
        for (let i = 0; i < posts.length; i++) {
            const pick = [tags[i % tags.length], tags[(i + 2) % tags.length], tags[(i + 4) % tags.length]]
            await posts[i].setTags(pick)
        }

        console.log('⏳ Tạo ratings + comments + wishlist...')
        for (let i = 0; i < posts.length; i++) {
            if (i % 2 === 0) {
                await db.Rating.create({
                    idPost: posts[i].id, idUser: [demo, agent, admin][i % 3].id,
                    star: rint(3, 5), content: 'Tin đáng tin cậy, vị trí đẹp.',
                })
            }
            if (i % 3 === 0) {
                const c1 = await db.Comment.create({ idPost: posts[i].id, idUser: demo.id, content: 'Cho mình xin giá cụ thể nhé.' })
                await db.Comment.create({ idPost: posts[i].id, idUser: agent.id, content: 'Bạn inbox sđt mình gọi lại nha.', idParent: c1.id })
            }
            if (i % 4 === 0) {
                await db.Wishlist.create({ idPost: posts[i].id, idUser: demo.id })
            }
            if (i % 3 === 1) {
                await db.Lead.create({
                    idPost: posts[i].id,
                    idUser: demo.id,
                    fullname: 'Nguyễn Văn Khách',
                    phone: '0912345678',
                    email: 'khach@example.com',
                    message: 'Tôi muốn xem nhà cuối tuần này.',
                    status: ['new', 'contacted', 'qualified'][i % 3],
                })
            }
            if (i % 6 === 2) {
                await db.Report.create({
                    idPost: posts[i].id,
                    idUser: demo.id,
                    reason: 'Thông tin liên hệ sai',
                    description: 'Người đăng không nghe máy.',
                    status: 'pending',
                })
            }
        }

        // tính lại avgScore
        for (const p of posts) {
            const rs = await db.Rating.findAll({ where: { idPost: p.id }, attributes: ['star'] })
            if (rs.length) {
                const avg = rs.reduce((s, r) => s + r.star, 0) / rs.length
                await p.update({ avgScore: Math.round(avg * 10) / 10 })
            }
        }

        console.log('\n✅ Seed xong!')
        console.log('  Admin:    admin@rest06.vn / 123456')
        console.log('  Member:   demo@rest06.vn / 123456')
        console.log('  Agent:    agent@rest06.vn / 123456')
        console.log(`  Posts: ${posts.length} | Tags: ${tags.length}`)
        process.exit(0)
    } catch (err) {
        console.error('❌ Seed lỗi:', err)
        process.exit(1)
    }
}

run()
