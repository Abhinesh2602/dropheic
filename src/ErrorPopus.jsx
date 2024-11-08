import { useState } from "react";
import { Button } from "./Button";
import { X } from "lucide-react";
import kittyrinky from "./assets/kittyrinky.jpg"; // Import the image

const ErrorPopup = ({ message, onClose }) => {
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

        <div className="flex justify-end text-white">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

// const ErrorPopup = ({ message, onClose }) => {
//   const [isConverting, setIsConverting] = useState(false);
//   const [conversionProgress, setConversionProgress] = useState(0);

//   const handleDownload = async () => {
//     setIsConverting(true);

//     try {
//       // Start progress animation
//       for (let i = 0; i <= 100; i += 10) {
//         await new Promise((resolve) => setTimeout(resolve, 300));
//         setConversionProgress(i);
//       }

//       // Fetch the image as a blob
//       const response = await fetch(kittyrinky);
//       const blob = await response.blob();

//       // Create download link with blob URL
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = "kittyrinky.jpg";

//       // Trigger download
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       // Cleanup
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download failed:", error);
//     } finally {
//       setIsConverting(false);
//       setConversionProgress(0);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-[#353535] p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-white text-lg font-semibold">Error</h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-white transition-colors"
//           >
//             <X size={20} />
//           </button>
//         </div>
//         <p className="text-white mb-6">{message}</p>
//         {isConverting && (
//           <div className="mb-4">
//             <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
//               <div
//                 className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
//                 style={{ width: `${conversionProgress}%` }}
//               ></div>
//             </div>
//             <p className="text-white text-center text-sm">
//               Converting... {conversionProgress}%
//             </p>
//           </div>
//         )}
//         <div className="flex justify-end text-white">
//           <Button onClick={handleDownload} disabled={isConverting}>
//             {isConverting ? "Converting..." : "Download"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

export default ErrorPopup;
