// import { useRef, useState } from "react";
// import { Button } from "./Button";
// import uploadCloud from "./assets/upload.svg";

// export const UploadContainer = () => {
//   const fileInputRef = useRef(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isConverting, setIsConverting] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [error, setError] = useState(null);
//   const [isSuccess, setIsSuccess] = useState(false);

//   const handleClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files).filter((file) =>
//       file.name.toLowerCase().endsWith(".heic")
//     );
//     setSelectedFiles(files);
//     setError(null);
//     setIsSuccess(false);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);

//     const files = Array.from(e.dataTransfer.files).filter((file) =>
//       file.name.toLowerCase().endsWith(".heic")
//     );

//     if (files.length === 0) {
//       setError("Please drop only HEIC files");
//       return;
//     }

//     setSelectedFiles(files);
//     setError(null);
//     setIsSuccess(false);
//   };

//   const handleConversion = async () => {
//     if (selectedFiles.length === 0) return;

//     setIsConverting(true);
//     setError(null);
//     setIsSuccess(false);
//     const formData = new FormData();

//     selectedFiles.forEach((file) => {
//       formData.append("files", file);
//     });

//     try {
//       const response = await fetch("http://localhost:3001/convert", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();

//       if (data.success) {
//         // Download converted files
//         data.files.forEach((file) => {
//           const link = document.createElement("a");
//           link.href = `http://localhost:3001${file.downloadUrl}`;
//           link.download = file.convertedName;
//           document.body.appendChild(link);
//           link.click();
//           document.body.removeChild(link);
//         });

//         setSelectedFiles([]);
//         setIsSuccess(true);
//       } else {
//         setError(data.error || "Conversion failed");
//       }
//     } catch (error) {
//       console.error("Conversion error:", error);
//       setError("Failed to convert files. Please try again.");
//     } finally {
//       setIsConverting(false);
//     }
//   };

//   return (
//     <div className="bg-[#353535] w-[45rem] h-[25.625rem] flex flex-col gap-4 rounded-[1.375rem] items-center justify-between  p-6">
//       <div
//         onClick={handleClick}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//         className={`bg-[#202020] hover:bg-[#2a2a2a] transition-colors duration-200
//           w-[43rem] h-[18.375rem] border-dashed border-4 cursor-pointer
//           ${isDragging ? "border-green-500 bg-[#2a2a2a]" : "border-[#1A85BA]"}
//           rounded-[1.375rem] text-white text-lg flex flex-col items-center justify-center gap-4`}
//       >
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           className="hidden"
//           accept=".heic"
//           multiple
//         />
//         <img
//           src={uploadCloud}
//           alt="Upload"
//           className={`transition-transform duration-200 ${
//             isDragging ? "scale-110" : ""
//           }`}
//         />
//         <div className="text-center space-y-2">
//           <h2>
//             {isDragging
//               ? "Drop your HEIC files here"
//               : "Choose HEIC Photos or Drop them Here"}
//           </h2>
//           {selectedFiles.length > 0 && (
//             <p className="text-green-400">
//               {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""}{" "}
//               selected
//             </p>
//           )}
//           {error && <p className="text-red-400">{error}</p>}
//           {isSuccess && (
//             <p className="text-green-400">Files converted successfully!</p>
//           )}
//         </div>
//       </div>
//       {isConverting ? <p>Converting</p> : <p>Select Images to convert</p>}
//       <div className="text-white">
//         <Button
//           onClick={handleConversion}
//           disabled={selectedFiles.length === 0 || isConverting}
//         ></Button>
//       </div>
//     </div>
//   );
// };
