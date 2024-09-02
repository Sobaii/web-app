import { useState } from "react";
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
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      setError("");
    } else {
      setError("Please upload valid files (PDF, JPEG, PNG, WEBP).");
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      setError("");
    } else {
      setError("Please upload valid files (PDF, JPEG, PNG, WEBP).");
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
    setSelectedFiles([]);
    setError("");
    setShowUploadModal(false);
  };

  return (
    <Modal showModal={showUploadModal} setShowModal={setShowUploadModal}>
      <h3 className="text-2xl font-bold text-gray-800">Upload File</h3>
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
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-10 h-10 mb-3 text-gray-400"
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
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500">PDF, JPEG, PNG, WEBP files only</p>
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
        <div className="mt-2">
          <p className="text-sm text-gray-600">Selected files:</p>
          <ul className="list-disc list-inside text-sm text-gray-500">
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="flex justify-end space-x-2 mt-4">
        <Button text="Cancel" variant="secondary" handleClick={handleCancel} />
        <Button
          imageSrc={UploadFileIcon}
          disabled={selectedFiles.length === 0}
          text="Upload"
          variant="primary"
          handleClick={handleUpload}
        />
      </div>
    </Modal>
  );
}
