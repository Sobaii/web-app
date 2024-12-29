import React, { cloneElement, useRef, useState, useEffect, useCallback } from 'react';

const Swipeable = ({ visible, setVisible, closeDirection = 'right', closeTravel = 150, children, transition = 'transform 500ms cubic-bezier(0.32, 0.72, 0, 1)', className = '', ...props }) => {
    const getTransformToHide = () => {
        const axis = closeDirection === 'up' || closeDirection === 'down' ? 'Y' : 'X';
        const sign = closeDirection === 'up' || closeDirection === 'left' ? '-' : '';
        return `translate${axis}(${sign}100%)`;
    };

    const [transitionStyle, setTransitionStyle] = useState(transition);
    const [transform, setTransform] = useState(getTransformToHide());
    const [modal, setModal] = useState(null);

    let dragging = false;
    let mouseDownClientY = 0;
    let mouseDownClientX = 0;
    let dragTravel = 0;
    const modalRef = useRef(null);

    const handleMouseDown = useCallback((event) => {
        const target = event.target;
        const interactiveElements = ['PRE', 'INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A', 'P', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
        if (interactiveElements.includes(target.tagName) || target.isContentEditable) {
            return;
        }

        event.preventDefault();
        dragging = true;
        mouseDownClientY = event.clientY;
        mouseDownClientX = event.clientX;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        setTransitionStyle('');
    }, [closeDirection]);

    const handleMouseMove = useCallback((event) => {
        if (dragging) {
            switch (closeDirection) {
                case 'up':
                    dragTravel = mouseDownClientY - event.clientY;
                    break;
                case 'down':
                    dragTravel = event.clientY - mouseDownClientY;
                    break;
                case 'left':
                    dragTravel = mouseDownClientX - event.clientX;
                    break;
                default:
                    dragTravel = event.clientX - mouseDownClientX;
            }
            if (dragTravel >= 0) {
                const axis = closeDirection === 'up' || closeDirection === 'down' ? 'Y' : 'X';
                const sign = closeDirection === 'up' || closeDirection === 'left' ? '-' : '';
                setTransform(`translate${axis}(${sign}${dragTravel}px)`);
            }
        }
    }, [closeDirection]);

    const handleMouseUp = useCallback(() => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        setTransitionStyle(transition);
        dragging = false;
        if (dragTravel > closeTravel) {
            setVisible(false);
            setTransform(getTransformToHide());
        } else {
            setTransform('');
        }
        dragTravel = 0;
    }, [closeTravel, transition, setVisible]);

    useEffect(() => {
        if (modalRef.current) {
            setModal(modalRef.current);
            setTransform(visible ? '' : getTransformToHide());
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            if (modal) {
                modal.removeEventListener('mousedown', handleMouseDown);
            }
        };
    }, [modal, visible, handleMouseDown, handleMouseMove, handleMouseUp]);

    const directionClasses = {
        up: 'top-0 left-0 w-full',
        down: 'bottom-0 left-0 w-full',
        left: 'top-0 left-0 h-full',
        right: 'top-0 right-0 h-full',
    };

    return (
        <div 
            {...props} 
            className={`fixed z-[1001] ${directionClasses[closeDirection]} ${className}`}
            ref={modalRef} 
            onMouseDown={handleMouseDown} 
            style={{ 
                transition: transitionStyle, 
                transform: transform 
            }}
        >
            {children}
        </div>
    );
};

export default Swipeable;