import axios, { endpoints } from "./axios";

export const apiRegister = (data) => axios({ method: 'post', url: endpoints.auth.register, data })
export const apiLogin = (data) => axios({ method: 'post', url: endpoints.auth.login, data })
export const apiLoginWithGoogle = (data) => axios({ method: 'post', url: endpoints.auth.google, data })
export const apiGetNewUser = (email) => axios({ method: 'get', url: endpoints.auth.checkNewUser + email })
export const apiGetMe = () => axios({ method: 'get', url: endpoints.auth.me })