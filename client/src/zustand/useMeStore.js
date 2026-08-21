import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiGetMe } from '@/apis/auth'

const useMeStore = create(
    persist(
        (set, get) => ({
            token: null,
            me: null,
            setAuth: ({ accessToken, user }) => set(() => ({ token: accessToken, me: user || null })),
            setToken: (token) => set(() => ({ token })),
            setMe: (me) => set(() => ({ me })),
            logout: () => set(() => ({ token: null, me: null })),
            // Lấy lại thông tin user từ server (cần token)
            fetchMe: async () => {
                const { token } = get()
                if (!token) return null
                try {
                    const { data } = await apiGetMe()
                    if (data?.success) set(() => ({ me: data.user }))
                    return data?.user || null
                } catch {
                    set(() => ({ token: null, me: null }))
                    return null
                }
            },
        }),
        { name: 'rest06v2/me' }
    )
)

export default useMeStore