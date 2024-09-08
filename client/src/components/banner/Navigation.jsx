import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Button } from '..'
import { navigation } from '~/utils/constants'
import clsx from 'clsx'

const Navigation = () => {
    return (
        <div className=' items-center bg-transparent fixed z-50 top-[85px] w-full px-[100px] py-[26px] flex justify-between'>
            <Link to={'/'}>
                <img src="/logo.png" alt="" className='w-[100px] object-contain' />
            </Link>
            <div className='flex items-center text-main-100 gap-6'>
                {navigation?.map(item => (
                    <NavLink key={item.id} to={item.path} className={({ isActive }) => clsx(isActive && 'text-white font-semibold')}>
                        {item.text}
                    </NavLink>
                ))}
                <Button className={'bg-transparent border border-main-100'}>
                    Add Listing
                </Button>
            </div>
        </div>
    )
}

export default Navigation
