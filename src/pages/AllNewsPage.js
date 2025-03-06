import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NewsCard from "../components/NewsCard";

function AllNewsPage() {
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const newsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/news");
        if (!response.ok) throw new Error("Failed to fetch news");
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const filteredNews = news.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.writer.toLowerCase().includes(query)
    );
  });

  const paginatedNews = () => {
    const startIndex = (currentPage - 1) * newsPerPage;
    return filteredNews.slice(startIndex, startIndex + newsPerPage);
  };

  const totalPages = Math.ceil(filteredNews.length / newsPerPage);

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-center mb-8 mt-10">Semua Berita</h1>
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan judul atau penulis..."
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-600">Memuat berita...</p>
          </div>
        ) : (
          <>
            {filteredNews.length === 0 ? (
              <div className="text-center text-gray-500">
                <p>Berita tidak ditemukan</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {paginatedNews().map((item) => (
                  <NewsCard
                    key={item.id}
                    id={item.id}
                    image={item.image_url} // Use image_url from PostgreSQL
                    title={item.title}
                    writer={item.writer}
                    date={item.date}
                  />
                ))}
              </div>
            )}
            <div className="flex justify-center mt-6 space-x-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-gray-300 text-black px-4 py-2 rounded w-24 hover:bg-gray-400 transition disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-lg font-medium">{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-gray-300 text-black px-4 py-2 rounded w-24 hover:bg-gray-400 transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default AllNewsPage;
