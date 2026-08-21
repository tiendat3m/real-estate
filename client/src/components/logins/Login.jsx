import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from '@/components/ui/form'
import { FormInput } from '@/components/form'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import { apiRegister, apiLogin, apiLoginWithGoogle } from "@/apis/auth"
import { apiGetCredentialFromAccessToken } from "@/apis/external"
import useMeStore from "@/zustand/useMeStore"
import { toast } from '@/lib/utils'

const signinSchema = z.object({
    emailOrPhone: z.string().min(1, { message: 'Trường này bắt buộc' }),
    password: z.string().min(6, { message: 'Mật khẩu tối thiểu là 6 kí tự' }),
})
const signupSchema = z.object({
    email: z.string().email({ message: 'Email không hợp lệ' }),
    password: z.string().min(6, { message: 'Mật khẩu tối thiểu là 6 kí tự' }),
    fullname: z.string().min(1, { message: 'Trường này bắt buộc' }),
    phone: z.string().optional(),
})

const Login = ({ onClose }) => {
    const [variant, setVariant] = useState('SIGNIN')
    const [loading, setLoading] = useState(false)
    const setAuth = useMeStore((s) => s.setAuth)
    const fetchMe = useMeStore((s) => s.fetchMe)

    const isSignup = variant === 'SIGNUP'
    const form = useForm({
        resolver: zodResolver(isSignup ? signupSchema : signinSchema),
        defaultValues: { emailOrPhone: '', email: '', password: '', fullname: '', phone: '' },
    })

    const toggleVariant = () => setVariant((v) => (v === 'SIGNIN' ? 'SIGNUP' : 'SIGNIN'))

    const onSubmit = async (values) => {
        setLoading(true)
        try {
            if (isSignup) {
                const { data } = await apiRegister(values)
                if (data?.success) {
                    setAuth({ accessToken: data.accessToken, user: data.user })
                    toast('Đăng ký thành công!')
                    onClose?.()
                }
            } else {
                const { data } = await apiLogin(values)
                if (data?.success) {
                    setAuth({ accessToken: data.accessToken, user: data.user })
                    toast('Đăng nhập thành công!')
                    onClose?.()
                }
            }
        } catch (err) {
            toast(err?.response?.data?.msg || 'Có lỗi xảy ra', true)
        } finally {
            setLoading(false)
        }
    }

    const handleSignInByGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await apiGetCredentialFromAccessToken(tokenResponse?.access_token)
                if (response.status === 200) {
                    const { email, name, picture } = response.data
                    const { data } = await apiLoginWithGoogle({ email, fullname: name, avatar: picture })
                    if (data?.success) {
                        setAuth({ accessToken: data.accessToken })
                        await fetchMe()
                        toast('Đăng nhập Google thành công!')
                        onClose?.()
                    }
                }
            } catch {
                toast('Đăng nhập Google thất bại', true)
            }
        },
        onError: () => toast('Đăng nhập Google thất bại', true),
    })

    return (
        <div className='grid max-h-[90vh] overflow-hidden md:grid-cols-10'>
            <div className='hidden place-items-center bg-main/5 md:col-span-4 md:grid'>
                <img src='/jpg/banner-login.jpg' alt="Login" className='w-full h-full object-cover' />
            </div>
            <div className='overflow-y-auto p-5 sm:p-8 md:col-span-6'>
                <p className='font-bold text-base'>Xin chào bạn</p>
                <p className='font-bold text-2xl'>{isSignup ? 'Đăng ký để tiếp tục' : 'Đăng nhập để tiếp tục'}</p>

                <Form {...form}>
                    <form className='my-6 space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                        {isSignup ? (
                            <>
                                <FormInput form={form} name={'fullname'} label={'Tên đầy đủ'} placeholder='VD: Nguyễn Văn A' />
                                <FormInput form={form} name={'email'} label={'Email'} placeholder='user@example.com' />
                                <FormInput form={form} name={'phone'} label={'Số điện thoại (tuỳ chọn)'} placeholder='0123456789' />
                                <FormInput form={form} name={'password'} label={'Mật khẩu'} type='password' placeholder='Mật khẩu tối thiểu 6 kí tự' />
                            </>
                        ) : (
                            <>
                                <FormInput form={form} name={'emailOrPhone'} label={'Email hoặc số điện thoại'} placeholder='user@example.com hoặc 0123456789' />
                                <FormInput form={form} name={'password'} label={'Mật khẩu'} type='password' placeholder='Mật khẩu tối thiểu 6 kí tự' />
                            </>
                        )}
                        <Button type='submit' className='w-full relative top-2' disabled={loading}>
                            {loading ? 'Đang xử lý...' : (isSignup ? 'Đăng kí' : 'Đăng nhập')}
                        </Button>
                    </form>
                </Form>

                <div className='w-full h-6 flex items-center relative my-4'>
                    <div className='w-full h-[1px] bg-slate-200'></div>
                    <div className='absolute inset-0 bg-transparent'><p className='px-2 mx-auto w-fit text-sm text-main bg-white'>Hoặc</p></div>
                </div>

                <Button variant='outline' className='w-full mb-4' onClick={handleSignInByGoogle} disabled={loading}>
                    <img src="/svg/google.svg" alt="Google" className='w-5 h-5 object-cover' />
                    <span>Đăng nhập bằng Google</span>
                </Button>

                <p className='text-center text-sm'>
                    {isSignup ? <span>Đã có tài khoản? </span> : <span>Bạn chưa là thành viên? </span>}
                    <span onClick={toggleVariant} className='text-red-600 font-bold cursor-pointer hover:underline'>
                        {isSignup ? 'Đăng nhập' : 'Đăng kí'}
                    </span>
                    <span> tại đây</span>
                </p>

                <div className='mt-4 p-3 bg-slate-50 rounded text-xs text-slate-600'>
                    <p className='font-semibold mb-1'>Tài khoản demo:</p>
                    <p>Member: demo@rest06.vn / 123456</p>
                    <p>Admin: admin@rest06.vn / 123456</p>
                </div>
            </div>
        </div>
    )
}

export default Login
