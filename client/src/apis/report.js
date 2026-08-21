import axios, { endpoints } from './axios'

export const apiCreateReport = (data) => axios({ method: 'post', url: endpoints.report.create, data })
