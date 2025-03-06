import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Slideshow from "../components/Slideshow";
import NewsCard from "../components/NewsCard";
import Gallery from "../components/Gallery";
import Peta from "../components/Peta";
import Footer from "../components/Footer";
import PengumumanHome from "../components/PengumumanHome";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";

function HomePage() {
  const [news, setNews] = useState([]);
  const [mediaItems, setMediaItems] = useState([]); // State for media items
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Detect mobile screen
    const [navbarHeight, setNavbarHeight] = useState(64); // Example height, adjust as needed

  const navigate = useNavigate();

  // Fetch news from Firestore
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/news");
        console.log("Fetched News Data from PostgreSQL:", response.data); // Debugging
        setNews(response.data);
      } catch (err) {
        console.error("Error fetching news from PostgreSQL:", err);
      }
    };
  
    fetchNews();
  }, []);

    // Fetch media items from API
    useEffect(() => {
      const fetchMediaItems = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/media");
          console.log("Fetched media:", response.data); // Debug log
          setMediaItems(response.data);
        } catch (error) {
          console.error("Error fetching media items:", error);
        }
      };
      fetchMediaItems();
    }, []);

  // Detect screen width changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle next slide for news slider
  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Handle previous slide for news slider
  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + news.length) % news.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Get visible news items for the slider
  const getVisibleNews = () => {
    if (news.length <= 3) return news;

    const visibleNews = [];
    const itemsToShow = isMobile ? 1 : 3; // Show 1 item on mobile, 3 on desktop
    for (let i = 0; i < itemsToShow; i++) {
      visibleNews.push(news[(currentIndex + i) % news.length]);
    }
    return visibleNews;
  };

  // Filter mediaItems for slideshow
  const slideshowItems = mediaItems.filter((item) => item.media_type === "slideshow");
    // console.log("Slideshow Items:", slideshowItems); // Debugging

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        {/* Slideshow Section */}
          <div
            className="w-screen relative overflow-hidden"
            style={{ height: `calc(100vh - ${navbarHeight}px)` }}
          >
            {/* Debugging: Output slideshowItems to the console */}
            {console.log("Slideshow Items passed to Slideshow:", slideshowItems)}
            <Slideshow mediaItems={slideshowItems} />
          </div>

        {/* News Section */}
        <div className="mx-auto px-4 py-12 bg-green-100">
          <h1 className="text-2xl font-bold mb-8 text-center mt-1">Berita Terkini</h1>

          {/* News Slider */}
          <div className="relative px-12">
            {news.length > (isMobile ? 1 : 3) && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#00A85A] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-[#008a4a] transition-colors"
                  disabled={isTransitioning}
                  aria-label="Previous news"
                >
                  <FaChevronLeft size={16} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#00A85A] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-[#008a4a] transition-colors"
                  disabled={isTransitioning}
                  aria-label="Next news"
                >
                  <FaChevronRight size={16} />
                </button>
              </>
            )}

            <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
              {getVisibleNews().map((item) => (
                <div
                  key={item.id}
                  className={`transform transition-all duration-300 ease-in-out ${
                    isTransitioning ? "opacity-80 scale-95" : "opacity-100 scale-100"
                  }`}
                >
                  <NewsCard
                    id={item.id}
                    image={item.image_url} 
                    title={item.title}
                    content={item.content}
                    writer={item.writer}
                    date={item.date}
                  />

                </div>
              ))}
            </div>
          </div>

          {/* Button to All News Page */}
          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/all-news")}
              className="bg-[#00A85A] text-white px-6 py-3 rounded-md hover:bg-[#008a4a] transition-colors"
            >
              Lihat Semua Berita
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <h1 className="text-2xl font-bold mb-8 text-center mt-14">Gallery Kami</h1>
      <Gallery mediaItems={mediaItems.filter((item) => item.type === "gallery")} isMobile={isMobile} />

      {/* Pengumuman */}
      <PengumumanHome isMobile={isMobile} />

      {/* Peta */}
      <Peta />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HomePage;
