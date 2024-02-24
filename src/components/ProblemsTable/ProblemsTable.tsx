import { CiCircleCheck } from "react-icons/ci";
import { FaYoutube } from "react-icons/fa";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoMdClose } from 'react-icons/io';
import YouTube from 'react-youtube';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firestore } from '@/Firebase/firebase';
import { DBProblem } from "@/utils/types/problem";

type ProblemsTableProps = {
    setLoadingPromblems: React.Dispatch<React.SetStateAction<boolean>>
};

const ProblemsTable: React.FC<ProblemsTableProps> = ({ setLoadingPromblems }) => {
    const [youtubePlayer, setyoutubePlayer] = useState({
        isOpen: false,
        videoId: ''
    })
    const problems = useGetProblems(setLoadingPromblems)

    const closeModle = () => {
        setyoutubePlayer({ isOpen: false, videoId: '' })
    }

    useEffect(() => {
        const handleESC = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModle()
        }
        window.addEventListener("keydown", handleESC)

        return () => window.removeEventListener("keydown", handleESC)
    }, [])


    return (
        <>
            <>
                <tbody className='text-white'>
                    {problems.map((problem, idx) => {
                        const difColor = problem.difficulty === "Easy" ? "text-dark-green-s" : problem.difficulty === "Medium" ? "text-dark-yellow" : "text-dark-pink"
                        return (
                                <tr className={`${idx % 2 === 1 ? 'bg-dark-layer-1' : ''}`} key={problem.id}>
                                    <th className='px-2 py-4 font-medium whitespace-nowrap text-dark-green-s '>
                                        <CiCircleCheck size={25} />
                                    </th>
                                    <td className='px-6 py-4'>
                                        {problem.link ? (
                                            <Link href={problem.link} className="hover:text-blue-600 cursor-pointer" target="_blank">
                                                {problem.title}
                                            </Link>
                                        ) : (
                                            <Link href={`/problems/${problem.id}`} className='hover:text-blue-600 cursor-pointer'>
                                                {problem.title}
                                            </Link>
                                        )}
                                    </td>
                                    <td className={`px-6 py-4 ${difColor}`}>
                                        {problem.difficulty}
                                    </td>
                                    <td className='px-6 py-4 '>
                                        {problem.category}
                                    </td>
                                    <td className='px-6 py-4 '>
                                        {problem.videoId ? (
                                            <FaYoutube onClick={() => setyoutubePlayer({ isOpen: true, videoId: problem.videoId as string })} size={28} className='cursor-pointer hover:text-red-600' />
                                        ) : (
                                            <p className='text-gray-400'>Coming soon</p>
                                        )}
                                    </td>
                                </tr>
                        )
                    })}
                </tbody>

                {youtubePlayer.isOpen && (
                    <tfoot className='fixed top-0 left-0 h-screen w-screen flex items-center justify-center ' >
                        <div className='bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute'></div>
                        <div className='w-full z-50 h-full px-6 relative max-w-4xl'>
                            <div className='w-full h-full flex items-center justify-center relative'>
                                <div className='w-full relative'>
                                    <IoMdClose onClick={closeModle} fontSize={"35"} className='cursor-pointer absolute -top-16 right-0' />
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

function useGetProblems(setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>) {
    const [problems, setProblems] = useState<DBProblem[]>([]);

    useEffect(() => {
        const getProblems = async () => {
            // Fetching data logic
            setLoadingProblems(true)
            const q = query(collection(firestore, "problems"), orderBy("order", "asc"))
            const querySnapshot = await getDocs(q)
            const temp: DBProblem[] = []
            querySnapshot.forEach((doc) => {
                temp.push({ id: doc.id, ...doc.data() } as DBProblem)
            })
            setProblems(temp)
            setLoadingProblems(false)
        }

        getProblems()
    }, [setLoadingProblems])
    return problems
}