import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Form2({ userId }) {
  const [formData, setFormData] = useState({
    gambaran_rumah: "",
    status_rumah: "Milik Sendiri",
    penghasilan_bulanan: "",
    pengeluaran_bulanan: "",
    perabotan: "",
    tempat_bekerja: "",
    sumber_pendapatan: "Bapak saja",
    jarak_sd: "",
    jarak_sltp: "",
    jarak_slta: "",
    jarak_pusat_keramaian: "",
    kunjungan_pasar_orang_tua: "1",
    kunjungan_pasar_anak: "1",
    sanitasi: "WC Umum",
    makanan_suka: "",
    makanan_tidak_suka: "",
    dukungan_pendidikan_orang_tua: false,
    dukungan_pendidikan_mamak: false,
    dukungan_pendidikan_saudara_ibu: false,
    dukungan_pendidikan_saudara_bapak: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Toggle between upload and update

  // Fetch data by user_id when the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/api/kondisi_ekonomi/user/${userId}`);
        if (response.data) {
          setFormData(response.data); // Pre-fill the form with fetched data
          setIsEditMode(true); // Set to update mode
        } else {
          setIsEditMode(false); // Set to upload mode
        }
      } catch (error) {
        console.error("Error fetching data", error);
        // toast.error("Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (isEditMode) {
        // Update existing data
        await axios.put(`http://localhost:5000/api/kondisi_ekonomi/${formData.id}`, { ...formData, user_id: userId });
        toast.success("Data berhasil diperbarui");
      } else {
        // Upload new data
        await axios.post("http://localhost:5000/api/kondisi_ekonomi", { ...formData, user_id: userId });
        toast.success("Data berhasil disimpan");
        setIsEditMode(true); // Switch to update mode after upload
      }
    } catch (error) {
      toast.error(isEditMode ? "Gagal memperbarui data" : "Gagal menyimpan data");
      console.error("Error saving data", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Form 2: Kondisi Ekonomi</h2>
      {isLoading ? (
        <div className="flex justify-center py-4">
          <ClipLoader color="#4A90E2" size={30} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gambaran Rumah */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gambaran Rumah / Tempat Tinggal:</label>
            <input
              type="text"
              name="gambaran_rumah"
              value={formData.gambaran_rumah}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Rumah */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Rumah:</label>
            <select
              name="status_rumah"
              value={formData.status_rumah}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Milik Sendiri">Milik Sendiri</option>
              <option value="Sewa">Sewa</option>
              <option value="Numpang">Numpang</option>
            </select>
          </div>

          {/* Penghasilan dan Pengeluaran */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Penghasilan / Pengeluaran per Bulan:</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="penghasilan_bulanan"
                value={formData.penghasilan_bulanan}
                onChange={handleChange}
                placeholder="Penghasilan"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="pengeluaran_bulanan"
                value={formData.pengeluaran_bulanan}
                onChange={handleChange}
                placeholder="Pengeluaran"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Perabotan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Perabotan Alat Rumah Tangga yang Dimiliki:</label>
            <input
              type="text"
              name="perabotan"
              value={formData.perabotan}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tempat Bekerja */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tempat Bekerja:</label>
            <input
              type="text"
              name="tempat_bekerja"
              value={formData.tempat_bekerja}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sumber Pendapatan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sumber Pendapatan:</label>
            <select
              name="sumber_pendapatan"
              value={formData.sumber_pendapatan}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Bapak saja">Bapak saja</option>
              <option value="Ibu saja">Ibu saja</option>
              <option value="Keluarga">Keluarga</option>
            </select>
          </div>

          {/* Jarak Tempuh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jarak Tempuh ke Sekolah dan Pusat Keramaian:</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="jarak_sd"
                value={formData.jarak_sd}
                onChange={handleChange}
                placeholder="Jarak SD (km)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="jarak_sltp"
                value={formData.jarak_sltp}
                onChange={handleChange}
                placeholder="Jarak SLTP (km)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="jarak_slta"
                value={formData.jarak_slta}
                onChange={handleChange}
                placeholder="Jarak SLTA (km)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="jarak_pusat_keramaian"
                value={formData.jarak_pusat_keramaian}
                onChange={handleChange}
                placeholder="Jarak Pusat Keramaian (km)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Sanitasi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sanitasi Keluarga:</label>
            <select
              name="sanitasi"
              value={formData.sanitasi}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="WC Umum">WC Umum</option>
              <option value="Sungai">Sungai</option>
              <option value="Rumah Sendiri">Rumah Sendiri</option>
            </select>
          </div>

          {/* Makanan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Makanan yang Disukai oleh Anak:</label>
            <input
              type="text"
              name="makanan_suka"
              value={formData.makanan_suka}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Makanan yang Tidak Disukai oleh Anak:</label>
            <input
              type="text"
              name="makanan_tidak_suka"
              value={formData.makanan_tidak_suka}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Dukungan Pendidikan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dukungan Keluarga terhadap Pendidikan Anak:</label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="dukungan_pendidikan_orang_tua"
                  checked={formData.dukungan_pendidikan_orang_tua}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 text-blue-500"
                />
                <span>Orang Tua</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="dukungan_pendidikan_mamak"
                  checked={formData.dukungan_pendidikan_mamak}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 text-blue-500"
                />
                <span>Mamak/Paman</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="dukungan_pendidikan_saudara_ibu"
                  checked={formData.dukungan_pendidikan_saudara_ibu}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 text-blue-500"
                />
                <span>Saudara Ibu</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="dukungan_pendidikan_saudara_bapak"
                  checked={formData.dukungan_pendidikan_saudara_bapak}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 text-blue-500"
                />
                <span>Saudara Bapak</span>
              </label>
            </div>
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

export default Form2;