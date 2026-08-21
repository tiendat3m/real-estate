import { useCallback, useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { apiAdminListLeads, apiAdminUpdateLead } from '@/apis/admin'
import EmptyState from '@/components/common/EmptyState'
import Spinner from '@/components/common/Spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate, leadStatuses } from '@/lib/constants'
import { toast } from '@/lib/utils'

const AdminLeads = () => {
    const [leads, setLeads] = useState([])
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState('')
    const [q, setQ] = useState('')

    const fetchLeads = useCallback(async (params = {}) => {
        setLoading(true)
        try {
            const { data } = await apiAdminListLeads(params)
            setLeads(data?.data || [])
        } catch {
            setLeads([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchLeads()
    }, [fetchLeads])

    const filter = (event) => {
        event.preventDefault()
        fetchLeads({ status, q })
    }

    const update = async (lead, patch) => {
        try {
            await apiAdminUpdateLead(lead.id, patch)
            toast('Đã cập nhật lead')
            fetchLeads({ status, q })
        } catch (err) {
            toast(err?.response?.data?.msg || 'Không thể cập nhật lead', true)
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-primary">Quản lý leads</h1>
                <p className="mt-1 text-sm text-slate-500">Theo dõi toàn bộ khách hàng gửi yêu cầu liên hệ.</p>
            </div>

            <form onSubmit={filter} className="mb-4 grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-[1fr_220px_auto]">
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tên, email hoặc số điện thoại" />
                <select className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Tất cả trạng thái</option>
                    {leadStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                <Button type="submit"><Search className="h-4 w-4" /> Lọc</Button>
            </form>

            {loading ? <Spinner label="Đang tải leads..." /> : leads.length === 0 ? <EmptyState title="Không có lead" /> : (
                <div className="overflow-x-auto rounded-lg border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="p-3 text-left">Khách hàng</th>
                                <th className="p-3 text-left">Tin đăng</th>
                                <th className="p-3 text-left">Người đăng</th>
                                <th className="p-3 text-left">Trạng thái</th>
                                <th className="p-3 text-left">Ngày gửi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead) => (
                                <tr key={lead.id} className="border-t align-top">
                                    <td className="p-3">
                                        <p className="font-bold text-primary">{lead.fullname}</p>
                                        <p>{lead.phone}</p>
                                        <p className="text-xs text-slate-500">{lead.email || '-'}</p>
                                    </td>
                                    <td className="p-3 min-w-[260px]">
                                        <p className="font-semibold line-clamp-2">{lead.post?.title}</p>
                                        {lead.message && <p className="mt-1 max-w-xs text-xs text-slate-500">{lead.message}</p>}
                                    </td>
                                    <td className="p-3">{lead.post?.user?.fullname || '-'}</td>
                                    <td className="p-3">
                                        <select className="h-9 rounded border border-slate-300 px-2" value={lead.status} onChange={(e) => update(lead, { status: e.target.value })}>
                                            {leadStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-3 whitespace-nowrap">{formatDate(lead.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AdminLeads
