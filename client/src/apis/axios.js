import axios from "axios";

const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_SERVER_URL })

axiosInstance.interceptors.request.use((config) => {
    const store = window.localStorage.getItem('rest06v2/me')
    if (store) {
        try {
            const parsedStore = JSON.parse(store)
            if (parsedStore && parsedStore.state?.token) {
                config.headers.Authorization = `Bearer ${parsedStore.state?.token}`
            }
        } catch { /* ignore */ }
    }
    return config
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // token hết hạn → xoá auth
        if (error?.response?.status === 401) {
            window.localStorage.removeItem('rest06v2/me')
        }
        return Promise.reject(error)
    }
)

export default axiosInstance

export const endpoints = {
    auth: {
        register: '/auth/register',
        login: '/auth/login',
        google: '/auth/test',
        checkNewUser: '/auth/has-user/',
        me: '/auth/me',
    },
    post: {
        list: '/post',
        featured: '/post/featured',
        detail: '/post/',         // + id
        related: (id) => `/post/${id}/related`,
        mine: '/post/me',
        create: '/post',
        update: '/post/',         // + id
        delete: '/post/',         // + id
        upload: '/post/upload',
    },
    rating: {
        byPost: '/rating/post/',  // + idPost
        create: '/rating',
        remove: '/rating/',       // + id
    },
    comment: {
        byPost: '/comment/post/', // + idPost
        create: '/comment',
        remove: '/comment/',      // + id
    },
    wishlist: {
        mine: '/wishlist',
        check: '/wishlist/check/', // + idPost
        toggle: '/wishlist/toggle',
    },
    lead: {
        create: '/lead',
        mine: '/lead/mine',
        update: '/lead/',
    },
    report: {
        create: '/report',
    },
    user: {
        me: '/me',
        update: '/me',
        password: '/me/password',
        avatar: '/me/avatar',
    },
    admin: {
        stats: '/admin/stats',
        posts: '/admin/posts',
        postStatus: '/admin/posts/', // + id + '/status'
        deletePost: '/admin/posts/', // + id
        users: '/admin/users',
        userRole: '/admin/users/',   // + id + '/role'
        leads: '/admin/leads',
        adminLead: '/admin/leads/',
        reports: '/admin/reports',
        adminReport: '/admin/reports/',
    },
    external: {
        getCredentialFromAccessToken: "https://www.googleapis.com/oauth2/v1/userinfo?access_token=",
    },
}
