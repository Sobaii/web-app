import React from 'react';
import { twMerge } from 'tailwind-merge';

function Card({ children, ...props }) {
  return (
    <div {...props} className={twMerge('flex w-full shadow flex-col gap-5 bg-white p-5 rounded-lg border', props.className)}>
      {children}
    </div>
  );
}

export default Card;
