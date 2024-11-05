import { UploadContainer } from "./UploadContainer";
import { Navbar } from "./Navbar";
import { Button } from "./Button";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ImageCard from "./ImageCard";
import { API_URL } from "./config.js";

export default function App() {
  const [data, setData] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (data.files) {
      const urls = data.files.map((file) => `${API_URL}${file.downloadUrl}`);
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
    <div className="w-full min-h-screen bg-[#202020]">
      <Navbar />
      <div className="flex flex-col justify-center items-center mt-[4.25rem]">
        <UploadContainer
          isSuccess={isSuccess}
          setIsSuccess={setIsSuccess}
          setData={setData}
        />
        <div className="text-white mt-12 fixed bottom-10">
          {isSuccess && (
            <Button onClick={downloadZipFile} disabled={isDownloading}>
              {isDownloading ? "Downloading..." : "Download All"}
            </Button>
          )}
        </div>
        {isSuccess && imageUrls.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 mt-16 mb-32 px-4">
            {imageUrls.map((url, index) => (
              <ImageCard
                key={index}
                imgUrl={url}
                allImages={imageUrls}
                currentIndex={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
