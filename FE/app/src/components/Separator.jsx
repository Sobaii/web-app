import React from "react";
import { twMerge } from 'tailwind-merge'

const Separator = ({ orientation = 'h', ...props }) => {
  return (
    <div
      {...props}
      className={twMerge('bg-neutral-300', orientation === 'h' ? 'h-px w-full' : 'w-px h-full', props.className)}
    ></div>
  );
};

export default Separator;
