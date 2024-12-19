import { PublicHeader } from '@/components/header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const PublicLayout = () => {
    return (
        <div className=''>
            <PublicHeader />
            <Outlet />
        </div>
    )
}

export default PublicLayout
