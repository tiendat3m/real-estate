import axios, { endpoints } from "./axios";

export const apiGetMyWishlist = () => axios({ method: 'get', url: endpoints.wishlist.mine })
export const apiCheckWishlist = (idPost) => axios({ method: 'get', url: endpoints.wishlist.check + idPost })
export const apiToggleWishlist = (idPost) => axios({ method: 'post', url: endpoints.wishlist.toggle, data: { idPost } })