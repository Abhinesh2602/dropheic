import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const ImageViewer = ({ isOpen, onClose, images, currentIndex, onNavigate }) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowLeft":
          onNavigate("prev");
          break;
        case "ArrowRight":
          onNavigate("next");
          break;
        case "Escape":
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, onNavigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
          aria-label="Close viewer"
        >
          <X size={24} />
        </button>

        {/* Navigation buttons */}
        <button
          onClick={() => onNavigate("prev")}
          className="absolute left-4 text-white hover:text-gray-300 z-50"
          aria-label="Previous image"
        >
          <ChevronLeft size={32} />
        </button>

        <button
          onClick={() => onNavigate("next")}
          className="absolute right-4 text-white hover:text-gray-300 z-50"
          aria-label="Next image"
        >
          <ChevronRight size={32} />
        </button>

        {/* Image container */}
        <div className="max-w-[90vw] max-h-[90vh] relative">
          <img
            src={images[currentIndex]}
            alt="Full size view"
            className="max-w-full max-h-[90vh] object-contain"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageCard = ({ imgUrl, allImages, currentIndex }) => {
  const [imageError, setImageError] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleNavigate = (direction) => {
    if (direction === "next") {
      setCurrentImageIndex((prev) =>
        prev === allImages.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === 0 ? allImages.length - 1 : prev - 1
      );
    }
  };

  return (
    <>
      <div
        className="h-[15rem] w-full sm:w-[15rem] bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105"
        onClick={() => setIsViewerOpen(true)}
      >
        {!imageError ? (
          <img
            className="h-full w-full object-cover"
            src={imgUrl}
            alt="Uploaded content"
            onError={handleImageError}
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <p className="text-gray-500">Image not available</p>
          </div>
        )}
      </div>

      <ImageViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        images={allImages}
        currentIndex={currentImageIndex}
        onNavigate={handleNavigate}
      />
    </>
  );
};

export default ImageCard;

// const ImageCard = ({ imgUrl }) => {
//   const [imageError, setImageError] = useState(false);

//   const handleImageError = () => {
//     setImageError(true);
//   };

//   return (
//     <div className="h-[15rem] w-full sm:w-[15rem] bg-white rounded-lg overflow-hidden shadow-lg">
//       {!imageError ? (
//         <img
//           className="h-full w-full object-cover"
//           src={imgUrl}
//           alt="Uploaded content"
//           onError={handleImageError}
//         />
//       ) : (
//         <div className="flex items-center justify-center h-full w-full">
//           <p className="text-gray-500">Image not available</p>
//         </div>
//       )}
//     </div>
//   );
// };
