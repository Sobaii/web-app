import React, { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

const SplineModel = ({show}) => {
  const splineRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@splinetool/viewer@1.3.1/build/spline-viewer.js';
    script.type = 'module';
    script.async = true;

    script.onload = () => {
      if (splineRef.current) {
        // Script has loaded, and we can safely use the Spline viewer.
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className={twMerge('h-screen w-screen  relative overflow-hidden transition-all duration-200', !show && 'opacity-0')}>
      {/* <div className='absolute bottom-0 h-20 left-0 z-50 bg-slate-900 w-full'>hi</div> */}
      <spline-viewer
        ref={splineRef}
        url="https://prod.spline.design/URTlmo3qmZdoznIY/scene.splinecode"  // Updated model URL
        />
    </div>
  );
}

export default SplineModel; 