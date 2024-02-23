import { auth } from '@/Firebase/firebase';
import { authModleState } from '@/atoms/authModleAtom';
import AuthModle from '@/components/Modles/AuthModle';
import Navbar from '@/components/Navbar/Navbar';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';

type AuthPageProps = {

};

const Auth: React.FC<AuthPageProps> = () => {
    const authModle = useRecoilValue(authModleState)
    const [user, loading, error] = useAuthState(auth)
    const [pageLoading, setPaheLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (user) router.push('/')
        if (!loading && !user) setPaheLoading(false)
    }, [user, router, loading])

    if (pageLoading) return null

    return <div className='bg-gradient-to-b from-gray-600 to-black h-screen relative'>
        <div className='max-w-7xl mx-auto'>
            <Navbar />
            <div className='flex items-center justify-center h-[calc(100vh-5rem)] pointer-events-none select-none'>
                <Image width={700} height={700} src="/hero.png" alt="Hero Image" />
            </div>
            {authModle.isOpen && <AuthModle />}
        </div>
    </div>
}
export default Auth;