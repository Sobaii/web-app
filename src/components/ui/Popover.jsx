import React, { useState } from 'react';
import OutsideClick from './OutsideClick';
import { twMerge } from 'tailwind-merge';

const Popover = ({ isOpen: isOpenProp, setIsOpen: setIsOpenProp, children, position = 'down-center', ...props }) => {
    const [isOpenState, setIsOpenState] = useState(false);

    const isOpen = isOpenProp !== undefined ? isOpenProp : isOpenState;
    const setIsOpen = setIsOpenProp !== undefined ? setIsOpenProp : setIsOpenState;

    const trigger = React.cloneElement(children[0], {
        onClick: (e) => { e.stopPropagation(); setIsOpen(isOpen => !isOpen) },
    });

    const positionClasses = {
        'down-center': 'top-full left-1/2 transform translate-y-1 -translate-x-1/2 scale-100',
        'up-right': 'bottom-full left-0',
        'up-left': 'bottom-full right-0',
        'up-center': 'bottom-full left-1/2 transform -translate-x-1/2 scale-100',
        'down-right': 'top-full translate-y-1 left-0',
        'down-left': 'top-full translate-y-1 right-0',
    };

    const contentClasses = `absolute transition-opacity duration-75 ease-out z-50 ${positionClasses[position]} ${isOpen ? 'pointer-events-auto opacity-100 scale-100' : 'pointer-events-none opacity-0'}`;

    const content = children[1]
        ? React.cloneElement(children[1], {
            className: `${contentClasses} ${children[1].props.className || ''}`
        })
        : null;


    return (
        <OutsideClick onClickOutside={() => setIsOpen(false)}>
            <div {...props} className={twMerge('relative flex-shrink-0', props.className)}>
                {trigger}
                {content}
            </div>
        </OutsideClick>
    );
};

export default Popover;
