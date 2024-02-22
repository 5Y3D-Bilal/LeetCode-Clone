import { authModleState } from '@/atoms/authModleAtom';
import Link from 'next/link';
import React from 'react';
import { useSetRecoilState } from 'recoil';

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {

    
    // Making a open modle function for the signin BTN
    const setAuthModleState = useSetRecoilState(authModleState)
    const handleFunction = () => {
        setAuthModleState((oldval) => ({ ...oldval, isOpen: true }))
    }

    return <div className='flex items-center justify-between sm:12px px-2 md:px-24 '>
        <Link href={'/'} className='flex items 
        justify-center h-20'>
            <img src="/logo.png" alt="LeetClone" className='h-full ' />
        </Link>
        <div className='flex items-center'>
            <button className='bg-brand-orange text-white px-2 py-1 sm:px-4 rounded-md text-sm font-medium hover:text-brand-orange  hover:bg-white hover:border-2 hover:border-brand-orange border-2 duration-500 border-transparent transition ease-in-out' onClick={handleFunction}>Sign in</button>
        </div>
    </div>
}
export default Navbar;