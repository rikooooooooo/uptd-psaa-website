import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ClipLoader from "react-spinners/ClipLoader";
import { FaDownload, FaExternalLinkAlt } from "react-icons/fa";

function PengumumanPage() {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/announcements/${id}`);
        if (!response.ok) throw new Error("Failed to fetch announcement");
        const data = await response.json();
        setAnnouncement(data);
      } catch (error) {
        console.error("Error fetching announcement:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();

    // Detect if the user is on a mobile device
    setIsMobile(window.innerWidth <= 768);
  }, [id]);

  const extractFileUrl = (fileData) => {
    if (!fileData) return "";
    try {
      const parsedFile = JSON.parse(fileData);
      return parsedFile.url || fileData;
    } catch (error) {
      return fileData;
    }
  };

  const getFileExtension = (url) => {
    if (!url) return "";
    return "." + url.split(".").pop().split(/[#?]/)[0].toLowerCase();
  };

  const handleDownload = () => {
    const fileUrl = extractFileUrl(announcement?.file_url);
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", announcement.title + getFileExtension(fileUrl));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fileUrl = extractFileUrl(announcement?.file_url);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 min-h-screen">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <ClipLoader color="#00A85A" size={40} />
          </div>
        ) : announcement ? (
          <div className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-lg">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center sm:text-left">
              {announcement.title}
            </h1>
            <p className="text-gray-600 mb-4 text-center sm:text-left">{announcement.date}</p>

            {/* File Preview */}
            {fileUrl && (
              <div className="mb-4 flex justify-center">
                {getFileExtension(fileUrl) === ".pdf" ? (
                  isMobile ? (
                    // If mobile, show "View PDF" button
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 text-blue-600 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-300 transition"
                    >
                      <FaExternalLinkAlt />
                      Lihat PDF
                    </a>
                  ) : (
                    // If desktop, show embedded PDF preview
                    <div className="border border-gray-300 rounded-md p-2 w-full max-w-full sm:max-w-xl">
                      <embed
                        src={fileUrl}
                        type="application/pdf"
                        className="w-full h-[500px]"
                      />
                    </div>
                  )
                ) : [".jpg", ".jpeg", ".png"].includes(getFileExtension(fileUrl)) ? (
                  <img
                    src={fileUrl}
                    alt={announcement.title}
                    className="w-full h-auto rounded-md"
                  />
                ) : (
                  <p className="text-gray-600">File tidak dapat ditampilkan.</p>
                )}
              </div>
            )}

            <p className="text-gray-700 leading-relaxed mb-4 text-justify">{announcement.description}</p>

            {/* Download Button */}
            {fileUrl && (
              <button
                onClick={handleDownload}
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto hover:bg-blue-700 transition"
              >
                <FaDownload />
                Download File
              </button>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-600">Pengumuman tidak ditemukan.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default PengumumanPage;
