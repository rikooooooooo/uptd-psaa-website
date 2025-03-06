import React, { useEffect, useState } from "react";
import axios from "axios";
import GalleryItem from "../components/GalleryItem"; // Gallery item component
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ClipLoader from "react-spinners/ClipLoader";

function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null); // For modal
  const [open, setOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const itemsPerPage = 9;

  // Fetch gallery items from PostgreSQL
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/media");
        const mediaItems = response.data;
        const galleryMedia = mediaItems
          .filter((item) => item.media_type && item.media_type.toLowerCase() === "gallery")
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setGalleryItems(galleryMedia);
      } catch (error) {
        console.error("Error fetching gallery items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryItems();
  }, []);

  // Filter gallery items based on search query
  const filteredGalleryItems = galleryItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGalleryItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGalleryItems.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleMediaClick = (item) => {
    console.log("Selected Item:", item); // Debugging
    setSelectedItem(item);
    setOpen(true);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Daftar Galeri</h1>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari galeri berdasarkan judul"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <ClipLoader color="#00A85A" size={40} />
          </div>
        ) : (
          <>
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <div key={item.id} onClick={() => handleMediaClick(item)}>
                    <GalleryItem item={item} />
                  </div>
                ))
              ) : (
                <p className="text-gray-600 col-span-full text-center">
                  Tidak ada galeri yang tersedia.
                </p>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : currentPage)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Previous
                </button>

                <div className="flex space-x-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className={`w-10 h-10 rounded-full ${
                        currentPage === index + 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : currentPage)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />

      {/* Enhanced Modal */}
      {open && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-8 right-0 text-white text-3xl hover:text-gray-300 z-50"
            >
              ✖
            </button>
            <div className="p-4 flex flex-col items-center">
              {imageLoading && <ClipLoader color="#00A85A" size={40} />}
              {selectedItem.url?.endsWith(".mp4") ? (
                <video
                  controls
                  autoPlay
                  className="w-full max-h-[70vh] rounded-lg"
                  src={selectedItem.url}
                  onLoadedData={() => setImageLoading(false)}
                />
              ) : (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  className={`w-full max-h-[70vh] object-contain rounded-lg ${imageLoading ? 'hidden' : ''}`}
                  onLoad={() => setImageLoading(false)}
                />
              )}
              <div className="mt-4 text-center">
                <h2 className="text-2xl font-bold mb-2">{selectedItem.title}</h2>
                <p className="text-gray-600 mb-2">{selectedItem.description}</p>
                <p className="text-sm text-gray-500">Oleh: {selectedItem.author}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryPage;
