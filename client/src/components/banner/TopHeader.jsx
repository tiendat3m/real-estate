import React from 'react'
import icons from '~/utils/icons'

const { HiOutlineMailOpen, FiPhone, FaFacebookF, FaInstagram, FaYoutube, FaBehance, FaLinkedinIn } = icons

const TopHeader = () => {
    return (
        <div className='text-white h-[85px] bg-transparent fixed z-50 top-0 w-full px-[100px] py-[26px] flex justify-between border-b border-main-100'>
            <span className='flex items-center'>
                <span className='mr-3 text-xl'><HiOutlineMailOpen /></span>
                <span>
                    Email us at :
                    <span className='text-gray-300'> example@mail.com</span>
                </span>
            </span>
            <div className='flex items-center'>
                <div className='flex items-center gap-6 text-gray-300 text-xl mr-[32px]'>
                    <FaFacebookF />
                    <FaYoutube />
                    <FaLinkedinIn />
                    <FaInstagram />
                    <FaBehance />
                </div>
                <div className='flex items-center pl-6 border-l border-main-200'>
                    <span className='flex items-center gap-2'>
                        <FiPhone />
                        <span className='text-gray-300'>123-456-7890</span>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default TopHeader
