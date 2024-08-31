import React, { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    iconSrc,
    placeHolder = '',
    fullWidth = false,
    error = '',
    className,
    ...props
}, ref) => {
    return (
        <div className={`flex flex-col ${fullWidth ? 'w-full' : 'min-w-[320px]'} relative gap-1`}>
            {iconSrc && <img alt='' className='w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2' src={iconSrc} />}
            {label && <h6 className={`font-medium text-sm ${error ? 'text-red-500' : ''}`}>{label}</h6>}
            <input
                ref={ref}
                placeholder={placeHolder}
                className={`rounded-lg border bg-white text-black border-neutral-300 pl-3 pr-3 py-2 ${iconSrc ? 'pl-9' : 'pl-3'} ${error ? 'border-red-500' : 'border-neutral-300'} ${className} ${fullWidth ? 'w-full' : 'min-w-[320px]'}`}
                {...props}
            />
            {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
    );
});

export default Input;
