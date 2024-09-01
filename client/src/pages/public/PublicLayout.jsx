import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navigation, TopHeader } from '~/components'

const PublicLayout = () => {
    return (
        <main>
            <TopHeader />
            <Navigation />
            <div>
                <Outlet />
            </div>
        </main>
    )
}

export default PublicLayout
