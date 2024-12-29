import generateRandomString from "./generateRandomString";
import html2canvas from 'html2canvas';

const convertHTMLElementToImage = async (elementRef, fileName = generateRandomString(), fileType = "image/jpg") => {
  if (elementRef.current) {
    try {
      // Capture the screenshot
      const canvas = await html2canvas(elementRef.current);

      // Convert the canvas to a Blob
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, fileType)
      );

      return blob;
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
  }
};

export default convertHTMLElementToImage;
