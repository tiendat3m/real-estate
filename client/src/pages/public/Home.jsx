import React from 'react'

const Home = () => {
    return (
        <div className='bg-white w-full'>
            <div className='w-full h-fit relative'>
                <img src="/banner.png" alt="" />
                <div className='absolute inset-0 flex items-center justify-center pt-12'>
                    <div className='flex flex-col items-center gap-6 text-white'>
                        <h3 className='text-5xl font-semibold'>Find Your Dream Home</h3>
                        <p className='text-lg text-main-50 text-center'>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
                            <p>cubilia curae;Proin sodales ultrices nulla blandit volutpat.</p></p>

                    </div>
                </div>
            </div>
            <div className='w-main mx-auto'>
                content
            </div>
        </div>
    )
}

export default Home
