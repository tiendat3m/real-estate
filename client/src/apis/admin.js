import axios, { endpoints } from "./axios";

export const apiAdminStats = () => axios({ method: 'get', url: endpoints.admin.stats })
export const apiAdminListPosts = (params) => axios({ method: 'get', url: endpoints.admin.posts, params })
export const apiAdminUpdatePostStatus = (id, status) => axios({ method: 'put', url: endpoints.admin.postStatus + id + '/status', data: { status } })
export const apiAdminUpdatePostModeration = (id, data) => axios({ method: 'put', url: endpoints.admin.postStatus + id + '/status', data })
export const apiAdminDeletePost = (id) => axios({ method: 'delete', url: endpoints.admin.deletePost + id })
export const apiAdminListUsers = () => axios({ method: 'get', url: endpoints.admin.users })
export const apiAdminSetUserRole = (id, role) => axios({ method: 'put', url: endpoints.admin.userRole + id + '/role', data: { role } })
export const apiAdminUpdateUser = (id, data) => axios({ method: 'put', url: endpoints.admin.userRole + id + '/role', data })
export const apiAdminListLeads = (params) => axios({ method: 'get', url: endpoints.admin.leads, params })
export const apiAdminUpdateLead = (id, data) => axios({ method: 'put', url: endpoints.admin.adminLead + id, data })
export const apiAdminListReports = (params) => axios({ method: 'get', url: endpoints.admin.reports, params })
export const apiAdminUpdateReport = (id, data) => axios({ method: 'put', url: endpoints.admin.adminReport + id, data })
