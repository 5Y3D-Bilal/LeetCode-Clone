import React, { useEffect, useState } from 'react';
import PrefrenceNavbar from './PrefrenceNavbar/PrefrenceNavbar';
import Split from 'react-split'
import CodeMirror from "@uiw/react-codemirror"
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import EditorFooter from './EditorFooter';
import { Problem } from '@/utils/types/problem';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/Firebase/firebase';
import { toast } from 'react-toastify';
import { problems } from '@/utils/problems';
import { useRouter } from 'next/router';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import useLocalStorage from '@/hooks/useLocalStorage';

type PlaygroundProps = {
    problem: Problem
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>
    setSolved: React.Dispatch<React.SetStateAction<boolean>>
};


export interface ISettings {
    fontsize: string
    settingsModalIsOpen: boolean
    dropdownIsOpen: boolean
}

const Playground: React.FC<PlaygroundProps> = ({ problem, setSuccess, setSolved }) => {



    const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0)
    let [userCode, setUserCode] = useState<string>(problem.starterCode)
    const [user] = useAuthState(auth)
    const { query: { pid } } = useRouter()


    const [fontSize, setFontSize] = useLocalStorage("Lcc-FontSize", "16px")
    const [setting, setSetting] = useState<ISettings>({
        fontsize: fontSize,
        settingsModalIsOpen: false,
        dropdownIsOpen: false
    })




    const handleSubmit = async () => {
        if (!user) {
            toast.error('To perform this action you have to login.')
            return
        }

        try {
            userCode = userCode.slice(userCode.indexOf(problem.starterFunctionName))
            const cb = new Function(`return ${userCode}`)()
            const handler = problems[pid as string].handlerFunction

            if (typeof handler === "function") {
                const result = handler(cb)
                if (result) {
                    toast.success("Congrats! You passed the test!", { position: "top-center" })
                    setSuccess(true)
                    setTimeout(() => {
                        setSuccess(false)
                    }, 10000)

                    const UserRef = doc(firestore, "users", user.uid)
                    await updateDoc(UserRef, {
                        solvedProblems: arrayUnion(pid)
                    })
                    setSolved(true)
                }
            }

        } catch (error: any) {
            if (error.message.startsWith("AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:")) {
                toast.error("Opps! One or more test cases Failed!")
            } else {
                toast.error(error.message)
            }
        }
    }

    useEffect(() => {
        const code = localStorage.getItem(`code-${pid}`);
        if (user) {
            setUserCode(code ? JSON.parse(code) : problem.starterCode)
        } else {
            setUserCode(problem.starterCode)
        }
    }, [pid, user, problem.starterCode])

    const onChange = (value: string) => {
        setUserCode(value)
        localStorage.setItem(`code-${pid}`, JSON.stringify(value))
    }

    return <div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
        <PrefrenceNavbar setting={setting} setSetting={setSetting} />

        <Split
            className=" h-[calc(100vh-94px)]"
            direction="vertical"
            sizes={[60, 40]}
            minSize={60}
        >
            <div>
                <div className='w-full overflow-auto'>
                    <CodeMirror
                        onChange={onChange}
                        value={userCode}
                        theme={vscodeDark}
                        extensions={[javascript()]}
                        style={{ fontSize: setting.fontsize }}
                    />
                </div>
            </div>
            <div className='w-full px-5 overflow-auto'>
                {/* Test Case Heading */}
                <div className='flex h-10 items-center space-x-6'>
                    <div className='relative flex h-full flex-col justify-center cursor-pointer'>
                        <div className='text-sm font-medium leading-5 text-white'>Test Cases</div>
                        <hr className='absolute bottom-0 h-0.5 w-20 rounded-full border-none bg-white' />
                    </div>
                </div>
                <div className='flex'>
                    {/*case 1  */}
                    {
                        problem.examples.map((example, index) => (
                            <div className='mx-2 items-start mt-2 text-white '
                                onClick={() => setActiveTestCaseId(index)}
                                key={example.id}
                            >
                                <div className='flex flex-wrap items-center gap-y-4'>
                                    <div className={`font-medium items-center  transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2    relative rounded-lg px-4 py-1 cursor-pointer 
                                    ${activeTestCaseId === index ? "bg-gray-500" : ""}
                                   `}>Case {index + 1}
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                </div>
                <div className='font-semibold my-4'>
                    <p className='text-sm font-medium text-white mt-4 '>Input:</p>
                    <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
                        {problem.examples[activeTestCaseId].inputText}
                    </div>
                    <p className='text-sm font-medium text-white mt-4 '>Output: </p>
                    <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2 mb-16'>
                        {problem.examples[activeTestCaseId].outputText}
                    </div>
                </div>
            </div>
        </Split >
        <EditorFooter handleSubmit={handleSubmit} />
    </div >
}
export default Playground;