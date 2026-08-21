import axios, { endpoints } from './axios'

export const apiCreateLead = (data) => axios({ method: 'post', url: endpoints.lead.create, data })
export const apiGetMyLeads = () => axios({ method: 'get', url: endpoints.lead.mine })
export const apiUpdateLead = (id, data) => axios({ method: 'put', url: endpoints.lead.update + id, data })
