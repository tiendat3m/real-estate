import navigations from '@/lib/navigation'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, } from '@/components/ui/navigation-menu'
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

const PublicHeader = () => {
    return (
        <div className='h-24 p-4 flex items-center'>
            <div>
                <Link to={'/'} className='text-5xl tracking-widest text-shadow text-blue-500 font-bold'>
                    REST06
                </Link>
            </div>
            <NavigationMenu>
                <NavigationMenuList>
                    {navigations.map(el => <Fragment key={el.id}>
                        {el.hasSub && <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                {el.name}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                {el.subs.map(sub => <NavigationMenuLink key={sub.pathname}>
                                    {sub.name}
                                </NavigationMenuLink>)}
                            </NavigationMenuContent>
                        </NavigationMenuItem>}
                    </Fragment>)}
                </NavigationMenuList>
            </NavigationMenu>

        </div>
    )
}

export default PublicHeader 
