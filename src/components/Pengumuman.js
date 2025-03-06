import React from "react";
import { Link } from "react-router-dom"; // Import Link
import { FaDownload, FaFilePdf } from "react-icons/fa";
import { FiFile } from "react-icons/fi";

function Pengumuman({ announcement }) {
  const handleDownload = () => {
    if (!announcement.file_url) return;

    const link = document.createElement("a");
    link.href = announcement.file_url;
    link.setAttribute("target", "_blank");
    link.setAttribute("download", announcement.title + getFileExtension(announcement.file_url));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileExtension = (url) => {
    if (!url) return "";
    return "." + url.split(".").pop().split(/[#?]/)[0].toLowerCase();
  };

  const renderFilePreview = () => {
    if (!announcement.file_url) return null;

    const extension = getFileExtension(announcement.file_url);

    if (extension === ".pdf") {
      return <FaFilePdf size={50} className="text-red-500" />;
    }
    if ([".jpg", ".jpeg", ".png"].includes(extension)) {
      return (
        <img
          src={announcement.file_url}
          alt="Preview"
          className="w-full h-32 object-cover rounded-md"
        />
      );
    }
    return <FiFile size={50} className="text-gray-500" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{announcement.title}</h2>
      <p className="text-gray-700 mb-4">{announcement.description}</p>

      {announcement.file_url && <div className="mb-4 flex justify-center">{renderFilePreview()}</div>}

      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm">{announcement.date}</span>

        <div className="flex gap-4">
          <Link
            to={`/announcements/${announcement.id}`} // Correctly links to the single announcement page
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Baca Selengkapnya →
          </Link>

          {announcement.file_url && (
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <FaDownload />
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Pengumuman;
