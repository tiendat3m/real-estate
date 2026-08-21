import { useEffect, useState } from 'react'
import { apiAdminListUsers, apiAdminUpdateUser } from '@/apis/admin'
import EmptyState from '@/components/common/EmptyState'
import Spinner from '@/components/common/Spinner'
import { formatDate } from '@/lib/constants'
import { toast } from '@/lib/utils'

const AdminUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const { data } = await apiAdminListUsers()
            setUsers(data?.data || [])
        } catch {
            setUsers([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const update = async (user, patch) => {
        try {
            await apiAdminUpdateUser(user.id, patch)
            toast('Đã cập nhật người dùng')
            fetchUsers()
        } catch (err) {
            toast(err?.response?.data?.msg || 'Không thể cập nhật người dùng', true)
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-primary">Người dùng</h1>
                <p className="mt-1 text-sm text-slate-500">Quản lý vai trò, khóa tài khoản và xác thực môi giới.</p>
            </div>

            {loading ? <Spinner label="Đang tải người dùng..." /> : users.length === 0 ? <EmptyState title="Chưa có người dùng" /> : (
                <div className="overflow-x-auto rounded-lg border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="p-3 text-left">Người dùng</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">SĐT</th>
                                <th className="p-3 text-left">Role</th>
                                <th className="p-3 text-left">Tài khoản</th>
                                <th className="p-3 text-left">Môi giới</th>
                                <th className="p-3 text-left">Ngày tạo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-t">
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.fullname} className="h-9 w-9 rounded-full object-cover" />
                                            ) : (
                                                <div className="grid h-9 w-9 place-items-center rounded-full bg-main font-bold text-white">{user.fullname?.[0] || 'R'}</div>
                                            )}
                                            <div>
                                                <p className="font-bold text-primary">{user.fullname || '-'}</p>
                                                {user.companyName && <p className="text-xs text-slate-500">{user.companyName}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.phone || '-'}</td>
                                    <td className="p-3">
                                        <select className="h-9 rounded border border-slate-300 px-2" value={user.role || 'user'} onChange={(e) => update(user, { role: e.target.value })}>
                                            <option value="user">user</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    </td>
                                    <td className="p-3">
                                        <select className="h-9 rounded border border-slate-300 px-2" value={user.userStatus || 'active'} onChange={(e) => update(user, { userStatus: e.target.value })}>
                                            <option value="active">active</option>
                                            <option value="banned">banned</option>
                                        </select>
                                    </td>
                                    <td className="p-3">
                                        <label className="inline-flex items-center gap-2">
                                            <input type="checkbox" className="accent-main" checked={!!user.verifiedAgent} onChange={(e) => update(user, { verifiedAgent: e.target.checked })} />
                                            Xác thực
                                        </label>
                                    </td>
                                    <td className="p-3 whitespace-nowrap">{formatDate(user.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AdminUsers
