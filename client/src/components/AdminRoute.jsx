import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Spinner from './common/Spinner'
import useMeStore from '@/zustand/useMeStore'

const AdminRoute = () => {
    const { token, me } = useMeStore()
    const location = useLocation()

    if (!token) return <Navigate to="/" state={{ from: location }} replace />
    if (!me) return <Spinner label="Đang kiểm tra quyền truy cập..." />
    if (me.role !== 'admin') return <Navigate to="/" replace />

    return <Outlet />
}

export default AdminRoute
