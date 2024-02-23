import { auth } from '@/Firebase/firebase';
import Link from 'next/link';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User } from "@nextui-org/react";
import Logout from '../Buttons/Logout';
import { useSetRecoilState } from 'recoil';
import { authModleState } from '@/atoms/authModleAtom';
import Image from 'next/image';
import { CiCircleList } from "react-icons/ci";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Timer from '../Timer/Timer';

type TopbarProps = {
    problemPage?: boolean
};

const Topbar: React.FC<TopbarProps> = ({ problemPage }) => {
    const [user] = useAuthState(auth)
    const setAuthModleState = useSetRecoilState(authModleState)


    return (
        <>
            <nav className='relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7'>
                <div className={`flex w-full items-center justify-between ${!problemPage ? 'max-w-[1200px] mx-auto' : ""}`}>
                    <Link href='/' className='h-[22px] flex-1'>
                        <Image src='/logo-full.png' alt='Logo' className='h-full' width={100} height={100} />
                    </Link>

                    {problemPage && (
                        <div className='flex items-center gap-4 flex-1 justify-center'>
                            <div className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer'>
                                <FaChevronLeft />
                            </div>
                            <Link href={'/'} className='flex items-center gap-2 font-medium max-w-[170px] text-dark-gray-8 cursor-pointer' >
                                <div>
                                    <CiCircleList />
                                </div>
                                <p>
                                    Problem List
                                </p>
                            </Link>
                            <div className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer'>
                                <FaChevronRight />
                            </div>
                        </div>
                    )}

                    <div className='flex items-center space-x-4 flex-1 justify-end'>
                        {!user && (
                            <Link href='/auth' onClick={() => {
                                setAuthModleState((oldVal) => ({ ...oldVal, isOpen: true, type: "login" }))
                            }}>
                                <button className='bg-dark-fill-3 py-1 px-2 cursor-pointer rounded '>Sign In</button>
                            </Link>
                        )}
                        {problemPage && (
                            <Timer />
                        )}
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
                        {user && <Logout />}
                    </div>
                </div>
            </nav>
        </>
    )
}
export default Topbar;