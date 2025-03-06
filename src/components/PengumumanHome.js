import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pengumuman from "../components/Pengumuman";
import axios from "axios"; // Import axios for API requests
import { ClipLoader } from "react-spinners"; // Loading state

function PengumumanHome() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Fetch announcements from PostgreSQL API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/announcements");

        // Sort by timestamp (newest first) and get the latest 3 announcements
        const sortedAnnouncements = response.data
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 3);

        setAnnouncements(sortedAnnouncements);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="bg-blue-100 py-8 px-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Pengumuman Terbaru</h2>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-20">
          <ClipLoader color="#00A85A" size={30} />
        </div>
      ) : (
        <>
          {/* Announcements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <Pengumuman key={announcement.id} announcement={announcement} />
              ))
            ) : (
              <p className="text-gray-600 col-span-full text-center">
                Tidak ada pengumuman yang tersedia.
              </p>
            )}
          </div>

          {/* Button to All Announcements Page */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate("/allpengumuman")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Lihat Semua Pengumuman
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PengumumanHome;
