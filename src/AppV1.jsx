import { UploadContainer } from "./UploadContainer";
import { Navbar } from "./Navbar";
import { Button } from "./Button";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function App() {
  const [data, setData] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (data.files) {
      const urls = data.files.map(
        (file) => `http://localhost:3001${file.downloadUrl}`
      );
      setImageUrls(urls);
    }
  }, [data.files]);
  const downloadZipFile = async () => {
    try {
      setIsDownloading(true);
      const zip = new JSZip();
      const images = zip.folder("images");

      // Create an array of promises for fetching images
      const downloadPromises = imageUrls.map(async (url) => {
        try {
          const fileName = url.substring(url.lastIndexOf("/") + 1);
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch ${fileName}`);
          const blob = await response.blob();
          return { fileName, blob };
        } catch (error) {
          console.error(`Error downloading ${url}:`, error);
          return null;
        }
      });

      // Wait for all downloads to complete
      const results = await Promise.all(downloadPromises);

      // Add successfully downloaded files to zip
      results.forEach((result) => {
        if (result) {
          images.file(result.fileName, result.blob);
        }
      });

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "images.zip");
    } catch (error) {
      console.error("Error creating zip file:", error);
      alert("Failed to create zip file. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[#202020] ">
      <Navbar />
      <div className="flex flex-col justify-center items-center mt-[4.25rem]">
        <UploadContainer
          isSuccess={isSuccess}
          setIsSuccess={setIsSuccess}
          setData={setData}
        />
        <div className="text-white mt-12 fixed bottom-10">
          {isSuccess && <Button onClick={downloadZipFile}>Download All</Button>}
        </div>
        {isSuccess && imageUrls.length > 0 && (
          <div className="grid grid-cols-5 gap-10 mt-16 h-auto mb-16">
            {imageUrls.map((url, index) => (
              <ImageCard key={index} imgUrl={url} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const ImageCard = ({ imgUrl }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="h-[15rem] w-[15rem] bg-white relative">
      {!imageError ? (
        <img
          className="h-full w-full object-cover"
          src={imgUrl}
          alt={imgUrl}
          onError={handleImageError}
        />
      ) : (
        <div className="flex items-center justify-center h-full w-full">
          <p className="text-gray-500">Image not available</p>
        </div>
      )}
    </div>
  );
};
