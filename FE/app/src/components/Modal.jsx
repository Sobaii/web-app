import React from 'react';
import Backdrop from './Backdrop';
import Card from './Card';
import { twMerge } from 'tailwind-merge';

const Modal = ({ children, setShowModal, showModal, ...props }) => {
    return (
        <>
            <Card {...props} style={{ maxWidth: 'calc(100dvw - 48px)' }} className={twMerge('w-fit h-fit fixed inset-0 m-auto transition-all duration-300 ease-in-out transform scale-75 z-50', showModal ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none', props.className)}>
                {children}
            </Card>
            <Backdrop showBackdrop={showModal} setShowBackdrop={setShowModal} />
        </>
    );
};

export default Modal;
