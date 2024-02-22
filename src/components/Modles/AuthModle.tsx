import React, { useEffect } from 'react';
import { IoIosCloseCircle } from "react-icons/io";
import Login from './Login';
import Signup from './Signup';
import Resetpassword from './Resetpassword';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authModleState } from '@/atoms/authModleAtom';

type AuthModleProps = {

};

const AuthModle: React.FC<AuthModleProps> = () => {
    // Using the authModleState so we can see the deafault  value and if we wanna switch it we can
    const authModle = useRecoilValue(authModleState)

    // Makeing a close modle function for the modle from modleAtom and also setting the TYPE to login
    const CloseModle = useCloseModle()

    return (
        <>
            <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60' onClick={CloseModle}></div>
            <div className='w-full sm:w-[450px]  absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  flex justify-center items-center'>
                <div className='relative w-full h-full mx-auto flex items-center justify-center'>
                    <div className='bg-white rounded-lg shadow relative w-full bg-gradient-to-b from-brand-orange to-slate-900 mx-6'>
                        <div className='flex justify-end p-2'>
                            {/* Close Btn */}
                            <button
                                type='button'
                                onClick={CloseModle}
                                className='bg-transparent  rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 hover:text-white text-white'
                            >
                                <IoIosCloseCircle className='h-5 w-5' />
                            </button>
                        </div>
                        {/* Only Default / setValues */}
                        {authModle.type === 'login' ? <Login /> : authModle.type === 'register' ? <Signup /> : <Resetpassword />}
                    </div>
                </div>
            </div>
        </>
    )

}
export default AuthModle;


function useCloseModle() {
    const setAuthModle = useSetRecoilState(authModleState)

    const closeModle = () => {
        setAuthModle((oldVal) => ({ ...oldVal, isOpen: false, type: 'login' }))
    }

    useEffect(() => {
        const hanldeESC = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeModle()
            }
            window.addEventListener("keydown", hanldeESC)
            return () => window.removeEventListener('keydown', hanldeESC)
        }
    }, [])
    return closeModle
}