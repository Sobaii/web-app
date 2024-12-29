import React from 'react';
import { twMerge } from 'tailwind-merge';


const Icon = ({ image, alt = 'icon', width = 20, height = 20,  text = '', ...props }) => {

  return (
    <a {...props} 
       className={twMerge('flex rounded-md hover:bg-neutral-200 flex-shrink-0 items-center gap-2 p-2 cursor-pointer transition-all duration-75 ease-out', props.className)}>
      <img alt={alt} src={image} className="w-[16px] h-[16px]"/>
      {text && <p>{text}</p>}
    </a>
  );
};

export default Icon;
