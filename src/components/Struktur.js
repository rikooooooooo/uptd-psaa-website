import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners"; // For loading state

function Struktur() {
  const [strukturImage, setStrukturImage] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch the latest image of type "struktur" from PostgreSQL via API
  useEffect(() => {
    const fetchStrukturImage = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/media");
        console.log("API Response:", response.data); // Log the response
        const mediaItems = response.data;

        // Filter for "struktur" type and sort by timestamp (newest first)
        const strukturItems = mediaItems
          .filter((item) => item.media_type && item.media_type.toLowerCase() === "struktur") // Use `media_type` safely
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        console.log("Sorted Struktur Items:", strukturItems); // Log the sorted data

        // Set the latest image
        if (strukturItems.length > 0) {
          console.log("Latest Struktur Image URL:", strukturItems[0].url); // Log the URL
          setStrukturImage(strukturItems[0].url);
        } else {
          console.warn("No 'struktur' items found."); // Log a warning if no items are found
        }
      } catch (error) {
        console.error("Error fetching struktur image:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchStrukturImage();
  }, []);

  return (
    <div>
      {/* Title */}
      <h2 className="text-4xl font-bold text-center text-green-600 mb-8">
        Struktur Organisasi
      </h2>
      <div className="flex justify-center">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <ClipLoader color="#00A85A" size={40} />
          </div>
        ) : (
          <img
            src={strukturImage || "https://via.placeholder.com/400"} // Fallback image
            alt="Struktur Organisasi"
            className="mx-auto rounded-lg shadow-md"
          />
        )}
      </div>
    </div>
  );
}

export default Struktur;
