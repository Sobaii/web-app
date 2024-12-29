import { useState, useEffect } from 'react';
import { uploadExpenses } from '../api/expenseApi';
import { toast } from 'sonner';

export default function useReceiptUploadModal(setExpenses, spreadsheetId) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const newFiles = Array.from(event.dataTransfer.files);
    if (newFiles.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    } else {
      setError("Please upload valid files (PDF, JPEG, PNG, WEBP).");
    }
  };

  const handleFileSelect = (event) => {
    const newFiles = Array.from(event.target.files);
    if (newFiles.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select a file");
      return;
    }
    try {
      const response = await uploadExpenses(selectedFiles, spreadsheetId);
      response.forEach((file) => {
        setExpenses((prevExpenses) => [...prevExpenses, file]);
      });
      toast.success("Files uploaded successfully");
      setShowUploadModal(false);
      setSelectedFiles([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleDeselectAll = () => {
    setSelectedFiles([]);
  };

  useEffect(() => {
    setError("");
    const generatePreviews = async () => {
      const newPreviews = await Promise.all(
        selectedFiles.map(async (file) => {
          if (file.type.startsWith("image/")) {
            return URL.createObjectURL(file);
          } else if (file.type === "application/pdf") {
            return "path/to/pdf-icon.svg";
          }
          return null;
        })
      );
      setPreviews(newPreviews);
    };

    generatePreviews();

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [selectedFiles]);

  return {
    isDragging,
    selectedFiles,
    error,
    previews,
    showUploadModal,
    setShowUploadModal,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    handleUpload,
    handleRemoveFile,
    handleDeselectAll,
  };
}