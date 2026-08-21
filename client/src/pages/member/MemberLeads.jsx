import { useEffect, useState } from 'react'
import { apiGetMyLeads, apiUpdateLead } from '@/apis/lead'
import EmptyState from '@/components/common/EmptyState'
import Spinner from '@/components/common/Spinner'
import { formatDate, leadStatuses, labelOf } from '@/lib/constants'
import { toast } from '@/lib/utils'

const MemberLeads = () => {
    const [leads, setLeads] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchLeads = async () => {
        setLoading(true)
        try {
            const { data } = await apiGetMyLeads()
            setLeads(data?.data || [])
        } catch {
            setLeads([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLeads()
    }, [])

    const update = async (lead, patch) => {
        try {
            await apiUpdateLead(lead.id, patch)
            toast('Đã cập nhật lead')
            fetchLeads()
        } catch (err) {
            toast(err?.response?.data?.msg || 'Không thể cập nhật lead', true)
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-primary">Khách hàng quan tâm</h1>
                <p className="mt-1 text-sm text-slate-500">Lead được gửi từ form liên hệ trên trang chi tiết tin của bạn.</p>
            </div>

            {loading ? <Spinner label="Đang tải leads..." /> : leads.length === 0 ? <EmptyState title="Chưa có khách hàng liên hệ" /> : (
                <div className="overflow-x-auto rounded-lg border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="p-3 text-left">Khách hàng</th>
                                <th className="p-3 text-left">Tin quan tâm</th>
                                <th className="p-3 text-left">Trạng thái</th>
                                <th className="p-3 text-left">Ghi chú</th>
                                <th className="p-3 text-left">Ngày gửi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead) => (
                                <tr key={lead.id} className="border-t align-top">
                                    <td className="p-3">
                                        <p className="font-bold text-primary">{lead.fullname}</p>
                                        <p className="text-slate-600">{lead.phone}</p>
                                        {lead.email && <p className="text-xs text-slate-500">{lead.email}</p>}
                                        {lead.message && <p className="mt-1 max-w-xs text-xs text-slate-500">{lead.message}</p>}
                                    </td>
                                    <td className="p-3 min-w-[260px]">
                                        <p className="font-semibold text-primary line-clamp-2">{lead.post?.title}</p>
                                        <p className="text-xs text-slate-500">{lead.post?.address}</p>
                                    </td>
                                    <td className="p-3">
                                        <select className="h-9 rounded border border-slate-300 px-2" value={lead.status} onChange={(e) => update(lead, { status: e.target.value })}>
                                            {leadStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-3 min-w-[220px]">
                                        <textarea
                                            rows={2}
                                            defaultValue={lead.note || ''}
                                            onBlur={(e) => e.target.value !== (lead.note || '') && update(lead, { note: e.target.value })}
                                            placeholder={`Ghi chú ${labelOf(leadStatuses, lead.status).toLowerCase()}`}
                                            className="w-full rounded border border-slate-300 p-2 text-sm"
                                        />
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

export default MemberLeads
