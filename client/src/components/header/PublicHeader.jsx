import { Fragment, useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Building2, ChevronDown, LogIn, Menu, Newspaper, PlusCircle, Search, X } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Login } from '@/components/logins'
import navigations from '@/lib/navigation'
import { pathnames } from '@/lib/pathname'
import { cn } from '@/lib/utils'
import useMeStore from '@/zustand/useMeStore'
import UserMenu from './UserMenu'

const navIcons = [Building2, Search, Newspaper]

const linkCn = ({ isActive }) => cn(
    'inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-sm font-semibold transition',
    isActive ? 'bg-main/10 text-main' : 'text-slate-700 hover:bg-slate-100 hover:text-main'
)

const DesktopNavItem = ({ item, index }) => {
    const Icon = navIcons[index] || Building2

    if (!item.hasSub) {
        return (
            <NavLink to={item.pathname} className={linkCn}>
                <Icon className="h-4 w-4" /> {item.name}
            </NavLink>
        )
    }

    return (
        <div className="relative group">
            <NavLink to={item.pathname} className={linkCn}>
                <Icon className="h-4 w-4" /> {item.name}
                <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180" />
            </NavLink>
            <div className="invisible absolute left-0 top-full z-50 mt-2 w-[520px] translate-y-1 rounded-lg border bg-white p-3 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="grid grid-cols-2 gap-1">
                    {item.subs.map((sub) => (
                        <Link
                            key={sub.name}
                            to={`${item.pathname}?propertyType=${encodeURIComponent(sub.name)}`}
                            className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-main/10 hover:text-main"
                        >
                            {sub.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

const MobileNavItem = ({ item }) => (
    <div className="border-b border-slate-100 py-2">
        <Link to={item.pathname} className="block rounded-md px-3 py-2 font-bold text-primary hover:bg-slate-100">
            {item.name}
        </Link>
        {item.hasSub && (
            <div className="grid grid-cols-2 gap-1 px-2 pb-2">
                {item.subs.slice(0, 8).map((sub) => (
                    <Link
                        key={sub.name}
                        to={`${item.pathname}?propertyType=${encodeURIComponent(sub.name)}`}
                        className="rounded-md px-2 py-1.5 text-sm text-slate-600 hover:bg-main/10 hover:text-main"
                    >
                        {sub.name}
                    </Link>
                ))}
            </div>
        )}
    </div>
)

const PublicHeader = () => {
    const { token } = useMeStore()
    const [loginOpen, setLoginOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        setMobileOpen(false)
    }, [location.pathname, location.search])

    return (
        <Fragment>
            <header className="sticky top-0 z-40 border-b bg-white/95 shadow-sm backdrop-blur">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
                    <div className="flex min-w-0 items-center gap-6">
                        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="REST06 home">
                            <span className="grid h-9 w-9 place-items-center rounded-md bg-main text-lg font-black text-white">R</span>
                            <span className="text-2xl font-black tracking-wider text-main">REST06</span>
                        </Link>

                        <nav className="hidden items-center gap-1 lg:flex">
                            {navigations.map((item, index) => (
                                <DesktopNavItem key={item.id} item={item} index={index} />
                            ))}
                        </nav>
                    </div>

                    <div className="hidden items-center gap-3 md:flex">
                        {token ? (
                            <Fragment>
                                <Button asChild size="sm">
                                    <Link to={`${pathnames.users.layout}${pathnames.users.newPost}`}>
                                        <PlusCircle className="h-4 w-4" /> Đăng tin
                                    </Link>
                                </Button>
                                <UserMenu />
                            </Fragment>
                        ) : (
                            <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                        <LogIn className="h-4 w-4" /> Đăng nhập
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="w-[calc(100vw-2rem)] max-w-[920px] overflow-hidden p-0" isHideClose={false}>
                                    <Login onClose={() => setLoginOpen(false)} />
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    <button
                        type="button"
                        className="grid h-10 w-10 place-items-center rounded-md border text-primary md:hidden"
                        onClick={() => setMobileOpen((open) => !open)}
                        aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </header>

            {mobileOpen && (
                <div className="fixed inset-x-0 top-16 z-30 max-h-[calc(100vh-4rem)] overflow-y-auto border-b bg-white shadow-lg md:hidden">
                    <div className="px-4 py-3">
                        {navigations.map((item) => (
                            <MobileNavItem key={item.id} item={item} />
                        ))}
                        <div className="pt-3">
                            {token ? (
                                <div className="flex items-center justify-between gap-3">
                                    <Button asChild className="flex-1">
                                        <Link to={`${pathnames.users.layout}${pathnames.users.newPost}`}>
                                            <PlusCircle className="h-4 w-4" /> Đăng tin
                                        </Link>
                                    </Button>
                                    <UserMenu />
                                </div>
                            ) : (
                                <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full">
                                            <LogIn className="h-4 w-4" /> Đăng nhập / Đăng ký
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="w-[calc(100vw-2rem)] max-w-[920px] overflow-hidden p-0" isHideClose={false}>
                                        <Login onClose={() => setLoginOpen(false)} />
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    )
}

export default PublicHeader
