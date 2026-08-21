import { NavLink, Outlet } from 'react-router-dom'
import { ArrowLeft, Heart, Home, LayoutDashboard, PlusCircle, UserRound, UsersRound } from 'lucide-react'
import { pathnames } from '@/lib/pathname'
import { cn } from '@/lib/utils'
import useMeStore from '@/zustand/useMeStore'

const memberBase = pathnames.users.layout
const items = [
    { label: 'Dashboard', to: memberBase, icon: LayoutDashboard, end: true },
    { label: 'Đăng tin', to: `${memberBase}${pathnames.users.newPost}`, icon: PlusCircle },
    { label: 'Tin của tôi', to: `${memberBase}${pathnames.users.myPosts}`, icon: Home },
    { label: 'Khách hàng', to: `${memberBase}${pathnames.users.leads}`, icon: UsersRound },
    { label: 'Yêu thích', to: `${memberBase}${pathnames.users.wishlist}`, icon: Heart },
    { label: 'Hồ sơ', to: `${memberBase}${pathnames.users.personal}`, icon: UserRound },
]

const MemberLayout = () => {
    const { me } = useMeStore()

    return (
        <div className="min-h-screen bg-secondary">
            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                <aside className="h-fit overflow-hidden rounded-lg border bg-white lg:sticky lg:top-6">
                    <div className="border-b p-4">
                        <NavLink to="/" className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-main hover:underline">
                            <ArrowLeft className="h-3.5 w-3.5" /> Về trang chủ
                        </NavLink>
                        <p className="text-xs text-slate-500">Khu vực thành viên</p>
                        <p className="truncate font-bold text-primary">{me?.fullname || me?.email || 'REST06'}</p>
                    </div>
                    <nav className="grid gap-1 p-2 sm:grid-cols-2 lg:grid-cols-1">
                        {items.map((item) => {
                            const Icon = item.icon
                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) => cn(
                                        'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition',
                                        isActive ? 'bg-main text-white' : 'text-slate-600 hover:bg-slate-100'
                                    )}
                                >
                                    <Icon className="h-4 w-4" /> {item.label}
                                </NavLink>
                            )
                        })}
                    </nav>
                </aside>

                <main className="min-w-0">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MemberLayout
