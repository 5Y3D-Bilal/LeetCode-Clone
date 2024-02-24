import { auth, firestore } from '@/Firebase/firebase';
import { authModleState } from '@/atoms/authModleAtom';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2'
import Loading from '../Loading/Loading';
import { toast } from 'react-toastify';
import { doc, setDoc } from 'firebase/firestore';


type SignupProps = {

};

const Signup: React.FC<SignupProps> = () => {
    const router = useRouter()


    const setAuthModleState = useSetRecoilState(authModleState)
    const ChangeSetAuthModleType = (type: "login" | "register" | "forgotPassword") => {
        setAuthModleState((oldType) => ({ ...oldType, type }))
    }

    // So We are take the input values on the bases of input names and then adding the value of that input to  the state.
    const [input, setInput] = useState({ email: '', displayName: '', password: '' }) //State
    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })) //Passing Value to State
    }

    // Conecting User Details with firebase
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);
    // Form Handle Submit Function to push the  data into Firebase and redirect the user to home page
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.email || !input.password || !input.displayName) {
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
            toast.success('Creating your  account...', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                toastId: "loadingToast"
            })
            const newuser = await createUserWithEmailAndPassword(input.email, input.password);
            if (!newuser) return
            const userData = {
                uid: newuser.user.uid,
                email: newuser.user.email,
                displayName: input.displayName,
                createdAt: Date.now(),
                updateAt: Date.now(),
                likedProblems: [],
                dislikedProblems: [],
                solvedProblems: [],
                starredProblems: []
            }
            await setDoc(doc(firestore, 'users', newuser.user.uid), userData)
            router.push('/')
        } catch (error: any) {
            alert(error.message)
        } finally {
            toast.dismiss("loadingToast")
        }
    }

    useEffect(() => {
        if (error) toast.error(error.message, {
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
            <form className='space-y-6 px-6 pb-4 ' onSubmit={handleRegister}>
                {/* Heading */}
                <h3 className='text-xl font-medium text-white'>Register to LeetCode</h3>
                {/* Email */}
                <div>
                    <label htmlFor="email" className='text-sm font-medium block mb-2 text-gray-300'>Your Email</label>
                    <input onChange={handleChangeInput} type="email" name='email' id='email' className='border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder:text-gray-400 text-white' placeholder='example@gmail.com' />
                </div>
                {/* Display Name */}
                <div>
                    <label htmlFor="displayName" className='text-sm font-medium block mb-2 text-gray-300'>Your Name</label>
                    <input onChange={handleChangeInput} type="displayName" name='displayName' id='displayName' className='border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder:text-gray-400 text-white' placeholder='hakey' />
                </div>
                {/* For Password */}
                <div>
                    <label htmlFor="password" className='text-sm font-medium block mb-2 text-gray-300'>Your Password</label>
                    <input onChange={handleChangeInput} type="password" name='password' id='password' className='border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder:text-gray-400 text-white' placeholder='***********' />
                </div>
                <button className='w-full text-white focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s flex justify-center items-center' type='submit'>
                    {loading ? (<div className='py-2.5'>
                        <Loading />
                    </div>
                    ) : 'Register'}
                </button>
                <div className='text-sm font-medium text-gray-300 ' onClick={() => ChangeSetAuthModleType('login')}>
                    Already have an account? {" "}
                    <a href="#" className='
            text-blue-700 hover:underline'>Log In</a>
                </div>
            </form>
        </>
    )
}
export default Signup;