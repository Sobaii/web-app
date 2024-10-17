import React from 'react';
import Backdrop from './Backdrop';
import Card from './Card';
import { twMerge } from 'tailwind-merge';

const Modal = ({ children, setShowModal, showModal, alert, ...props }) => {
    const handleBackdropClick = () => {
        if (!alert) {
            setShowModal(false);
        }
    };

    return (
        <>
            <Card
                {...props}
                className={twMerge(
                    'w-fit overflow-y-scroll h-fit max-w-[calc(100vw-48px)] max-h-[calc(100vw-48px)] fixed inset-0 m-auto transition-all duration-150 ease-in-out transform scale-75 z-50',
                    showModal
                        ? 'opacity-100 pointer-events-auto scale-100'
                        : 'opacity-0 pointer-events-none',
                    props.className
                )}
            >
                {children}
            </Card>
            <Backdrop
                showBackdrop={showModal}
                setShowBackdrop={handleBackdropClick}
            />
        </>
    );
};

export default Modal;
