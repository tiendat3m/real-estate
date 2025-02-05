import axios from "axios";

const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_SERVER_URL })

axiosInstance.interceptors.request.use((config) => {
    const store = window.localStorage.getItem('rest06v2/me')
    if (store) {
        const parsedStore = JSON.parse(store)
        if (parsedStore && parsedStore.state?.token) {
            config.headers.Authorization = `Bearer ${parsedStore.state?.token}`
        }
    }
    return config
})

axiosInstance.interceptors.response.use((response) => response)

export default axiosInstance

export const endpoints = {
    auth: {
        getCredentialFromAccessToken: "https://www.googleapis.com/oauth2/v1/userinfo?access_token=",
        checkNewUser: '/auth/has-user/',
    },
}