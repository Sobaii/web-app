import React, { useEffect, useRef, FC } from 'react';
import { twMerge } from 'tailwind-merge';

const OutsideClick = ({ children, onClickOutside, ...props }) => {
    const wrapperRef = useRef(null);

    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            onClickOutside();
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    });

    const outsideClickContainerClassnames = twMerge('flex-shrink-0', props.className)
    return (
        <div {...props} className={outsideClickContainerClassnames} ref={wrapperRef}>
            {children}
        </div>
    )
};

export default OutsideClick;
