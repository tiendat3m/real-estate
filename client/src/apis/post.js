import axios, { endpoints } from "./axios";

export const apiGetPosts = (params) => axios({ method: 'get', url: endpoints.post.list, params })
export const apiGetFeatured = (params) => axios({ method: 'get', url: endpoints.post.featured, params })
export const apiGetPostDetail = (id) => axios({ method: 'get', url: endpoints.post.detail + id })
export const apiGetRelatedPosts = (id, params) => axios({ method: 'get', url: endpoints.post.related(id), params })
export const apiGetMyPosts = () => axios({ method: 'get', url: endpoints.post.mine })
export const apiCreatePost = (data) => axios({ method: 'post', url: endpoints.post.create, data })
export const apiUpdatePost = (id, data) => axios({ method: 'put', url: endpoints.post.update + id, data })
export const apiDeletePost = (id) => axios({ method: 'delete', url: endpoints.post.delete + id })
export const apiUploadImages = (formData) => axios({
    method: 'post', url: endpoints.post.upload, data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
})
