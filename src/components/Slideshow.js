import React, { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa";
import axios from "axios";

const Slideshow = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/media");
        console.log("Fetched media:", response.data); // Debug log
        const slideshowItems = response.data.filter(item => item.media_type === "slideshow");
        setMediaItems(slideshowItems);
        console.log("Filtered Slideshow Items:", slideshowItems);

      } catch (error) {
        console.error("Error fetching media items:", error);
      }
    };
    fetchMediaItems();
  }, []);
  

  useEffect(() => {
    if (isAutoPlay && mediaItems.length > 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
      }, 5000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, isAutoPlay, mediaItems]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
    );
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === mediaItems.length - 1 ? 0 : prevIndex + 1
    );
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!mediaItems || mediaItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <p className="text-white text-xl">No slideshow media available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-screen h-screen overflow-hidden">
      <div className="relative w-full h-full"> {/* Removed bg-gray-900 here! */}
        {mediaItems[currentIndex].url?.match(/\.(mp4|webm|ogg)$/) ? (
          <div className="relative w-full h-full" onClick={togglePlay}>
            <video
              ref={videoRef}
              key={mediaItems[currentIndex].url}
              src={mediaItems[currentIndex].url}
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
              {!isPlaying && (
                <div className="bg-black/30 rounded-full p-6">
                  <FaPlay className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
          </div>
        ) : (
          <img
            src={mediaItems[currentIndex].url}
            alt={mediaItems[currentIndex].title}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-y-0 left-0 flex items-center">
          <button
            onClick={handlePrevious}
            className="ml-4 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all hover:scale-110"
          >
            <FaChevronLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            onClick={handleNext}
            className="mr-4 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all hover:scale-110"
          >
            <FaChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute bottom-12 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
          <h2 className="text-white text-2xl font-bold mb-2">
            {mediaItems[currentIndex].title}
          </h2>
          <p className="text-white/90">
            {mediaItems[currentIndex].description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Slideshow;
