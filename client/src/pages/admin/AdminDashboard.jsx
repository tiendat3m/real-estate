import { useEffect, useState } from 'react'
import { AlertTriangle, Heart, Home, Inbox, UsersRound } from 'lucide-react'
import { apiAdminStats } from '@/apis/admin'
import { approvalStatuses, availabilityStatuses, labelOf } from '@/lib/constants'

const emptyStats = { users: 0, posts: 0, wishlists: 0, leads: 0, reports: 0, byStatus: {}, byApproval: {}, byAvailability: {} }

const Card = ({ icon: Icon, label, value }) => (
    <div className="rounded-lg border bg-white p-5">
        <div className="mb-4 grid h-10 w-10 place-items-center rounded-md bg-main/10 text-main">
            <Icon className="h-5 w-5" />
        </div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
    </div>
)

const Breakdown = ({ title, items, labels }) => (
    <div className="rounded-lg border bg-white p-5">
        <h2 className="mb-4 font-bold text-primary">{title}</h2>
        <div className="grid gap-3 md:grid-cols-3">
            {Object.entries(items || {}).map(([status, count]) => (
                <div key={status} className="rounded-md bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">{labels ? labelOf(labels, status) : status}</p>
                    <p className="mt-1 text-xl font-bold text-primary">{count}</p>
                </div>
            ))}
        </div>
    </div>
)

const AdminDashboard = () => {
    const [stats, setStats] = useState(emptyStats)

    useEffect(() => {
        let mounted = true
        const fetchStats = async () => {
            try {
                const { data } = await apiAdminStats()
                if (mounted) setStats(data?.data || emptyStats)
            } catch {
                if (mounted) setStats(emptyStats)
            }
        }
        fetchStats()
        return () => { mounted = false }
    }, [])

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-slate-500">Theo dõi duyệt tin, khách hàng liên hệ và báo cáo vi phạm.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <Card icon={UsersRound} label="Người dùng" value={stats.users} />
                <Card icon={Home} label="Tin đăng" value={stats.posts} />
                <Card icon={Inbox} label="Leads" value={stats.leads} />
                <Card icon={AlertTriangle} label="Báo cáo chờ xử lý" value={stats.reports} />
                <Card icon={Heart} label="Yêu thích" value={stats.wishlists} />
            </div>

            <div className="mt-6 grid gap-6">
                <Breakdown title="Duyệt tin" items={stats.byApproval} labels={approvalStatuses} />
                <Breakdown title="Tình trạng giao dịch" items={stats.byAvailability} labels={availabilityStatuses} />
                <Breakdown title="Trạng thái hiển thị cũ" items={stats.byStatus} />
            </div>
        </div>
    )
}

export default AdminDashboard
