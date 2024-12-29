import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui";

function ReceiptRender({ fileUrl, handleClose }) {
  const [height, setHeight] = useState(500);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const startYRef = useRef(0);
  const currentHeightRef = useRef(height);

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaY = startYRef.current - e.clientY;
    const newHeight = Math.max(100, currentHeightRef.current + deltaY);
    setHeight(newHeight);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      currentHeightRef.current = height;
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    startYRef.current = e.clientY;
    currentHeightRef.current = height;
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, height]);

  return (
    <div
      className={`z-[100] fixed left-0 right-0 bottom-0 max-h-screen w-full flex flex-col bg-white shadow-[0px_-2px_10px_rgba(0,0,0,0.1)]`}
      ref={containerRef}
      style={{
        height: `${height}px`,
      }}
    >
      <div
        className="min-h-[10px] cursor-ns-resize bg-gray-100 border-t border-gray-300"
        onMouseDown={handleMouseDown}
      ></div>
      <Button
        className='absolute top-5 right-5 z-50'
        variant='destructive'
        handleClick={handleClose}
        text='Close'
      />
      <div className="relative flex-grow overflow-y-auto">
        <img
          className="select-none m-auto h-full object-contain"
          src={fileUrl}

          alt="File content"
        />
        {isDragging && (
          <div className="absolute top-0 left-0 right-0 bottom-0 cursor-ns-resize" />
        )}
      </div>
    </div>
  );
}

export default ReceiptRender;