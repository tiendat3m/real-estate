import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useMeStore from '@/zustand/useMeStore'

// Bắt buộc đăng nhập
const ProtectedRoute = () => {
    const { token } = useMeStore()
    const location = useLocation()
    if (!token) return <Navigate to="/" state={{ from: location }} replace />
    return <Outlet />
}

export default ProtectedRoute