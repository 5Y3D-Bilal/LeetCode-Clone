import { auth } from '@/Firebase/firebase';
import Link from 'next/link';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User } from "@nextui-org/react";
import Logout from '../Buttons/Logout';

type TopbarProps = {

};

const Topbar: React.FC<TopbarProps> = () => {
    const [user] = useAuthState(auth)

    return (
        <>
            <nav className='relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7'>
                <div className={`flex w-full items-center justify-between max-w-[1200px] mx-auto`}>
                    <Link href='/' className='h-[22px] flex-1'>
                        <img src='/logo-full.png' alt='Logo' className='h-full' />
                    </Link>

                    <div className='flex items-center space-x-4 flex-1 justify-end'>
                        {!user && (<Link href='/auth'>
                            <button className='bg-dark-fill-3 py-1 px-2 cursor-pointer rounded '>Sign In</button>
                        </Link>)}
                        {user && (
                            <div className='cursor-pointer group relative'>
                                <Dropdown placement="bottom-end">
                                    <DropdownTrigger className=''>
                                        <img
                                            className="transition-transform w-8 h-8"
                                            src="/avatar.png"
                                        />
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                                        <DropdownItem key="profile" className="h-14 gap-2">
                                            <p className="font-semibold">{user.email}</p>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        )}
                        <Logout />
                    </div>
                </div>
            </nav>
        </>
    )
}
export default Topbar;