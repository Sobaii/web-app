import React, { useState } from "react";
import clsx from 'clsx';

const Button = ({
  text,
  type = "button",
  variant = "primary",
  size = "m",
  imageSrc,
  disabled = false,
  handleClick,
  className,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async (e) => {
    e.stopPropagation();
    if (!disabled && !isLoading && handleClick) {
      setIsLoading(true);
      try {
        await handleClick(e); 
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    }
  };


  const buttonClass = clsx(
    'flex h-fit shadow whitespace-nowrap hover:opacity-70 justify-center flex-shrink-0 items-center gap-2 min-w-[120px] rounded transition-opacity duration-75 ease-linear',
    size === 's' && 'px-3 py-1 min-w-[120px] gap-1.5 rounded-md text-sm',
    size === 'm' && 'px-4 py-2 min-w-[150px] gap-2 rounded-lg text-base',
    size === 'l' && 'px-5 py-2.5 min-w-[200px] gap-2.5 rounded-xl text-lg',
    variant === 'primary' && 'bg-gradient-to-b from-[#228ee6] to-[#155bc4] text-white',
    variant === 'secondary' && 'bg-gray-200 text-gray-800',
    variant === 'outline' && 'bg-white border border-gray-300  text-gray-800',
    variant === 'destructive' && 'bg-red-600 border border-red-700  text-white',
    isLoading && 'opacity-60 cursor-not-allowed',
    disabled && '!opacity-60 cursor-not-allowed',
    className
  );

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={(e) => onClick(e)}
      className={buttonClass}
      {...props}
    >
      {imageSrc && !isLoading && <img src={imageSrc} alt={text} className="h-4 w-4" />}
      {isLoading && (
        <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 12 12">
          <path
            d="M12 6C12 7.18669 11.6481 8.34673 10.9888 9.33342C10.3295 10.3201 9.39246 11.0892 8.2961 11.5433C7.19974 11.9974 5.99334 12.1162 4.82946 11.8847C3.66557 11.6532 2.59647 11.0818 1.75736 10.2426C0.918244 9.40353 0.3468 8.33443 0.115288 7.17054C-0.116223 6.00666 0.00259702 4.80026 0.456723 3.7039C0.910849 2.60754 1.67988 1.67047 2.66658 1.01118C3.65327 0.351894 4.81331 -1.41511e-08 6 0L6 2.03777C5.21635 2.03777 4.45029 2.27015 3.7987 2.70553C3.14712 3.1409 2.63927 3.75972 2.33938 4.48372C2.03949 5.20772 1.96102 6.0044 2.11391 6.77299C2.26679 7.54159 2.64416 8.24759 3.19828 8.80172C3.75241 9.35584 4.45841 9.73321 5.22701 9.88609C5.9956 10.039 6.79228 9.96051 7.51628 9.66062C8.24028 9.36073 8.8591 8.85288 9.29447 8.2013C9.72985 7.54971 9.96223 6.78365 9.96223 6H12Z"
            fill={variant === ('outline' || 'secondary') ? '#4B5563' : '#ffffff'}
          />
        </svg>
      )}
      {text}
    </button>
  );
};

export default Button;
