import React, { useEffect, useId, useState } from 'react';
import { FaStar } from "react-icons/fa";
import { AiFillDislike, AiFillLike, AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { DBProblem, Problem } from '@/utils/types/problem';
import { arrayRemove, arrayUnion, doc, getDoc, runTransaction, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '@/Firebase/firebase';
import RactangleSkeleton from '@/components/Skeletons/RactangleSkeleton';
import CircleSkeleton from '@/components/Skeletons/CircleSkeleton';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';

type ProblemDescriptionProps = {
    problem: Problem
    _solved: boolean
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem, _solved }) => {
    const { currentProblem, loading, problemDifficultyClass, setCurrentProblem } = useGetCurrentProblems(problem.id);
    const { liked, disliked, solved, starred, setData } = useGetUserDataOnProblem(problem.id)
    const [user] = useAuthState(auth)
    const [updatingLikes, setUpdatingLikes] = useState(false)

    const ReturningUserDataAndPROBLEMDATA = async (transaction: any) => {
        const userRef = doc(firestore, "users", user!.uid)
        const problemRef = doc(firestore, "problems", problem.id)
        const userDoc = await transaction.get(userRef)
        const problemDoc = await transaction.get(problemRef)
        return { userDoc, problemDoc, userRef, problemRef }
    }

    //! Liking a problem Function
    const handleLike = async () => {
        if (!user) {
            toast.error("You must be login to preform this action.")
            return
        }
        if (updatingLikes) return;
        setUpdatingLikes(true)
        //^ OUR CONDATIONS | <If a user alr liked, if alr disliked or neither>
        await runTransaction(firestore, async (transaction) => {
            // Getting user and problem refrence to update the likeCount and when the user is logged out and get back the like count of that remains the same as it was later.
            const { problemDoc, userDoc, userRef, problemRef } = await ReturningUserDataAndPROBLEMDATA(transaction)
            if (userDoc.exists() && problemDoc.exists()) {
                if (liked) {
                    // Remove the id from likedproblem
                    transaction.update(userRef, {
                        likedProblems: userDoc.data().likedProblems.filter((id: string) => id !== problem.id)
                    })
                    transaction.update(problemRef, {
                        likes: problemDoc.data().likes - 1
                    })
                    setCurrentProblem(prev => prev ? { ...prev, likes: prev?.likes - 1 } : null)
                    setData(prev => ({ ...prev, liked: false }))
                } else if (disliked) {
                    transaction.update(userRef, {
                        likedProblems: [...userDoc.data().likedProblems, problem.id],
                        dislikedProblems: userDoc.data().dislikedProblems.filter((id: string) => id !== problem.id)
                    })
                    transaction.update(problemRef, {
                        likes: problemDoc.data().likes + 1,
                        disliked: problemDoc.data().dislikes - 1
                    })
                    setCurrentProblem(prev => prev ? { ...prev, likes: prev.likes + 1, dislikes: prev?.dislikes - 1 } : null)
                    setData(prev => ({ ...prev, liked: true, disliked: false }))
                } else {
                    transaction.update(userRef, {
                        likedProblems: [...userDoc.data().likedProblems, problem.id]
                    })
                    transaction.update(problemRef, {
                        likes: problemDoc.data().likes + 1
                    })

                    setCurrentProblem((prev) => prev ? { ...prev, likes: prev?.likes + 1 } : null)
                    setData((prev) => ({ ...prev, liked: true }))
                }
            }
        })
        setUpdatingLikes(false)
    }
    //! Disliking a problem Function
    const handleDislike = async () => {
        if (!user) {
            toast.error("You must be logged in to perfrom this action.")
            return
        }
        if (updatingLikes) return
        setUpdatingLikes(true)
        await runTransaction(firestore, async (transaction) => {
            const { problemDoc, userDoc, userRef, problemRef } = await ReturningUserDataAndPROBLEMDATA(transaction)
            if (userDoc.exists() && problemDoc.exists()) {
                //^ OUR CONDATIONS | <User alr disliked , alr liked , not disliked or liked>
                if (disliked) {
                    transaction.update(userRef, {
                        dislikedProblems: userDoc.data().dislikedProblems.filter((id: string) => id !== problem.id),
                    })
                    transaction.update(problemRef, {
                        dislikes: problemDoc.data().dislikes - 1
                    })
                    setCurrentProblem((prev) => prev ? { ...prev, dislikes: prev.dislikes - 1 } : null)
                    setData((prev) => ({ ...prev, disliked: false }))
                } else if (liked) {
                    // If a user has alr like and he wants he dislike now.
                    transaction.update(userRef, {
                        dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
                        likedProblems: userDoc.data().likedProblems.filter((id: string) => id !== problem.id)
                    })
                    transaction.update(problemRef, {
                        dislikes: problemDoc.data().dislikes + 1,
                        likes: problemDoc.data().likes - 1
                    })
                    setCurrentProblem((prev) => prev ? { ...prev, dislikes: prev.dislikes + 1, likes: prev.likes - 1 } : null)
                    setData((prev) => ({ ...prev, disliked: true, liked: false }))
                } else {
                    // If a user is a newUser and he wants dosnt like this PROBLEM and he wants to dislike.
                    transaction.update(userRef, {
                        dislikedProblems: [userDoc.data().dislikedProblems, problem.id]
                    })
                    transaction.update(problemRef, {
                        dislikes: problemDoc.data().dislike + 1
                    })
                    setCurrentProblem((prev) => prev ? { ...prev, dislikes: prev.dislikes + 1 } : null)
                    setData((prev) => ({ ...prev, disliked: true }))
                }
            }
        })
        setUpdatingLikes(false)
    }
    // !
    const handleStar = async () => {
        if (!user) {
            toast.error("You must be logged in to perfrom this action.")
            return
        }
        if (updatingLikes) return
        setUpdatingLikes(true)
        if (!starred) {
            const userRef = doc(firestore, "users", user.uid)
            await updateDoc(userRef, {
                starredProblems: arrayUnion(problem.id)
            })
            setData((prev) => ({ ...prev, starred: true }))
        } else {
            const userRef = doc(firestore, "users", user.uid)
            await updateDoc(userRef, {
                starretProblems: arrayRemove(problem.id)
            })
            setData((prev) => ({ ...prev, starred: false }))
        }
        setUpdatingLikes(false)
    }
    return <div className='bg-dark-layer-1'>
        {/* TAB */}
        <div className='flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden'>
            <div className={"bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"}>
                Description
            </div>
        </div>

        <div className='flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto'>
            <div className='px-5'>
                {/* Problem heading */}
                <div className='w-full'>
                    <div className='flex space-x-4'>
                        <div className='flex-1 mr-2 text-lg text-white font-medium'>{problem.title}</div>
                    </div>
                    {!loading && currentProblem && (
                        <div className='flex items-center mt-3'>
                            <div
                                className={`${problemDifficultyClass} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
                            >
                                {currentProblem.difficulty}
                            </div>
                            {(solved || _solved ) && (
                                <div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s'>
                                    <IoMdCheckmarkCircleOutline />
                                </div>
                            )}
                            <div
                                className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6'
                                onClick={handleLike}
                            >
                                {liked && !updatingLikes && <AiFillLike className='text-dark-blue-s' />}
                                {!liked && !updatingLikes && <AiFillLike />}
                                {updatingLikes && <AiOutlineLoading3Quarters className='animate-spin' />}

                                <span className='text-xs'>{currentProblem.likes}</span>
                            </div>
                            <div className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6' onClick={handleDislike}>

                                {disliked && !updatingLikes && <AiFillDislike className='text-dark-blue-s' />}
                                {!disliked && !updatingLikes && <AiFillDislike />}
                                {updatingLikes && <AiOutlineLoading3Quarters className='animate-spin' />}
                                <span className='text-xs'>{currentProblem.dislikes}</span>
                            </div>
                            <div className='cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 ' onClick={handleStar}>
                                {starred && !updatingLikes && (
                                    <FaStar className='text-dark-yellow' />
                                )}
                                {!starred && !updatingLikes && (<FaStar className='' />)}
                                {updatingLikes && <AiOutlineLoading3Quarters className='animate-spin' />}
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className='mt-3 flex space-x-3'>
                            <RactangleSkeleton />
                            <CircleSkeleton />
                            <RactangleSkeleton />
                            <RactangleSkeleton />
                            <CircleSkeleton />
                        </div>
                    )}

                    {/* Problem Statement(paragraphs) */}
                    <div className='text-white text-sm'>
                        <div
                            dangerouslySetInnerHTML={
                                { __html: problem.problemStatement }
                            }
                        />
                    </div>

                    {/* Examples */}
                    <div className='mt-4'>
                        {
                            problem.examples.map((example, index) => (
                                <div key={example.id}>
                                    <p className='font-medium text-white '>Example {index + 1}: </p>
                                    {example?.img && (
                                        <img src={example.img} alt="" className='mt-3' />
                                    )}
                                    <div className='example-card'>
                                        <pre>
                                            <strong className='text-white'>Input: </strong> {example.inputText}
                                            <br />
                                            <strong>Output:</strong> {example.outputText} <br />
                                            {
                                                example.explanation && (
                                                    <>
                                                        <strong>Explanation:</strong> {example.explanation}
                                                    </>
                                                )
                                            }
                                        </pre>
                                    </div>
                                </div>
                            ))
                        }


                    </div>

                    {/* Constraints */}
                    <div className='my-5 pb-5'>
                        <div className='text-white text-sm font-medium'>Constraints:</div>
                        <ul className='text-white ml-5 list-disc my-4'>
                            <div dangerouslySetInnerHTML={
                                { __html: problem.constraints }
                            } />
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div >
}
export default ProblemDescription;



function useGetCurrentProblems(problemId: string) {
    const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [problemDifficultyClass, setProblemDifficultyClass] = useState<string>("")
    useEffect(() => {
        // Get the problems data from FireStore Data
        const getCureentProblem = async () => {
            setLoading(true);
            const docRef = doc(firestore, 'problems', problemId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const problem = docSnap.data()
                setCurrentProblem({ id: docSnap.id, ...problem } as DBProblem)
                // easy, medium , hard
                setProblemDifficultyClass(
                    problem.difficulty === "Easy" ? "bg-olive text-olive" : problem.difficulty === "Medium" ? "bg-dark-yellow text-dark-yellow" : "bg-dark-pink text-dark-pink"
                )
            }
            setLoading(false)
        }
        getCureentProblem()
    }, [problemId])

    return { currentProblem, loading, problemDifficultyClass, setCurrentProblem }
}


function useGetUserDataOnProblem(problemId: string) {
    const [data, setData] = useState({ liked: false, disliked: false, starred: false, solved: false })
    const [user] = useAuthState(auth)
    useEffect(() => {

        const getUserDataOnProblem = async () => {
            const userRef = doc(firestore, "users", user!.uid)
            const userSnap = await getDoc(userRef)
            if (userSnap.exists()) {
                const data = userSnap.data();
                const { solvedProblems, likedProblems, dislikedProblems, starredProblems } = data;
                setData({
                    liked: likedProblems.includes(problemId),
                    disliked: dislikedProblems.includes(problemId),
                    solved: solvedProblems.includes(problemId),
                    starred: starredProblems.includes(problemId)
                })
            }
        }

        if (user) getUserDataOnProblem()
        return () => setData({ liked: false, disliked: false, solved: false, starred: false })
    }, [problemId, user])

    return { ...data, setData }
}