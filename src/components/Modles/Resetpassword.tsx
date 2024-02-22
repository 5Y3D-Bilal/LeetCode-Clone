import { auth } from '@/Firebase/firebase';
import React, { useEffect, useState } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';

type ResetpasswordProps = {

};

const Resetpassword: React.FC<ResetpasswordProps> = () => {
    const [email, setEmail] = useState('');
    const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);

    // Form Sumbit Function for a password reset
    const handleSubmitFunction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const success = await sendPasswordResetEmail(email);
        if (success) {
            toast.success('Please Check your email.', {
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
    }
    // If we get any errors
    useEffect(() => {
        if (error) {
            toast.error(error.message, {
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
    }, [error])


    return (
        <>
            <form className='space-y-6 px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8' onSubmit={handleSubmitFunction}>
                <h3 className='text-xl font-medium  text-white'>Reset Password</h3>
                <p className='text-sm text-white '>
                    Forgotten your password? Enter your e-mail address below, and we&apos;ll send you an e-mail allowing you
                    to reset it.
                </p>
                <div>
                    <label htmlFor='email' className='text-sm font-medium block mb-2 text-gray-300'>
                        Your email
                    </label>
                    <input
                        // So From here we will get the email of the user and when the form will submit a email will be sent on that user email for a password reset
                        onChange={(e) => setEmail(e.target.value)}
                        type='email'
                        name='email'
                        id='email'
                        className='border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white'
                        placeholder='name@company.com'
                    />
                </div>

                <button
                    type='submit'
                    className={`w-full text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                bg-brand-orange hover:bg-brand-orange-s `}
                >
                    Reset Password
                </button>
            </form>
        </>
    )
}
export default Resetpassword;