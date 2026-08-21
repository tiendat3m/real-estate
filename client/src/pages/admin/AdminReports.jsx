import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Search } from 'lucide-react'
import { apiAdminListReports, apiAdminUpdateReport } from '@/apis/admin'
import EmptyState from '@/components/common/EmptyState'
import Spinner from '@/components/common/Spinner'
import { Button } from '@/components/ui/button'
import { formatDate, reportStatuses } from '@/lib/constants'
import { pathnames } from '@/lib/pathname'
import { toast } from '@/lib/utils'

const AdminReports = () => {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState('')

    const fetchReports = useCallback(async (params = {}) => {
        setLoading(true)
        try {
            const { data } = await apiAdminListReports(params)
            setReports(data?.data || [])
        } catch {
            setReports([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchReports()
    }, [fetchReports])

    const update = async (report, nextStatus) => {
        try {
            await apiAdminUpdateReport(report.id, { status: nextStatus })
            toast('Đã cập nhật báo cáo')
            fetchReports({ status })
        } catch (err) {
            toast(err?.response?.data?.msg || 'Không thể cập nhật báo cáo', true)
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-primary">Báo cáo tin đăng</h1>
                <p className="mt-1 text-sm text-slate-500">Xử lý phản hồi từ người dùng về tin sai, trùng hoặc không còn giao dịch.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); fetchReports({ status }) }} className="mb-4 flex flex-col gap-3 rounded-lg border bg-white p-4 sm:flex-row sm:items-center">
                <select className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Tất cả trạng thái</option>
                    {reportStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                <Button type="submit"><Search className="h-4 w-4" /> Lọc</Button>
            </form>

            {loading ? <Spinner label="Đang tải báo cáo..." /> : reports.length === 0 ? <EmptyState title="Không có báo cáo" /> : (
                <div className="overflow-x-auto rounded-lg border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="p-3 text-left">Lý do</th>
                                <th className="p-3 text-left">Tin đăng</th>
                                <th className="p-3 text-left">Người báo cáo</th>
                                <th className="p-3 text-left">Trạng thái</th>
                                <th className="p-3 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report.id} className="border-t align-top">
                                    <td className="p-3">
                                        <p className="font-bold text-primary">{report.reason}</p>
                                        {report.description && <p className="mt-1 max-w-xs text-xs text-slate-500">{report.description}</p>}
                                        <p className="mt-1 text-xs text-slate-400">{formatDate(report.createdAt)}</p>
                                    </td>
                                    <td className="p-3 min-w-[260px]">
                                        <p className="font-semibold line-clamp-2">{report.post?.title}</p>
                                        <p className="text-xs text-slate-500">{report.post?.address}</p>
                                    </td>
                                    <td className="p-3">{report.user?.fullname || report.user?.email || 'Ẩn danh'}</td>
                                    <td className="p-3">
                                        <select className="h-9 rounded border border-slate-300 px-2" value={report.status} onChange={(e) => update(report, e.target.value)}>
                                            {reportStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-3 text-right">
                                        <Button asChild size="sm" variant="outline">
                                            <Link to={pathnames.publics.postDetailById(report.post?.id)}><Eye className="h-4 w-4" /> Xem</Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AdminReports
