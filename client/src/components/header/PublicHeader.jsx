import navigations from '@/lib/navigation'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, } from '@/components/ui/navigation-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { navItemCn } from '@/lib/classnames'
import { Button } from '../ui/button'
import { Login } from '../logins'

const PublicHeader = () => {
    return (
        <div className='h-24 p-4 flex items-center shadow justify-between'>
            <div className='space-x-[26px] flex items-center gap-6'>
                <Link to={'/'} className='text-5xl tracking-widest text-shadow text-main font-bold'>
                    REST06
                </Link>
                <NavigationMenu>
                    <NavigationMenuList>
                        {navigations.map(el =>
                            <Fragment key={el.id}>
                                {el.hasSub && <NavigationMenuItem>
                                    <NavigationMenuTrigger className='text-sm font-bold'>
                                        {el.name}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent className='p-4 grid grid-cols-2 min-w-96 '>
                                        {el.subs.map(sub => <NavigationMenuLink className={cn(navItemCn)} key={sub.pathname}>
                                            {sub.name}
                                        </NavigationMenuLink>)}
                                    </NavigationMenuContent>
                                </NavigationMenuItem>}
                                {!el.hasSub && <NavigationMenuItem>
                                    <NavigationMenuLink className={cn('text-sm font-bold px-4 py-[6px]')}>
                                        {el.name}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>}
                            </Fragment>)}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
            <div className='flex items-center gap-6'>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className='bg-transparent text-stone-900 hover:bg-transparent hover:underline'>Đăng nhập / Đăng kí</Button>
                    </DialogTrigger>
                    <DialogContent className='min-w-[700px] p-0' isHideClose={true}>
                        <DialogHeader>
                            <DialogTitle></DialogTitle>
                            <Login />
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

                <Button variant='outline' size='sm'>Đăng tin</Button>
            </div>
        </div>
    )
}

export default PublicHeader 
