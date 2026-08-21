import axios from "axios";
import { endpoints } from "./axios";

export const apiGetCredentialFromAccessToken = (accessToken) => axios({
    method: 'get',
    url: endpoints.external.getCredentialFromAccessToken + accessToken,
})