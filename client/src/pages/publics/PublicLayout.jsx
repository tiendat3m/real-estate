import { PublicHeader } from '@/components/header'
import { PublicFooter } from '@/components/footer'
import { Outlet } from 'react-router-dom'

const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-secondary">
            <PublicHeader />
            <Outlet />
            <PublicFooter />
        </div>
    )
}

export default PublicLayout
