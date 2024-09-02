import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";

function FileRender({ fileUrl, handleClose }) {
  const [height, setHeight] = useState(300);  
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
      ref={containerRef}
      style={{
        zIndex: '100',
        position: "fixed",
        left: "0",
        right: "0",
        bottom: "0",
        maxHeight:'100vh',
        height: `${height}px`,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        boxShadow: "0px -2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          minHeight: "10px",
          cursor: "ns-resize",
          backgroundColor: "#f0f0f0",
          borderTop: "1px solid #ccc",
        }}
        onMouseDown={handleMouseDown}
      ></div>
      <Button
        className='absolute top-5 right-5 z-50'
        variant='destructive'
        handleClick={handleClose}
        text='Close'
      />
      <div style={{ position: 'relative', flexGrow: 1, overflowY: 'auto' }}>
        <img
          className="select-none"
          src={fileUrl}
          style={{
            width: "100vw", // Set width to 100% of the viewport width
            height: "auto", // Maintain aspect ratio
            objectFit: "contain",
          }}
          alt="File content"
        />
        {isDragging && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              cursor: 'ns-resize',
            }}
          />
        )}
      </div>
    </div>
  );
}

export default FileRender;