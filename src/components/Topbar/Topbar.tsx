import { auth, firestore } from '@/Firebase/firebase';
import Link from 'next/link';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import Logout from '../Buttons/Logout';
import { useSetRecoilState } from 'recoil';
import { authModleState } from '@/atoms/authModleAtom';
import Image from 'next/image';
import { CiCircleList } from "react-icons/ci";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { CiCircleQuestion } from "react-icons/ci";
import Timer from '../Timer/Timer';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Problem } from '@/utils/types/problem';
import { problems } from '@/utils/problems';

type TopbarProps = {
    problemPage?: boolean
};

const Topbar: React.FC<TopbarProps> = ({ problemPage }) => {
    const [user] = useAuthState(auth)
    const setAuthModleState = useSetRecoilState(authModleState)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [input, setInput] = useState({
        Id: '',
        title: '',
        difficulty: '',
        category: '',
        videoId: '',
        link: '',
        order: 0,
        likes: 0,
        dislikes: 0
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(({ ...input, [e.target.name]: e.target.value }))
    }

    const sendData_to_DB = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Convert input.order into integer
        const newProblem = {
            ...input,
            order: Number(input.order)
        }
        await setDoc(doc(firestore, "problems", input.Id), newProblem)
        toast.success("Saved")
    }

    const router = useRouter();
    const handleProblemChange = (isForward: boolean) => {
        const { order } = problems[router.query.pid as string] as Problem;
        const direction = isForward ? 1 : -1;
        const nextProblemOrder = order + direction // 1 + 1
        const nextProblemKey = Object.keys(problems).find(key => problems[key].order === nextProblemOrder)
        console.log(nextProblemKey)
        if (isForward && !nextProblemKey) {
            const firstproblemKey = Object.keys(problems).find(key => problems[key].order === 1)
            router.push(`/problems/${firstproblemKey}`)
        } else if (!isForward && !nextProblemKey) {
            const lastProblemKey = Object.keys(problems).find((key) => problems[key].order === Object.keys(problems).length)
            router.push(`/problems/${lastProblemKey}`)
        } else{
            router.push(`/problems/${nextProblemKey}`)
        }
    }

    return (
        <>
            <nav className='relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7'>
                <div className={`flex w-full items-center justify-between ${!problemPage ? 'max-w-[1200px] mx-auto' : ""}`}>
                    <Link href='/' className='h-[22px] flex-1'>
                        <Image src='/logo-full.png' alt='Logo' className='h-full' width={100} height={100} />
                    </Link>

                    {problemPage && (
                        <div className='flex items-center gap-4 flex-1 justify-center'>
                            <div className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer' onClick={() => handleProblemChange(false)}>
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
                            <div className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer' onClick={() => handleProblemChange(true)}>
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
                        {user && problemPage && (
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

                        {user?.email === "54587dfdd@gmail.com" && (
                            <div>
                                <button onClick={onOpen} className='flex justify-center items-center text-3xl text-white'><CiCircleQuestion /></button>
                                <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                                    <div className='flex flex-col'>
                                        <ModalContent >
                                            {(onClose) => (
                                                <>
                                                    <form action="" className='p-6 flex flex-col max-w-sm gap-3 bg-gray-400 rounded-lg ' onSubmit={sendData_to_DB}>
                                                        <input onChange={handleInputChange} type="text" placeholder='problem id' name='Id' />
                                                        <input onChange={handleInputChange} type="text" placeholder='title' name='title' />
                                                        <input onChange={handleInputChange} type="text" placeholder='difficulty' name='difficulty' />
                                                        <input onChange={handleInputChange} type="text" placeholder='category' name='category' />
                                                        <input onChange={handleInputChange} type="text" placeholder='order' name='order' />
                                                        <input onChange={handleInputChange} type="text" placeholder='videoId?' name='videoId' />
                                                        <input onChange={handleInputChange} type="text" placeholder='link?' name='link' />
                                                        <button>Send to FireStore</button>
                                                    </form>
                                                </>
                                            )}
                                        </ModalContent>

                                    </div>
                                </Modal>
                            </div>
                        )}

                    </div>
                </div>
            </nav>
        </>
    )
}
export default Topbar;