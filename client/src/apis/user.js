import axios, { endpoints } from "./axios";

export const apiGetMeUser = () => axios({ method: 'get', url: endpoints.user.me })
export const apiUpdateProfile = (data) => axios({ method: 'put', url: endpoints.user.update, data })
export const apiChangePassword = (data) => axios({ method: 'put', url: endpoints.user.password, data })
export const apiUploadAvatar = (formData) => axios({
    method: 'post', url: endpoints.user.avatar, data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
})