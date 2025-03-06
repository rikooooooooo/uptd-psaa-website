import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners"; // For loading state

function Sejarah() {
  const [sejarahImage, setSejarahImage] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch the latest image of type "sejarah" from PostgreSQL via API
  useEffect(() => {
    const fetchSejarahImage = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/media");
        console.log("API Response:", response.data); // Log the response
        const mediaItems = response.data;
  
        // Filter for "sejarah" type and sort by timestamp (newest first)
        const sejarahItems = mediaItems
          .filter((item) => item.media_type && item.media_type.toLowerCase() === "sejarah") // Use `media_type` and handle undefined
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
        console.log("Sorted Sejarah Items:", sejarahItems); // Log the sorted data
  
        // Set the latest image
        if (sejarahItems.length > 0) {
          console.log("Latest Sejarah Image URL:", sejarahItems[0].url); // Log the URL
          setSejarahImage(sejarahItems[0].url);
        } else {
          console.warn("No 'sejarah' items found."); // Log a warning if no items are found
        }
      } catch (error) {
        console.error("Error fetching sejarah image:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchSejarahImage();
  }, []);

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col lg:flex-row items-center">
      {/* Image Section */}
      <div className="lg:w-1/3 w-full mb-6 lg:mb-0 lg:pr-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <ClipLoader color="#00A85A" size={40} />
          </div>
        ) : (
          <img
            src={sejarahImage || "https://via.placeholder.com/400"} // Fallback image
            alt="Sejarah PSAA"
            className="w-full h-auto rounded-lg shadow-md"
          />
        )}
      </div>

      {/* Text Section */}
      <div className="lg:w-2/3 w-full">
        <h2 className="text-3xl font-bold text-center lg:text-left mb-6 text-green-600">
          Sejarah Ringkas
        </h2>
        <div className="space-y-6">
          {/* Section 1 */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Awal Berdiri</h3>
            <p className="text-gray-700 leading-relaxed">
              Panti Sosial Asuhan Anak (PSAA) Tri Murni Padang Panjang berdiri tahun 1947 dengan nama 
              pada saat itu “Panti Asuhan Anak Yatim”. Jumlah kelayan pada saat itu berjumlah 20 orang 
              (Putra & Putri). Bertempat di rumah penduduk di Bukit Surungan, Padang Panjang.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Perpindahan dan Perubahan Nama</h3>
            <p className="text-gray-700 leading-relaxed">
              Pada tahun 1959, panti berpindah tempat ke Maninjau dikarenakan adanya PRRI PERMESTA. 
              Akhir tahun, panti kembali ke Padang Panjang dengan menempati kediaman “Curt Karl Von Michialis”. 
              Di tahun 1979, “Panti Asuhan Anak Yatim” kembali merubah nama menjadi “Sarana Penyantunan Anak (SPA)” 
              Tri Murni dengan kapasitas 30 orang.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Modernisasi dan Pengembangan</h3>
            <p className="text-gray-700 leading-relaxed">
              Tahun 1962, Tri Murni menetapkan hanya mengasuh anak putri. Pada tahun 1995, melalui 
              Keputusan Menteri Sosial RI Nomor 22/HUK/1995 Tanggal 24 April 1995, SPA Tri Murni 
              diganti nama menjadi Panti Sosial Asuhan Anak (PSAA) Tri Murni Padang Panjang. 
              Kapasitas ditingkatkan menjadi 80 orang pada tahun 2002, dan melalui Nota Dinas Gubernur 
              Sumbar No.463/284/Dinsos/2015, kapasitas menjadi 100 orang anak sejak 1 Januari 2016.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sejarah;