import axios, { endpoints } from "./axios";

export const apiGetRatingsByPost = (idPost) => axios({ method: 'get', url: endpoints.rating.byPost + idPost })
export const apiUpsertRating = (data) => axios({ method: 'post', url: endpoints.rating.create, data })