
import axios, { endpoints } from "./axios";
export const apiGetNewUser = (email) => axios({
    method: 'get',
    url: endpoints.auth.checkNewUser + email
})


