import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import GalleryItem from "./GalleryItem";
import { ClipLoader } from "react-spinners"; // For loading state

const Gallery = ({ isMobile }) => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/media");
        console.log("API Response:", response.data);
        const mediaItems = response.data;

        // Filter for "gallery" type and sort by timestamp (newest first)
        const galleryMedia = mediaItems
          .filter((item) => item.media_type && item.media_type.toLowerCase() === "gallery")
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        console.log("Sorted Gallery Items:", galleryMedia);
        setGalleryItems(galleryMedia);
      } catch (error) {
        console.error("Error fetching gallery items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const nextSlide = () => {
    if (isSliding || galleryItems.length === 0) return;
    setIsSliding(true);
    setTimeout(() => {
      setCurrentStartIndex((prevIndex) => (prevIndex + 1) % galleryItems.length);
      setIsSliding(false);
    }, 300);
  };

  const prevSlide = () => {
    if (isSliding || galleryItems.length === 0) return;
    setIsSliding(true);
    setTimeout(() => {
      setCurrentStartIndex((prevIndex) => (prevIndex - 1 + galleryItems.length) % galleryItems.length);
      setIsSliding(false);
    }, 300);
  };

  // Function to get the current visible items
  const getCurrentItems = () => {
    if (!galleryItems.length) return [];
    const itemsToShow = isMobile ? 1 : 3;
    return Array.from({ length: itemsToShow }, (_, i) => galleryItems[(currentStartIndex + i) % galleryItems.length]).filter(Boolean);
  };

  const currentGalleryItems = getCurrentItems();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <ClipLoader color="#00A85A" size={40} />
      </div>
    );
  }

  if (!galleryItems.length) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-100">
        <p className="text-gray-500">No gallery items available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 my-5 mb-12">
      <h2 className="text-4xl font-bold text-center text-green-600 mb-8">Gallery</h2>
      <div className="relative px-12">
        {galleryItems.length > (isMobile ? 1 : 3) && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#00A85A] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-[#008a4a] transition-colors"
              disabled={isSliding}
              aria-label="Previous Gallery"
            >
              <FaChevronLeft size={16} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#00A85A] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-[#008a4a] transition-colors"
              disabled={isSliding}
              aria-label="Next Gallery"
            >
              <FaChevronRight size={16} />
            </button>
          </>
        )}

        <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "md:grid-cols-3"}`}>
          {currentGalleryItems.map((item, index) => (
            <div
              key={item.id || index}
              className={`transform transition-all duration-300 ease-in-out ${
                isSliding ? "opacity-80 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <GalleryItem item={item} />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/gallery")}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Lihat Semua Foto
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
