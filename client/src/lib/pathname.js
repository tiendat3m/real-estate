export const pathnames = {
    publics: {
        layout: '/',
        homepage: '',
        news: '/tin-tuc',
        rentProperty: '/nha-dat-cho-thue',
        soldProperty: '/nha-dat-ban',
        postDetail: '/post/:idDetail',
        postDetailById: (id) => `/post/${id}`,
    },
    users: {
        layout: '/thanh-vien',
        dashboard: '',
        personal: '/ho-so',
        newPost: '/dang-tin',
        myPosts: '/tin-cua-toi',
        editPost: '/tin-cua-toi/:id/sua',
        wishlist: '/yeu-thich',
        leads: '/khach-hang',
    },
    admin: {
        layout: '/admin',
        dashboard: '',
        posts: '/tin',
        users: '/nguoi-dung',
        leads: '/leads',
        reports: '/bao-cao',
    },
}
