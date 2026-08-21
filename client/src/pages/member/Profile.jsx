import { useEffect, useState } from 'react'
import { Camera, KeyRound, Save } from 'lucide-react'
import { apiChangePassword, apiUpdateProfile, apiUploadAvatar } from '@/apis/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/lib/utils'
import useMeStore from '@/zustand/useMeStore'

const Profile = () => {
    const { me, setMe } = useMeStore()
    const [profile, setProfile] = useState({ fullname: '', phone: '', avatar: '' })
    const [password, setPassword] = useState({ oldPassword: '', newPassword: '' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        setProfile({
            fullname: me?.fullname || '',
            phone: me?.phone || '',
            avatar: me?.avatar || '',
        })
    }, [me])

    const uploadAvatar = async (event) => {
        const file = event.target.files?.[0]
        if (!file) return
        const formData = new FormData()
        formData.append('avatar', file)
        try {
            const { data } = await apiUploadAvatar(formData)
            setProfile((current) => ({ ...current, avatar: data?.url || '' }))
            toast('Đã tải avatar lên')
        } catch (err) {
            toast(err?.response?.data?.msg || 'Không thể tải avatar', true)
        } finally {
            event.target.value = ''
        }
    }

    const saveProfile = async (event) => {
        event.preventDefault()
        setSaving(true)
        try {
            const { data } = await apiUpdateProfile(profile)
            setMe(data?.data || me)
            toast('Đã cập nhật hồ sơ')
        } catch (err) {
            toast(err?.response?.data?.msg || 'Không thể cập nhật hồ sơ', true)
        } finally {
            setSaving(false)
        }
    }

    const changePassword = async (event) => {
        event.preventDefault()
        try {
            await apiChangePassword(password)
            setPassword({ oldPassword: '', newPassword: '' })
            toast('Đã đổi mật khẩu')
        } catch (err) {
            toast(err?.response?.data?.msg || 'Không thể đổi mật khẩu', true)
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-primary">Hồ sơ cá nhân</h1>
                <p className="text-sm text-slate-500 mt-1">Cập nhật thông tin hiển thị và mật khẩu tài khoản.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <form onSubmit={saveProfile} className="bg-white border rounded-lg p-5 space-y-4">
                    <h2 className="font-bold text-primary">Thông tin cá nhân</h2>
                    <div className="flex items-center gap-4">
                        {profile.avatar ? (
                            <img src={profile.avatar} alt={profile.fullname} className="w-20 h-20 rounded-full object-cover" />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-main text-white grid place-items-center text-2xl font-bold">
                                {profile.fullname?.[0] || 'R'}
                            </div>
                        )}
                        <label className="inline-flex items-center gap-2 h-10 px-4 rounded-md border border-main text-main font-bold cursor-pointer hover:bg-slate-100">
                            <Camera className="w-4 h-4" /> Đổi ảnh
                            <input type="file" className="hidden" accept="image/*" onChange={uploadAvatar} />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Họ tên</label>
                        <Input value={profile.fullname} onChange={(e) => setProfile((current) => ({ ...current, fullname: e.target.value }))} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                        <Input value={profile.phone} onChange={(e) => setProfile((current) => ({ ...current, phone: e.target.value }))} />
                    </div>
                    <Button type="submit" disabled={saving}>
                        <Save className="w-4 h-4" /> {saving ? 'Đang lưu...' : 'Lưu hồ sơ'}
                    </Button>
                </form>

                <form onSubmit={changePassword} className="bg-white border rounded-lg p-5 space-y-4 h-fit">
                    <h2 className="font-bold text-primary">Đổi mật khẩu</h2>
                    <div>
                        <label className="block text-sm font-medium mb-1">Mật khẩu cũ</label>
                        <Input type="password" value={password.oldPassword} onChange={(e) => setPassword((current) => ({ ...current, oldPassword: e.target.value }))} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
                        <Input type="password" value={password.newPassword} onChange={(e) => setPassword((current) => ({ ...current, newPassword: e.target.value }))} />
                    </div>
                    <Button type="submit" variant="outline">
                        <KeyRound className="w-4 h-4" /> Đổi mật khẩu
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default Profile
