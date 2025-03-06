import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Axios for API calls
import Pengumuman from "../components/Pengumuman";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ClipLoader from "react-spinners/ClipLoader";

function AllPengumumanPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const announcementsPerPage = 9;
  const navigate = useNavigate();

  // Fetch announcements from PostgreSQL API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/announcements"); // Adjust API URL if needed
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // Filter announcements based on search query
  const filteredAnnouncements = announcements.filter((announcement) =>
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(
    indexOfFirstAnnouncement,
    indexOfLastAnnouncement
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredAnnouncements.length / announcementsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Daftar Pengumuman</h1>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari pengumuman berdasarkan judul"
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
            {/* Announcements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentAnnouncements.length > 0 ? (
                currentAnnouncements.map((announcement) => (
                  <div
                    key={announcement.id}
                    onClick={() => navigate(`/announcements/${announcement.id}`)}
                    className="cursor-pointer"
                  >
                    <Pengumuman announcement={announcement} />
                  </div>
                ))
              ) : (
                <p className="text-gray-600 col-span-full text-center">
                  Tidak ada pengumuman yang tersedia.
                </p>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-4">
                {/* Previous Button */}
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

                {/* Page Numbers */}
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

                {/* Next Button */}
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
    </div>
  );
}

export default AllPengumumanPage;
