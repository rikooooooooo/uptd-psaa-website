import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Form3({ userId }) {
  const [formData, setFormData] = useState({
    hubungan_masyarakat: "",
    semangat_kegiatan_sosial: "",
    ibadah_anak: "",
    ibadah_bapak: "",
    ibadah_ibu: "",
    anak_ibadah_sering: "",
    bapak_ibadah_sering: "",
    ibu_ibadah_sering: "",
    baca_quran_anak: "",
    baca_quran_bapak: "",
    baca_quran_ibu: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Toggle between upload and update

  // Fetch data by user_id when the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/api/hubungan_sosial_ibadah/user/${userId}`);
        if (response.data) {
          setFormData(response.data); // Pre-fill the form with fetched data
          setIsEditMode(true); // Set to update mode
        } else {
          setIsEditMode(false); // Set to upload mode
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // toast.error("Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (isEditMode) {
        // Update existing data
        await axios.put(`http://localhost:5000/api/hubungan_sosial_ibadah/${formData.id}`, { ...formData, user_id: userId });
        toast.success("Data berhasil diperbarui");
      } else {
        // Upload new data
        await axios.post("http://localhost:5000/api/hubungan_sosial_ibadah", { ...formData, user_id: userId });
        toast.success("Data berhasil disimpan");
        setIsEditMode(true); // Switch to update mode after upload
      }
    } catch (error) {
      toast.error(isEditMode ? "Gagal memperbarui data" : "Gagal menyimpan data");
      console.error("Error saving data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-6">Form 3: Hubungan Sosial dan Ibadah</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <ClipLoader color="#4A90E2" size={40} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hubungan Masyarakat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hubungan Masyarakat:</label>
            <select
              name="hubungan_masyarakat"
              value={formData.hubungan_masyarakat}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih</option>
              <option value="Sangat">Sangat</option>
              <option value="Cukup">Cukup</option>
              <option value="Kurang">Kurang</option>
            </select>
          </div>

          {/* Semangat Kegiatan Sosial */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semangat Kegiatan Sosial:</label>
            <select
              name="semangat_kegiatan_sosial"
              value={formData.semangat_kegiatan_sosial}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih</option>
              <option value="Sangat">Sangat</option>
              <option value="Cukup">Cukup</option>
              <option value="Kurang">Kurang</option>
            </select>
          </div>

          {/* Ibadah Anak */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ibadah Anak:</label>
            <select
              name="ibadah_anak"
              value={formData.ibadah_anak}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih</option>
              <option value="Rajin">Rajin</option>
              <option value="Sedang">Sedang</option>
              <option value="Kurang">Kurang</option>
            </select>
          </div>

          {/* Ibadah Bapak */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ibadah Bapak:</label>
            <select
              name="ibadah_bapak"
              value={formData.ibadah_bapak}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih</option>
              <option value="Rajin">Rajin</option>
              <option value="Sedang">Sedang</option>
              <option value="Kurang">Kurang</option>
            </select>
          </div>

          {/* Ibadah Ibu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ibadah Ibu:</label>
            <select
              name="ibadah_ibu"
              value={formData.ibadah_ibu}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih</option>
              <option value="Rajin">Rajin</option>
              <option value="Sedang">Sedang</option>
              <option value="Kurang">Kurang</option>
            </select>
          </div>

          {/* Anak Ibadah Sering */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Anak Pelaksanaan Ibadah yang Sering Dilakukan:</label>
            <select
              name="anak_ibadah_sering"
              value={formData.anak_ibadah_sering}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih</option>
              <option value="Berjamah di Masjid/Rumah">Berjamah di Masjid/Rumah</option>
              <option value="Sholat Sendiri Saja">Sholat Sendiri Saja</option>
            </select>
          </div>

          {/* Bapak Ibadah Sering */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bapak Pelaksanaan Ibadah yang Sering Dilakukan:</label>
            <select
              name="bapak_ibadah_sering"
              value={formData.bapak_ibadah_sering}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih</option>
              <option value="Berjamah di Masjid/Rumah">Berjamah di Masjid/Rumah</option>
              <option value="Sholat Sendiri Saja">Sholat Sendiri Saja</option>
            </select>
          </div>

          {/* Ibu Ibadah Sering */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ibu Pelaksanaan Ibadah yang Sering Dilakukan:</label>
            <select
              name="ibu_ibadah_sering"
              value={formData.ibu_ibadah_sering}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih</option>
              <option value="Berjamah di Masjid/Rumah">Berjamah di Masjid/Rumah</option>
              <option value="Sholat Sendiri Saja">Sholat Sendiri Saja</option>
            </select>
          </div>

          {/* Baca Quran Anak */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Anak dalam Baca Al-Qur’an:</label>
            <select
              name="baca_quran_anak"
              value={formData.baca_quran_anak}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih</option>
              <option value="Sangat Baik">Sangat Baik</option>
              <option value="Cukup Baik">Cukup Baik</option>
              <option value="Kurang">Kurang</option>
            </select>
          </div>

          {/* Baca Quran Bapak */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bapak dalam Baca Al-Qur’an:</label>
            <select
              name="baca_quran_bapak"
              value={formData.baca_quran_bapak}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih</option>
              <option value="Sangat Baik">Sangat Baik</option>
              <option value="Cukup Baik">Cukup Baik</option>
              <option value="Kurang">Kurang</option>
            </select>
          </div>

          {/* Baca Quran Ibu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ibu dalam Baca Al-Qur’an:</label>
            <select
              name="baca_quran_ibu"
              value={formData.baca_quran_ibu}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih</option>
              <option value="Sangat Baik">Sangat Baik</option>
              <option value="Cukup Baik">Cukup Baik</option>
              <option value="Kurang">Kurang</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            {isEditMode ? "Perbarui Data" : "Simpan Data"}
          </button>
        </form>
      )}
      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  );
}

export default Form3;