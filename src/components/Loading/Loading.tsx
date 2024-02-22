import React from 'react';

type LoadingProps = {

};

const Loading: React.FC<LoadingProps> = () => {

    return <div className="spinner flex justify-center items-center">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
}
export default Loading;