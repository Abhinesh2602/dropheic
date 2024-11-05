import { useRef, useState } from "react";
import { Button } from "./Button";
import uploadCloud from "./assets/upload.svg";
import { X } from "lucide-react";
import { API_URL } from "./config";

const ErrorPopup = ({ message, onClose }) => {
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);

  const handleDownload = async () => {
    setIsConverting(true);

    // Fake progress simulation
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Wait 300ms between updates
      setConversionProgress(i);
    }

    try {
      const response = await fetch(`${API_URL}/converted/kittyrinky.jpg`);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "kittyrinky.jpg";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsConverting(false);
      setConversionProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#353535] p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg font-semibold">Error</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-white mb-6">{message}</p>
        {isConverting && (
          <div className="mb-4">
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${conversionProgress}%` }}
              ></div>
            </div>
            <p className="text-white text-center text-sm">
              Converting... {conversionProgress}%
            </p>
          </div>
        )}
        <div className="flex justify-end text-white">
          <Button onClick={handleDownload} disabled={isConverting}>
            {isConverting ? "Converting..." : "Download"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const UploadContainer = ({ isSuccess, setIsSuccess, setData }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const showErrorPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
  };

  const validateFiles = (files) => {
    const heicFiles = [];
    const jpegFiles = [];

    Array.from(files).forEach((file) => {
      const extension = file.name.toLowerCase().split(".").pop();
      if (extension === "heic") {
        heicFiles.push(file);
      } else if (["jpg", "jpeg"].includes(extension)) {
        jpegFiles.push(file);
      }
    });

    if (jpegFiles.length > 0) {
      showErrorPopup(
        `${jpegFiles.length} JPEG file${
          jpegFiles.length > 1 ? "s" : ""
        } detected. Uh No Neha this converter is for HEIC files only But still it works for you download below.`
      );
    }

    return heicFiles;
  };

  const handleFileChange = (e) => {
    const heicFiles = validateFiles(e.target.files);
    setSelectedFiles(heicFiles);
    setError(null);
    setIsSuccess(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const heicFiles = validateFiles(e.dataTransfer.files);

    if (heicFiles.length === 0) {
      setError("Please drop only HEIC files");
      return;
    }

    setSelectedFiles(heicFiles);
    setError(null);
    setIsSuccess(false);
  };

  const handleConversion = async () => {
    if (selectedFiles.length === 0) return;

    setIsConverting(true);
    setError(null);
    setIsSuccess(false);
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(`${API_URL}/convert`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setData(data);
        setSelectedFiles([]);
        setIsSuccess(true);
      } else {
        setError(data.error || "Conversion failed");
      }
    } catch (error) {
      console.error("Conversion error:", error);
      setError("Failed to convert files. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <>
      <div className="bg-[#353535] w-[45rem] min-h-[25.625rem] h-auto flex flex-col gap-4 rounded-[1.375rem] items-center justify-between p-6">
        <form
          encType="multipart/form-data"
          className="flex flex-col items-center"
          onSubmit={(e) => {
            e.preventDefault();
            handleConversion();
          }}
        >
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-[#202020] hover:bg-[#2a2a2a] transition-colors duration-200
          w-[43rem] h-[18.375rem] border-dashed border-4 cursor-pointer
          ${isDragging ? "border-green-500 bg-[#2a2a2a]" : "border-[#1A85BA]"}
          rounded-[1.375rem] text-white text-lg flex flex-col items-center justify-center gap-4`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".heic"
              name="files"
              multiple
            />
            <img
              src={uploadCloud}
              alt="Upload"
              className={`transition-transform duration-200 ${
                isDragging ? "scale-110" : ""
              }`}
            />
            <div className="text-center space-y-2">
              <h2>
                {isDragging
                  ? "Drop your HEIC files here"
                  : "Choose HEIC Photos or Drop them Here"}
              </h2>
              {selectedFiles.length > 0 && (
                <p className="text-green-400">
                  {selectedFiles.length} file
                  {selectedFiles.length > 1 ? "s" : ""} selected
                </p>
              )}
              {error && <p className="text-red-400">{error}</p>}
              {isSuccess && (
                <p className="text-green-400">Files converted successfully!</p>
              )}
            </div>
          </div>

          <div className="text-white text-center flex flex-col items-center w-full max-w-md">
            <p className="my-4">
              {isConverting
                ? ""
                : selectedFiles.length > 0
                ? "Ready to convert"
                : "Select images to convert"}
            </p>
            <Button
              type="submit"
              disabled={selectedFiles.length === 0 || isConverting}
            >
              {isConverting ? "Converting..." : "Convert Now"}
            </Button>
          </div>
        </form>
      </div>
      {showPopup && (
        <ErrorPopup
          message={popupMessage}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
};

export default UploadContainer;