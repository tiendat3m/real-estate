import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from '@/components/ui/form'
import { FormInput } from '@/components/form'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { apiGetNewUser } from "@/apis/auth"
import { apiGetCredentialFromAccessToken } from "@/apis/external"

const formSchema = z.object({
    emailOrPhone: z.string().min(1, { message: 'Trường này bắt buộc' }),
    password: z.string().min(6, { message: 'Mật khẩu tối thiểu là 6 kí tự' }),
    fullname: z.string().min(1, { message: 'Trường này bắt buộc' }),
})

const Login = () => {
    const [variant, setVariant] = useState('SIGNIN')
    const toggleVariant = () => {
        if (variant === 'SIGNIN') setVariant('SIGNUP')
        else setVariant('SIGNIN')
    }
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            emailOrPhone: '',
            password: '',
            fullname: ''
        }
    })

    const handleSignInByGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const response = await apiGetCredentialFromAccessToken(tokenResponse?.access_token)
            console.log(response)
            if (response.status === 200) {
                const user = await apiGetNewUser(response.data.email)
                console.log(user)
            }
        },
        onError: err => console.log(err)
    })

    return (
        <div className='grid grid-cols-10 '>
            <div className='col-span-4 grid place-items-center'>
                <img src='/jpg/banner-login.jpg' alt="Login" className='w-full object-contain' />
            </div>
            <div className='col-span-6 p-8'>
                <p className='font-bold text-base'>Xin chào bạn</p>
                <p className='font-bold text-2xl'>{variant === 'SIGNIN' ? 'Đăng nhập để tiếp tục' : 'Đăng ký để tiếp tục'}</p>

                <Form {...form}>
                    <form className='my-6 space-y-4' action="">
                        <FormInput form={form} name={'emailOrPhone'} label={'Email hoặc số điện thoại'} placeholder='VD: 012345679 hoặc user@example.com' />
                        <FormInput form={form} name={'password'} label={'Mật khẩu'} type='password' placeholder='Mật khẩu tối thiểu 6 kí tự' />
                        {variant === 'SIGNUP' && <FormInput form={form} name={'fullname'} label={'Tên đầy đủ'} placeholder='VD: Nguyễn Văn A' />}
                        {variant === 'SIGNIN' ? <Button className='w-full relative top-2'>Đăng nhập</Button> : <Button className='w-full relative top-2'>Đăng kí</Button>}
                    </form>
                </Form>
                <div className='w-full h-6 flex items-center relative my-4'>
                    <div className='w-full h-[1px] bg-slate-200'></div>
                    <div className='absolute inset-0 bg-transparent '><p className='px-2 mx-auto w-fit text-sm text-primary bg-white'>Hoặc</p></div>
                </div>

                <Button variant='outline' className='w-full mb-4'>
                    <img src="svg/google.svg" alt="Google" className='w-5 h-5 object-cover' />
                    <span onClick={handleSignInByGoogle}>Đăng nhập bằng google</span>
                </Button>

                <p className='text-center text-sm'>
                    {variant === 'SIGNIN' ? <span>Bạn chưa là thành viên? </span> : <span>Bạn đã có tài khoản? </span>}
                    <span onClick={toggleVariant} className='text-red-600 font-bold cursor-pointer hover:underline'>{variant === 'SIGNIN' ? 'Đăng kí' : 'Đăng nhập'}</span>
                    <span> tại đây</span>
                </p>
            </div>
        </div>
    )
}

export default Login
