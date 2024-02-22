import { problems } from '@/mockProblems/Problems';
import { CiCircleCheck } from "react-icons/ci";
import { FaYoutube } from "react-icons/fa";
import React, { useState } from 'react';
import Link from 'next/link';
import { IoMdClose } from 'react-icons/io';
import YouTube from 'react-youtube';
import { doc } from 'firebase/firestore';

type ProblemsTableProps = {

};

const ProblemsTable: React.FC<ProblemsTableProps> = () => {
    const [youtubePlayer, setyoutubePlayer] = useState({
        isOpen: false,
        videoId: ''
    })


    return (
        <>
            <>
                <tbody className='text-white'>
                    {problems.map((doc, idx) => {
                        const difColor = doc.difficulty === "Easy" ? "text-dark-green-s" : doc.difficulty === "Medium" ? "text-dark-yellow" : "text-dark-pink"

                        return (
                            <>
                                <tr className={`${idx % 2 === 1 ? 'bg-dark-layer-1' : ''}`} key={doc.id}>
                                    <th className='px-2 py-4 font-medium whitespace-nowrap text-dark-green-s '>
                                        <CiCircleCheck size={25} />
                                    </th>
                                    <td className='px-6 py-4'>
                                        <Link href={`/problems/${doc.id}`} className='hover:text-blue-600 cursor-pointer'>
                                            {doc.title}
                                        </Link>
                                    </td>
                                    <td className={`px-6 py-4 ${difColor}`}>
                                        {doc.difficulty}
                                    </td>
                                    <td className='px-6 py-4 '>
                                        {doc.category}
                                    </td>
                                    <td className='px-6 py-4 '>
                                        {doc.videoId ? (
                                            <FaYoutube onClick={() => setyoutubePlayer({ isOpen: true, videoId: doc.videoId as string })} size={28} className='cursor-pointer hover:text-red-600' />
                                        ) : (
                                            <p className='text-gray-400'>Coming soon</p>
                                        )}
                                    </td>
                                </tr>
                            </>
                        )
                    })}
                </tbody>

                {youtubePlayer.isOpen && (
                    <tfoot className='fixed top-0 left-0 h-screen w-screen flex items-center justify-center ' >
                        <div className='bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute'></div>
                        <div className='w-full z-50 h-full px-6 relative max-w-4xl'>
                            <div className='w-full h-full flex items-center justify-center relative'>
                                <div className='w-full relative'>
                                    <IoMdClose onClick={() => setyoutubePlayer({ isOpen: false  , videoId: ''})} fontSize={"35"} className='cursor-pointer absolute -top-16 right-0' />
                                    <YouTube videoId={youtubePlayer.videoId} loading='lazy' 
                                    iframeClassName='w-full min-h-[500px]' />
                                </div>
                            </div>
                        </div>
                    </tfoot>
                )}
            </>
        </>
    )

}
export default ProblemsTable;