import axios, { endpoints } from "./axios";

export const apiGetCommentsByPost = (idPost) => axios({ method: 'get', url: endpoints.comment.byPost + idPost })
export const apiCreateComment = (data) => axios({ method: 'post', url: endpoints.comment.create, data })