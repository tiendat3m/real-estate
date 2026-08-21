import { useEffect, useState } from 'react'
import { Heart, Home, Inbox, Star, UserRound } from 'lucide-react'
import { apiGetMyLeads } from '@/apis/lead'
import { apiGetMyPosts } from '@/apis/post'
import { apiGetMyWishlist } from '@/apis/wishlist'
import useMeStore from '@/zustand/useMeStore'

const StatCard = ({ icon: Icon, label, value }) => (
    <div className="rounded-lg border bg-white p-5">
        <div className="mb-4 grid h-10 w-10 place-items-center rounded-md bg-main/10 text-main">
            <Icon className="h-5 w-5" />
        </div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
    </div>
)

const MemberDashboard = () => {
    const { me } = useMeStore()
    const [stats, setStats] = useState({ posts: 0, wishlists: 0, leads: 0, pending: 0 })

    useEffect(() => {
        let mounted = true
        const fetchStats = async () => {
            const [postsRes, wishlistRes, leadsRes] = await Promise.allSettled([apiGetMyPosts(), apiGetMyWishlist(), apiGetMyLeads()])
            if (!mounted) return
            const posts = postsRes.status === 'fulfilled' ? postsRes.value.data?.data || [] : []
            setStats({
                posts: posts.length,
                pending: posts.filter((post) => post.approvalStatus === 'pending').length,
                wishlists: wishlistRes.status === 'fulfilled' ? wishlistRes.value.data?.data?.length || 0 : 0,
                leads: leadsRes.status === 'fulfilled' ? leadsRes.value.data?.data?.length || 0 : 0,
            })
        }
        fetchStats()
        return () => { mounted = false }
    }, [])

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
                <p className="mt-1 text-sm text-slate-500">Tổng quan tài khoản, tin đăng và khách hàng quan tâm.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <StatCard icon={UserRound} label="Tài khoản" value={me?.fullname || 'Thành viên'} />
                <StatCard icon={Home} label="Tin đã đăng" value={stats.posts} />
                <StatCard icon={Inbox} label="Chờ duyệt" value={stats.pending} />
                <StatCard icon={Inbox} label="Leads" value={stats.leads} />
                <StatCard icon={Heart} label="Tin yêu thích" value={stats.wishlists} />
                <StatCard icon={Star} label="Điểm tài khoản" value={me?.score || 0} />
            </div>
        </div>
    )
}

export default MemberDashboard
