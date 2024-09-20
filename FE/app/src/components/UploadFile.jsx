import { useEffect, useState } from "react";
import Button from "./Button";
import Modal from "./Modal";
import { uploadExpenses } from "../services/expenseServices";
import { toast } from "sonner";
import UploadFileIcon from "../assets/upload-file.svg";

export default function UploadFile({
  showUploadModal,
  setShowUploadModal,
  setExpenses,
  spreadsheetId,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState([]);

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
      handleCancel();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setShowUploadModal(false);
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

  return (
    <Modal showModal={showUploadModal} setShowModal={setShowUploadModal}>
      <h3 className="text-2xl font-bold text-gray-800">Upload Files</h3>
      <div className="flex flex-col -mt-3 gap-1">
        <p className="text-sm text-gray-600 ">Note:</p>
        <ul className="text-sm text-gray-600 list-disc pl-5">
          <li>Larger file sizes provide better data quality.</li>
          <li>Each file should contain only one receipt.</li>
        </ul>
      </div>
      <label
        className={`flex flex-col items-center justify-center border-dashed border-2 border-gray-300 bg-gray-50 rounded-lg h-64 transition-colors duration-300 cursor-pointer ${
          isDragging ? "border-blue-500 bg-blue-50" : "hover:bg-gray-100"
        }`}
        htmlFor="fileInput"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-3">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500">
            PDF, JPEG, PNG, WEBP files only
          </p>
        </div>
        <input
          id="fileInput"
          type="file"
          multiple
          accept="application/pdf, image/jpeg, image/png, image/webp"
          className="hidden"
          onChange={handleFileSelect}
        />
      </label>
      {selectedFiles.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-600">Selected files:</p>
            <button
              onClick={handleDeselectAll}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Deselect All
            </button>
          </div>
          <ul className="grid grid-cols-2 gap-3 text-sm text-gray-500">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center space-x-2">
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:text-red-700 flex-shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {previews[index] && (
                  <img
                    src={previews[index]}
                    alt={`Preview of ${file.name}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <span className="truncate flex-grow">{file.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="w-full flex gap-2">
        <Button
          className="flex-1"
          text="Cancel"
          variant="secondary"
          handleClick={handleCancel}
        />
        <Button
          className="flex-1"
          imageSrc={UploadFileIcon}
          disabled={selectedFiles.length === 0}
          text={
            selectedFiles.length === 0
              ? "No files selected"
              : `Upload ${selectedFiles.length} ${
                  selectedFiles.length === 1 ? "file" : "files"
                }`
          }
          variant="primary"
          handleClick={handleUpload}
        />
      </div>
    </Modal>
  );
}
