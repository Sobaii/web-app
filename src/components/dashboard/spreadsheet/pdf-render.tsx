import React, { useEffect } from "react";
import Button from "@/components/button";

function PDFRender({viewingPDF,handleClose}) {
  return (
    <div
      style={{
        zIndex:'100', 
        marginTop: "20px",
        position: "fixed", 
        left: "0",
        bottom: "0",
        width: "100dvw",
      }}
    >
      <Button variant='destructive' handleClick={handleClose} style={{ position:'absolute', top:'8px', right:'24px', transform:'translateY(0)'}} text='Close PDF Viewer' />
      <iframe
        src={`${viewingPDF}#toolbar=0`}
        height="500px"
        width="100%"
        style={{ border: "1px solid black", maxHeight:'50vh'}}
        type="application/pdf"
      ></iframe>
    </div>
  );
}

export default PDFRender;