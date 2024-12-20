import { create } from 'zustand'

const useMeStore = create((set, get) => ({
    token: null,
    me: null,
    setToken: (token) => set(() => ({ token })),
    setMe: (me) => set(() => ({ me })),
    // getMe: 
}))


export default useMeStore