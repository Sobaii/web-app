import { useState } from "react";
import Button from "@/components/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/dialog";
import { uploadExpenses } from "@/services/expenseAPI";
import { toast } from "sonner";
import UploadFileIcon from "../assets/upload-file.svg";
import Image from "next/image";

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
    const files = Array.from(event.dataTransfer.files).filter(
      (file) => file.type === "application/pdf"
    );
    if (files.length > 0) {
      setSelectedFiles(files);
      setError("");
    } else {
      setError("Please upload PDF files.");
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files).filter(
      (file) => file.type === "application/pdf"
    );
    if (files.length > 0) {
      setSelectedFiles(files);
      setError("");
    } else {
      setError("Please upload PDF files.");
    }
  };

  const updateAttachment = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select a file");
      return;
    }

    try {
      const response = await uploadExpenses(selectedFiles, spreadsheetId);
      response.processedResults.forEach((file) => {
        setExpenses((prevExpenses) => [...prevExpenses, file]);
      });
      toast.success("Files uploaded successfully");
      setShowUploadModal(false);
      setSelectedFiles([]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-3"
          imageSrc="/images/upload-file.svg"
          text="Upload file"
        />
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col">
          <h3>Upload File</h3>
          <label
            className={`flex flex-col border-dashed border-2 border-gray-400 bg-gray-200 h-48 transition-colors duration-300 cursor-pointer ${
              isDragging ? "bg-gray-400 border-gray-400 border-solid" : ""
            }`}
            htmlFor="fileInput"
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <h6>Drag and drop PDF files here</h6>
            <p>or</p>
            <h6>Click to browse</h6>
            <input
              id="fileInput"
              type="file"
              multiple
              accept="application/pdf"
              className="hidden"
              onChange={handleFileSelect}
            />
            {selectedFiles.length > 0 && (
              <p>
                Selected files:{" "}
                {selectedFiles.map((file) => file.name).join(", ")}
              </p>
            )}
          </label>
          {error && <div className="text-red-500">{error}</div>}
          <div className="flex">
            <Button
              variant="secondary"
              handleClick={() => setShowUploadModal(false)}
              text='Cancel'/>
            <Button
              disabled={selectedFiles.length === 0}
              variant="default"
              handleClick={updateAttachment}
              imageSrc="/images/upload-file.svg"
              text="Upload"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
