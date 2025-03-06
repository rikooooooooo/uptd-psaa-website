import React from "react";
import { FaEye, FaBullseye, FaTasks } from "react-icons/fa"; // Importing icons

function VisiMisi() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
      {/* Title */}
      <h2 className="text-4xl font-bold text-center text-green-600 mb-8">Visi dan Misi</h2>

      {/* Split Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        {/* Visi Section */}
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaEye className="mr-2 text-green-600" /> Visi
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Terwujudnya Kesejahteraan Sosial Anak Asuh yang Mandiri.
          </p>
        </div>

        {/* Misi Section */}
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaBullseye className="mr-2 text-green-600" /> Misi
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 leading-relaxed">
            <li>Meningkatkan Keimanan dan Ketaqwaan kepada Tuhan Yang Maha Esa.</li>
            <li>Meningkatkan fasilitas sarana dan prasarana pendidikan dan pelatihan.</li>
            <li>Mengembangkan bentuk dan materi pembinaan dalam Panti.</li>
            <li>
              Meningkatkan koordinasi dengan instansi terkait, dunia usaha, keluarga, dan
              masyarakat.
            </li>
            <li>
              Meningkatkan aturan dan ketentuan dalam rangka menciptakan ketertiban, kenyamanan,
              dan sopan santun anak asuh.
            </li>
            <li>Meningkatkan kemampuan dan kemauan anak asuh dalam mengikuti pembinaan.</li>
          </ul>
        </div>
      </div>

      {/* Maksud dan Tujuan Section */}
        <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaTasks className="mr-2 text-green-600" /> Maksud dan Tujuan
        </h3>
        <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column (First 4 points) */}
            <ol className="flex-1 list-decimal pl-6 space-y-2 text-gray-700 leading-relaxed">
            <li>Tersedianya Pelayanan / Penyantunan Anak Asuh dalam Panti.</li>
            <li>Terpenuhinya kebutuhan Dasar Anak Asuh.</li>
            <li>
                Terpenuhinya Pendidikan Dasar, Menengah, dan Tingkat Atas (Menunjang Program Nasional
                Wajib Belajar 12 Tahun).
            </li>
            <li>
                Terbentuknya Sikap Mental, Budi Pekerti, Keterampilan, dan Kepribadian Sosial Anak
                Asuh.
            </li>
            </ol>

            {/* Right Column (Remaining points) */}
            <ol start="5" className="flex-1 list-decimal pl-6 space-y-2 text-gray-700 leading-relaxed">
            <li>
                Terbentuknya Jaringan Kerja dan Sistem Informasi Pelayanan Kesejahteraan Sosial.
            </li>
            <li>
                Menumbuhkan dan meningkatkan semangat belajar dan keterampilan kerja dengan harapan
                mereka dapat mandiri di masa depan.
            </li>
            <li>
                Menciptakan anak-anak putri yang sesuai dengan bangsa, terampil di bidang ilmu
                pengetahuan umum dan baik dalam bidang Aqidah, Mental, serta Spiritual, dan juga
                terampil di bidang Menjahit, Membordir, maupun Boga.
            </li>
            </ol>
        </div>
        </div>


      {/* Tugas Pokok and Fungsi Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        {/* Tugas Pokok Section */}
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaTasks className="mr-2 text-green-600" /> Tugas Pokok
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Memberikan layanan kesejahteraan sosial kepada anak terlantar, miskin, yatim, piatu,
            dan yatim piatu melalui penyantunan dan pelayanan berupa fisik, mental, sosial budaya,
            dan keterampilan sehingga anak dapat tumbuh dan berkembang secara wajar.
          </p>
        </div>

        {/* Fungsi Section */}
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaTasks className="mr-2 text-green-600" /> Fungsi
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 leading-relaxed">
            <li>
              <strong>Fungsi Penyantunan:</strong> Mengembalikan dan menanamkan fungsi sosial anak
              asuh termasuk pemeliharaan fisik, penyesuaian sosial, dan psikologis.
            </li>
            <li>
              <strong>Fungsi Perlindungan:</strong> Menghindarkan anak dari keterlambatan,
              perlakuan kejam, dan eksploitasi oleh orang tua.
            </li>
            <li>
              <strong>Fungsi Pengembangan:</strong> Mencakup kegiatan yang sifatnya mengembangkan
              potensi anak asuh sesuai dengan situasi dan kondisi lingkungan.
            </li>
            <li>
              <strong>Fungsi Pencegahan:</strong> Ditujukan pada lingkungan sosial anak asuh agar
              mereka terhindar dari pola perilaku menyimpang.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default VisiMisi;
