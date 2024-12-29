import React, { useEffect } from 'react';

const Backdrop = ({ setShowBackdrop, showBackdrop, darkMode = false }) => {
    useEffect(() => {
        if (showBackdrop) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showBackdrop]);

    return (
        <div
            onClick={() => setShowBackdrop(false)}
            className={`fixed inset-0 z-40 transition-opacity duration-200 ease-in-out bg-neutral-900 ${showBackdrop ? 'opacity-70 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            style={{ backdropFilter: 'blur(2px)' }}
        ></div>
    );
};

export default Backdrop;
