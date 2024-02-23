import React from 'react';
import PrefrenceNavbar from './PrefrenceNavbar/PrefrenceNavbar';
import Split from 'react-split'
import CodeMirror from "@uiw/react-codemirror"
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import EditorFooter from './EditorFooter';

type PlaygroundProps = {

};

const Playground: React.FC<PlaygroundProps> = () => {
const boilerPlateCode = `// Start Coding Now!

function towsum(num, target){
    // Write your code here.
};`;

    return <div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
        <PrefrenceNavbar />

        <Split
            className=" h-[calc(100vh-94px)]"
            direction="vertical"
            sizes={[60, 40]}
            minSize={60}
        >
            <div>
                <div className='w-full overflow-auto'> <CodeMirror value={boilerPlateCode} theme={vscodeDark} extensions={[javascript()]} style={{ fontSize: 16 }} /> </div>
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
                    <div className='mx-2 items-start mt-2 text-white '>
                        <div className='flex flex-wrap items-center gap-y-4'>
                            <div className='font-medium items-center  transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer'>Case 1</div>
                        </div>
                    </div>


                    {/*case 2  */}
                    <div className='mx-2 items-start mt-2 text-white '>
                        <div className='flex flex-wrap items-center gap-y-4'>
                            <div className='font-medium items-center  transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer'>Case 2</div>
                        </div>
                    </div>

                    {/*case 3  */}
                    <div className='mx-2 items-start mt-2 text-white '>
                        <div className='flex flex-wrap items-center gap-y-4'>
                            <div className='font-medium items-center  transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer'>Case 3</div>
                        </div>
                    </div>
                </div>
                <div className='font-semibold my-4'>
                    <p className='text-sm font-medium text-white mt-4 '>Input:</p>
                    <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>nums: [2,7,11,12], target: 9</div>
                    <p className='text-sm font-medium text-white mt-4 '>Output: </p>
                    <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>[0,1]</div>
                </div>
            </div>
        </Split>
        <EditorFooter />
    </div>
}
export default Playground;