import { auth } from '@/Firebase/firebase';
import { authModleState } from '@/atoms/authModleAtom';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';
import Loading from '../Loading/Loading';
import { toast } from 'react-toastify';

type LoginProps = {

};

const Login: React.FC<LoginProps> = () => {
    // Router For Redircting
    const router = useRouter()
    // for Switching  State of Auth Modal
    const setAuthModleState = useSetRecoilState(authModleState)
    const ChangeSetAuthModleType = (type: "login" | "register" | "forgotPassword") => {
        setAuthModleState((oldType) => ({ ...oldType, type }))
    }

    // Input State
    const [input, setInput] = useState({ email: "", password: "" })

    // So We are take the input values on the bases of input names and then adding the value of that input to  the state.
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput((oldVal) => ({ ...oldVal, [e.target.name]: e.target.value }))
    }
    // Using the React-Firebase-hooks for SigningIn
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);
    // Form HandleSubmit Function to push the logined user data into Firebase and redirect the user to home page
    const hanldeSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.email || !input.password) {
            return toast.error('Please Fillout all fields', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
        }
        try {
            const user = await signInWithEmailAndPassword(input.email, input.password)
            if (!user) return
            toast.success('Succesfully Logined', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
            router.push('/')
        } catch (error: any) {
            alert(error.message)
        }
    }

    useEffect(() => {
        if (error)  toast.error(error.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        })
    }, [error])


    return (
        <>
            <form className='space-y-6 px-6 pb-4 ' onSubmit={hanldeSumbit}>
                {/* Heading */}
                <h3 className='text-xl font-medium text-white'>Sign in to LeetCode</h3>
                {/* Email */}
                <div>
                    <label htmlFor="email" className='text-sm font-medium block mb-2 text-gray-300'>Your Email</label>
                    <input onChange={handleOnChange} type="email" name='email' id='email' className='border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder:text-gray-400 text-white' placeholder='example@gmail.com' />
                </div>
                {/* For Password */}
                <div>
                    <label htmlFor="password" className='text-sm font-medium block mb-2 text-gray-300'>Your Password</label>
                    <input onChange={handleOnChange} type="password" name='password' id='password' className='border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder:text-gray-400 text-white' placeholder='***********' />
                </div>
                <button className='w-full text-white focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s flex justify-center items-center' type='submit'>
                    {loading ? (<div className='py-2.5'>
                        <Loading />
                    </div>
                    ) : 'Login'}
                </button>
                <button className='flex w-full justify-end' onClick={() => ChangeSetAuthModleType('forgotPassword')}>
                    <a href="#" className='text-sm block text-brand-orange hover:underline w-full text-right'>
                        Forget Password?
                    </a>
                </button>
                <div className='text-sm font-medium text-gray-300 ' onClick={() => ChangeSetAuthModleType('register')}>
                    Not Registered? {" "}
                    <a href="#" className='
            text-blue-700 hover:underline'>Create Account</a>
                </div>
            </form>
        </>
    )

}
export default Login;