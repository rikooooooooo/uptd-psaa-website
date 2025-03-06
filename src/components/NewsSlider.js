import React, { useState, useEffect } from "react";
import NewsCard from "./NewsCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import axios from "axios";

function NewsSlider() {
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [sortedNews, setSortedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch news data from PostgreSQL
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/news");
        const newsData = response.data;

        // Sort news by timestamp and date
        const sorted = newsData.sort((a, b) => {
          const dateA = new Date(a.timestamp || a.date);
          const dateB = new Date(b.timestamp || b.date);
          return dateB - dateA;
        });

        setSortedNews(sorted);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Failed to fetch news. Please try again later.");
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const nextSlide = () => {
    if (isSliding) return;
    setIsSliding(true);
    setTimeout(() => {
      setCurrentStartIndex((prevIndex) => (prevIndex + 1) % sortedNews.length);
      setIsSliding(false);
    }, 250);
  };

  const prevSlide = () => {
    if (isSliding) return;
    setIsSliding(true);
    setTimeout(() => {
      setCurrentStartIndex((prevIndex) =>
        (prevIndex - 1 + sortedNews.length) % sortedNews.length
      );
      setIsSliding(false);
    }, 250);
  };

  const getCurrentNews = () => {
    if (!sortedNews.length) return [];
    const items = [];
    for (let i = 0; i < 3; i++) {
      if ((currentStartIndex + i) < sortedNews.length) {
        items.push(sortedNews[currentStartIndex + i]);
      }
    }
    return items;
  };

  const currentNews = getCurrentNews();

  if (loading) {
    return (
      <div className="w-full py-16 px-4 bg-gray-100 rounded-lg shadow-md">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Loading News...
          </h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-16 px-4 bg-gray-100 rounded-lg shadow-md">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading News
          </h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!sortedNews.length) {
    return (
      <div className="w-full py-16 px-4 bg-gray-100 rounded-lg shadow-md">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Belum Ada Berita
          </h3>
          <p className="text-gray-600">
            Saat ini belum ada berita yang ditampilkan. Silakan kembali lagi nanti.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gray-100 py-8 px-6 rounded-lg shadow-md">
      {/* News cards container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentNews.map((item, index) => (
          <div
            key={index}
            className={`transform transition-all duration-500 ease-in-out ${
              isSliding ? "scale-95 opacity-80" : "scale-100 opacity-100"
            }`}
          >
            <NewsCard
              id={item.id}
              image={item.image_url} // Ensure this matches the PostgreSQL column name
              title={item.title}
              writer={item.writer}
              date={item.date}
            />
          </div>
        ))}
      </div>

      {/* Navigation buttons - only show if there are more than 3 news items */}
      {sortedNews.length > 3 && (
        <>
          <div className="absolute top-1/2 left-0 -translate-y-1/2 z-10">
            <button
              onClick={prevSlide}
              className="bg-[#00A85A] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-[#008a4a] transition-colors"
              aria-label="Previous news"
              disabled={isSliding}
            >
              <FaArrowLeft />
            </button>
          </div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 z-10">
            <button
              onClick={nextSlide}
              className="bg-[#00A85A] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-[#008a4a] transition-colors"
              aria-label="Next news"
              disabled={isSliding}
            >
              <FaArrowRight />
            </button>
          </div>
        </>
      )}

      {/* Page indicator */}
      {sortedNews.length > 3 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.ceil(sortedNews.length / 3) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStartIndex(index * 3)}
              className={`w-2 h-2 rounded-full transition-all ${
                Math.floor(currentStartIndex / 3) === index
                  ? "bg-[#00A85A] w-4"
                  : "bg-gray-300"
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default NewsSlider;