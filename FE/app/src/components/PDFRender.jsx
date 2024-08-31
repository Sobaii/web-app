import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";

const requestAnimationFrame = window.requestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame;
const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

function PDFRender({ viewingPDF, handleClose }) {
  const [height, setHeight] = useState(300); // Initial height
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const startYRef = useRef(0);
  const currentHeightRef = useRef(height);
  const frameIdRef = useRef(null);

  const updateHeight = () => {
    if (containerRef.current) {
      containerRef.current.style.height = `${currentHeightRef.current}px`;
    }
    frameIdRef.current = null;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaY = startYRef.current - e.clientY;
    currentHeightRef.current = Math.max(100, height + deltaY);

    if (!frameIdRef.current) {
      frameIdRef.current = requestAnimationFrame(updateHeight);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setHeight(currentHeightRef.current);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    currentHeightRef.current = height;
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
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
        text='Close Receipt Viewer'
      />
      <div style={{ position: 'relative', flexGrow: 1 }}>
        <iframe
          className="select-none"
          src={`${viewingPDF}#toolbar=0`}
          style={{
            border: "1px solid black",
            width: "100%",
            height: "100%",
          }}
          type="application/pdf"
        ></iframe>
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

export default PDFRender;