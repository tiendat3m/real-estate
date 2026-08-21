import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, FilePlus, Heart, LayoutDashboard, LogOut, Shield, User } from 'lucide-react'
import { pathnames } from '@/lib/pathname'
import { cn } from '@/lib/utils'
import useMeStore from '@/zustand/useMeStore'

const menuItems = [
    { label: 'Trang thành viên', to: pathnames.users.layout, icon: LayoutDashboard },
    { label: 'Đăng tin', to: `${pathnames.users.layout}${pathnames.users.newPost}`, icon: FilePlus },
    { label: 'Yêu thích', to: `${pathnames.users.layout}${pathnames.users.wishlist}`, icon: Heart },
    { label: 'Hồ sơ', to: `${pathnames.users.layout}${pathnames.users.personal}`, icon: User },
]

const UserMenu = ({ compact = false }) => {
    const { me, logout } = useMeStore()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handler = (event) => {
            if (ref.current && !ref.current.contains(event.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    if (!me) return null

    const initial = (me.fullname || me.email || 'R').slice(0, 1).toUpperCase()
    const displayName = me.fullname || me.email || 'Thành viên'

    const handleLogout = () => {
        logout()
        setOpen(false)
        navigate('/')
    }

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className={cn(
                    'flex h-10 items-center gap-2 rounded-md border bg-white px-2.5 text-sm font-semibold text-primary transition hover:bg-slate-50',
                    compact && 'w-10 justify-center px-0'
                )}
                aria-expanded={open}
                aria-haspopup="menu"
            >
                {me.avatar ? (
                    <img src={me.avatar} alt={displayName} className="h-7 w-7 rounded-full object-cover" />
                ) : (
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-main text-xs font-bold text-white">{initial}</span>
                )}
                {!compact && <span className="hidden max-w-[130px] truncate lg:inline">{displayName}</span>}
                {!compact && <ChevronDown className={cn('h-4 w-4 transition', open && 'rotate-180')} />}
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-lg border bg-white py-2 shadow-xl" role="menu">
                    <div className="border-b px-3 pb-2">
                        <p className="truncate text-sm font-bold text-primary">{displayName}</p>
                        <p className="truncate text-xs text-slate-500">{me.email || me.phone || 'REST06'}</p>
                    </div>

                    <div className="py-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-main"
                                >
                                    <Icon className="h-4 w-4" /> {item.label}
                                </Link>
                            )
                        })}
                        {me.role === 'admin' && (
                            <Link
                                to={pathnames.admin.layout}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-main hover:bg-main/10"
                            >
                                <Shield className="h-4 w-4" /> Quản trị
                            </Link>
                        )}
                    </div>

                    <div className="border-t pt-1">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                            <LogOut className="h-4 w-4" /> Đăng xuất
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserMenu
