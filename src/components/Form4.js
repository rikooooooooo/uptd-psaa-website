import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Form4 = ({ userId }) => {
  const [formData, setFormData] = useState({
    nomor_kk: "",
    nomor_pendaftaran: "",
    nisn: "",
    nama: "",
    tempat_tanggal_lahir: "",
    nik: "",
    agama: "Islam",
    berat_badan: "",
    tinggi_badan: "",
    pendidikan_masuk_panti: "",
    nomor_bpjs: "",
    status: "",
    daerah_asal_kabupaten: "",
    nama_ayah: "",
    nik_ayah: "",
    agama_ayah: "Islam",
    pendidikan_ayah: "",
    pekerjaan_ayah: "",
    status_ayah: "",
    nama_ibu: "",
    nik_ibu: "",
    agama_ibu: "Islam",
    pendidikan_ibu: "",
    pekerjaan_ibu: "",
    nomor_hp: "",
    sdn: "",
    sltp: "",
    slta: "",
    khatam_quran: "",
    prestasi_1: "",
    prestasi_2: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/api/data_pendaftaran/user/${userId}`);
        // console.log("API Response:", response); // Log the entire response
        if (response.data) {
          console.log("Fetched Data:", response.data); // Log the fetched data
          setFormData(response.data); // Pre-fill the form with fetched data
          setIsEditMode(true); // Set to update mode
        } else {
          console.log("No data found for user ID:", userId); // Log if no data is found
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

  // Fetch data by user_id when the component mounts
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       setIsLoading(true);
  //       const response = await axios.get(`http://localhost:5000/api/data_pendaftaran/user/${userId}`);
  //       if (response.data) {
  //         setFormData(response.data); // Pre-fill the form with fetched data
  //         setIsEditMode(true); // Set to update mode
  //       } else {
  //         setIsEditMode(false); // Set to upload mode
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       toast.error("Gagal memuat data");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   fetchData();
  // }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (isEditMode) {
        // Update existing data
        await axios.put(`http://localhost:5000/api/data_pendaftaran/${formData.id}`, { ...formData, user_id: userId });
        toast.success("Data berhasil diperbarui");
      } else {
        // Upload new data
        await axios.post("http://localhost:5000/api/data_pendaftaran", { ...formData, user_id: userId });
        toast.success("Data berhasil disimpan");
        setIsEditMode(true); // Switch to update mode after upload
      }
    } catch (error) {
      // toast.error(isEditMode ? "Gagal memperbarui data" : "Gagal menyimpan data");
      console.error("Error saving data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
    <h2 className="text-xl font-bold mb-6">Form 4: Data Pendaftaran</h2>
    {isLoading ? (
      <div className="flex justify-center items-center h-32">
        <ClipLoader color="#4A90E2" size={40} />
      </div>
    ) : (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Data Pendaftaran */}
      <div>
        <h2 className="text-xl font-bold mb-4">Data Pendaftaran</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor KK:</label>
            <input
              name="nomor_kk"
              value={formData.nomor_kk}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Pendaftaran:</label>
            <input
              name="nomor_pendaftaran"
              value={formData.nomor_pendaftaran}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NISN:</label>
            <input
              name="nisn"
              value={formData.nisn}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama:</label>
            <input
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tempat, Tanggal Lahir:</label>
            <input
              name="tempat_tanggal_lahir"
              value={formData.tempat_tanggal_lahir}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIK:</label>
            <input
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agama:</label>
            <select
              name="agama"
              value={formData.agama}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Islam">Islam</option>
              <option value="Kristen">Kristen</option>
              <option value="Katolik">Katolik</option>
              <option value="Hindu">Hindu</option>
              <option value="Buddha">Buddha</option>
              <option value="Konghucu">Konghucu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Berat Badan:</label>
            <input
              name="berat_badan"
              value={formData.berat_badan}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tinggi Badan:</label>
            <input
              name="tinggi_badan"
              value={formData.tinggi_badan}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pendidikan Masuk Panti:</label>
            <input
              name="pendidikan_masuk_panti"
              value={formData.pendidikan_masuk_panti}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor BPJS:</label>
            <input
              name="nomor_bpjs"
              value={formData.nomor_bpjs}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
            <input
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Daerah Asal Kabupaten:</label>
            <input
              name="daerah_asal_kabupaten"
              value={formData.daerah_asal_kabupaten}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Data Orang Tua / Wali */}
      <div>
        <h2 className="text-xl font-bold mb-4">Data Orang Tua / Wali</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ayah:</label>
            <input
              name="nama_ayah"
              value={formData.nama_ayah}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIK Ayah:</label>
            <input
              name="nik_ayah"
              value={formData.nik_ayah}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agama Ayah:</label>
            <select
              name="agama_ayah"
              value={formData.agama_ayah}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Islam">Islam</option>
              <option value="Kristen">Kristen</option>
              <option value="Katolik">Katolik</option>
              <option value="Hindu">Hindu</option>
              <option value="Buddha">Buddha</option>
              <option value="Konghucu">Konghucu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pendidikan Ayah:</label>
            <input
              name="pendidikan_ayah"
              value={formData.pendidikan_ayah}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan Ayah:</label>
            <input
              name="pekerjaan_ayah"
              value={formData.pekerjaan_ayah}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Ayah:</label>
            <input
              name="status_ayah"
              value={formData.status_ayah}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ibu:</label>
            <input
              name="nama_ibu"
              value={formData.nama_ibu}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIK Ibu:</label>
            <input
              name="nik_ibu"
              value={formData.nik_ibu}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agama Ibu:</label>
            <select
              name="agama_ibu"
              value={formData.agama_ibu}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Islam">Islam</option>
              <option value="Kristen">Kristen</option>
              <option value="Katolik">Katolik</option>
              <option value="Hindu">Hindu</option>
              <option value="Buddha">Buddha</option>
              <option value="Konghucu">Konghucu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pendidikan Ibu:</label>
            <input
              name="pendidikan_ibu"
              value={formData.pendidikan_ibu}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan Ibu:</label>
            <input
              name="pekerjaan_ibu"
              value={formData.pekerjaan_ibu}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP:</label>
            <input
              name="nomor_hp"
              value={formData.nomor_hp}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Riwayat Pendidikan Anak */}
      <div>
        <h2 className="text-xl font-bold mb-4">Riwayat Pendidikan Anak</h2>
        {/* {formData.pendidikan.map((pendidikan, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenjang:</label>
              <input
                value={pendidikan.jenjang}
                onChange={(e) => handlePendidikanChange(index, "jenjang", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sekolah:</label>
              <input
                value={pendidikan.namaSekolah}
                onChange={(e) => handlePendidikanChange(index, "namaSekolah", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))} */}
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SDN:</label>
            <input
              name="sdn"
              value={formData.sdn}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SLTP:</label>
            <input
              name="sltp"
              value={formData.sltp}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SLTA:</label>
            <input
              name="slta"
              value={formData.slta}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Khatam Quran:</label>
            <input
              name="khatam_quran"
              value={formData.khatam_quran}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prestasi 1:</label>
            <input
              name="prestasi_1"
              value={formData.prestasi_1}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prestasi 2:</label>
            <input
              name="prestasi_2"
              value={formData.prestasi_2}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
};

export default Form4;