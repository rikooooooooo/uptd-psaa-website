import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Form1 = ({ userNik, userId }) => {
  const [calonKelayan, setCalonKelayan] = useState({
    id: userId || "",
    nama: "",
    nik: userNik || "", // Initialize with userNik if provided
    tempat_lahir: "",
    tanggal_lahir: "",
    pendidikan_terakhir: "",
    ranking: "",
    total_siswa: "",
    tinggal_kelas: false,
    jumlah_saudara: "",
    anak_ke: "",
    tinggi_badan: "",
    berat_badan: "",
    kebiasaan: "",
    alamat: "",
  });

  const [orangTua, setOrangTua] = useState({
    ayah: {
      nama: "",
      nik: "",
      nama_kecil: "",
      jumlah_saudara: "",
      pendidikan: "",
      pekerjaan: "",
      alamat: "",
      no_hp: "",
    },
    ibu: {
      nama: "",
      nik: "",
      nama_kecil: "",
      jumlah_saudara: "",
      pendidikan: "",
      pekerjaan: "",
      alamat: "",
      no_hp: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasDataAnak, setHasDataAnak] = useState(false);

  const fetchUserData = async () => {
    try {
      try {
        // First, try to fetch from data_anak
        const response = await axios.get(`http://localhost:5000/api/data_anak/${calonKelayan.nik}`);
        const userData = response.data;

        if (userData) {
          setCalonKelayan((prev) => ({
            ...prev,
            ...userData,
            tanggal_lahir: userData.tanggal_lahir
              ? new Date(userData.tanggal_lahir).toISOString().split("T")[0]
              : "",
          }));
          setHasDataAnak(true);

          // Fetch orang_tua data using user_id
          const orangTuaResponse = await axios.get(`http://localhost:5000/api/orang_tua/${userData.id}`);
          const orangTuaData = orangTuaResponse.data;

          if (orangTuaData.length > 0) {
            const ayah = orangTuaData.find((item) => item.jenis === "Ayah") || {};
            const ibu = orangTuaData.find((item) => item.jenis === "Ibu") || {};

            setOrangTua({
              ayah: {
                nama: ayah.nama || "",
                nik: ayah.nik || "",
                nama_kecil: ayah.nama_kecil || "",
                jumlah_saudara: ayah.jumlah_saudara || "",
                pendidikan: ayah.pendidikan || "",
                pekerjaan: ayah.pekerjaan || "",
                alamat: ayah.alamat || "",
                no_hp: ayah.no_hp || "",
              },
              ibu: {
                nama: ibu.nama || "",
                nik: ibu.nik || "",
                nama_kecil: ibu.nama_kecil || "",
                jumlah_saudara: ibu.jumlah_saudara || "",
                pendidikan: ibu.pendidikan || "",
                pekerjaan: ibu.pekerjaan || "",
                alamat: ibu.alamat || "",
                no_hp: ibu.no_hp || "",
              },
            });
          }
        } else {
          setHasDataAnak(false);
        }
      } catch (dataAnakError) {
        // If data_anak not found, try to fetch from users
        try {
          const userResponse = await axios.get(`http://localhost:5000/api/users/nik/${calonKelayan.nik}`);
          const userData = userResponse.data;

          if (userData) {
            // Partially fill the calonKelayan state with available user data
            setCalonKelayan((prev) => ({
              ...prev,
              id: userData.id,
              nama: userData.nama || prev.nama,
              nik: userData.nik,
              username: userData.username,
            }));
            setHasDataAnak(false);
          }
        } catch (userError) {
          console.error("Error fetching user data:", userError);
          // Optionally show a toast or handle the error
        }
      }
    } catch (error) {
      console.error("Unexpected error in fetchUserData:", error);
    }
  };

  useEffect(() => {
    if (calonKelayan.nik) {
      fetchUserData();
    }
  }, [calonKelayan.nik]); // Trigger fetch when calonKelayan.nik changes

  const handleCalonKelayanChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCalonKelayan((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOrangTuaChange = (e, jenis) => {
    const { name, value } = e.target;
    setOrangTua((prev) => ({
      ...prev,
      [jenis]: {
        ...prev[jenis],
        [name]: value,
      },
    }));
  };

  const formatDateForBackend = (dateString) => {
    return dateString ? new Date(dateString).toISOString().split("T")[0] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    // Validate NIK field
    if (calonKelayan.nik.length !== 16 || !/^\d+$/.test(calonKelayan.nik)) {
      toast.error("NIK tidak 16 angka");
      setIsLoading(false);
      return;
    }
  
    try {
      const calonKelayanData = {
        ...calonKelayan,
        id: calonKelayan.id || userId, // Use userId if calonKelayan.id is not set
        tanggal_lahir: formatDateForBackend(calonKelayan.tanggal_lahir),
      };
  
      let calonKelayanResponse;
      if (hasDataAnak) {
        // Update existing data
        calonKelayanResponse = await axios.put(
          `http://localhost:5000/api/data_anak/${calonKelayan.nik}`,
          calonKelayanData
        );
      } else {
        // Create new data
        calonKelayanResponse = await axios.post(`http://localhost:5000/api/data_anak`, calonKelayanData);
      }
  
      const userIdFromResponse = calonKelayanResponse.data.id; // Assuming API returns ID
  
      // Check if orang_tua data already exists
      const existingOrangTuaResponse = await axios.get(`http://localhost:5000/api/orang_tua/${userIdFromResponse}`);
      const existingOrangTua = existingOrangTuaResponse.data;
  
      // Prepare requests for Ayah and Ibu
      const requests = [];
  
      ["ayah", "ibu"].forEach((jenis) => {
        const existingData = existingOrangTua.find((item) => item.jenis === (jenis === "ayah" ? "Ayah" : "Ibu"));
        const orangTuaPayload = {
          user_id: userIdFromResponse, // Use userIdFromResponse
          jenis: jenis === "ayah" ? "Ayah" : "Ibu",
          ...orangTua[jenis],
        };
  
        if (existingData) {
          requests.push(axios.put(`http://localhost:5000/api/orang_tua/${existingData.id}`, orangTuaPayload));
        } else {
          requests.push(axios.post(`http://localhost:5000/api/orang_tua`, orangTuaPayload));
        }
      });
  
      await Promise.all(requests);
      toast.success("Data berhasil disimpan!");
    } catch (error) {
      console.error("Error saving user data:", error);
      if (error.response) {
        // Handle specific error message from the API
        if (error.response.status === 400 && error.response.data.message) {
          toast.error(error.response.data.message); // Display the API's error message
        } else {
          toast.error("Gagal menyimpan data.");
        }
      } else {
        toast.error("Gagal menyimpan data.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        {hasDataAnak ? "Perbarui Data" : "Tambah Data"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section I: Calon Kelayan */}
        <div className="md:col-span-2 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">I. Calon Kelayan</h3>
        </div>
        {/* NIK */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">NIK</label>
          <input
            type="text"
            name="nik"
            value={calonKelayan.nik}
            readOnly={!!userNik}
            onChange={handleCalonKelayanChange}
            className={`w-full px-4 py-2 border rounded-lg ${
              userNik ? "bg-gray-200 text-gray-700 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Nama */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Nama</label>
          <input
            type="text"
            name="nama"
            value={calonKelayan.nama}
            onChange={handleCalonKelayanChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Tempat Lahir */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Tempat Lahir</label>
          <input
            type="text"
            name="tempat_lahir"
            value={calonKelayan.tempat_lahir}
            onChange={handleCalonKelayanChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Tanggal Lahir */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Tanggal Lahir</label>
          <input
            type="date"
            name="tanggal_lahir"
            value={calonKelayan.tanggal_lahir}
            onChange={handleCalonKelayanChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Pendidikan Terakhir */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Pendidikan Terakhir</label>
          <input
            type="text"
            name="pendidikan_terakhir"
            value={calonKelayan.pendidikan_terakhir}
            onChange={handleCalonKelayanChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Ranking */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Ranking</label>
          <input
            type="number"
            name="ranking"
            value={calonKelayan.ranking}
            onChange={handleCalonKelayanChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Total Siswa */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Total Siswa</label>
          <input
            type="number"
            name="total_siswa"
            value={calonKelayan.total_siswa}
            onChange={handleCalonKelayanChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Tinggal Kelas */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Tinggal Kelas</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="tinggal_kelas"
                value="true"
                checked={calonKelayan.tinggal_kelas === true}
                onChange={() => setCalonKelayan({ ...calonKelayan, tinggal_kelas: true })}
                className="mr-2"
              />
              Ya
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="tinggal_kelas"
                value="false"
                checked={calonKelayan.tinggal_kelas === false}
                onChange={() => setCalonKelayan({ ...calonKelayan, tinggal_kelas: false })}
                className="mr-2"
              />
              Tidak
            </label>
          </div>
        </div>

        {/* Jumlah Saudara */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Jumlah Saudara</label>
          <input
            type="number"
            name="jumlah_saudara"
            value={calonKelayan.jumlah_saudara}
            onChange={handleCalonKelayanChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        {/* Anak Ke */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Anak Ke</label>
          <input
            type="number"
            name="anak_ke"
            value={calonKelayan.anak_ke}
            onChange={handleCalonKelayanChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Tinggi Badan */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Tinggi Badan (cm)</label>
          <input
            type="number"
            name="tinggi_badan"
            value={calonKelayan.tinggi_badan}
            onChange={handleCalonKelayanChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Berat Badan */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Berat Badan (kg)</label>
          <input
            type="number"
            name="berat_badan"
            value={calonKelayan.berat_badan}
            onChange={handleCalonKelayanChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Kebiasaan */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Kebiasaan</label>
          <input
            type="text"
            name="kebiasaan"
            value={calonKelayan.kebiasaan}
            onChange={handleCalonKelayanChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Alamat */}
        <div className="md:col-span-2 mb-6">
          <label className="block text-gray-700 font-semibold">Alamat</label>
          <textarea
            name="alamat"
            value={calonKelayan.alamat}
            onChange={handleCalonKelayanChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Section II: Orang Tua */}
        <div className="md:col-span-2 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">II. Orang Tua</h3>
        </div>

        {/* Ayah */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Ayah</h4>
          {/* Nama Ayah */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Nama</label>
            <input
              type="text"
              name="nama"
              value={orangTua.ayah.nama}
              onChange={(e) => handleOrangTuaChange(e, "ayah")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* NIK Ayah */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">NIK</label>
            <input
              type="text"
              name="nik"
              value={orangTua.ayah.nik}
              onChange={(e) => handleOrangTuaChange(e, "ayah")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Nama Kecil & Gelar Ayah */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Nama Kecil & Gelar</label>
            <input
              type="text"
              name="nama_kecil"
              value={orangTua.ayah.nama_kecil}
              onChange={(e) => handleOrangTuaChange(e, "ayah")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          {/* Jumlah Saudara Ayah */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Jumlah Saudara</label>
            <input
              type="number"
              name="jumlah_saudara"
              value={orangTua.ayah.jumlah_saudara}
              onChange={(e) => handleOrangTuaChange(e, "ayah")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Pendidikan Ayah */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Pendidikan</label>
            <input
              type="text"
              name="pendidikan"
              value={orangTua.ayah.pendidikan}
              onChange={(e) => handleOrangTuaChange(e, "ayah")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Pekerjaan Ayah */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Pekerjaan</label>
            <input
              type="text"
              name="pekerjaan"
              value={orangTua.ayah.pekerjaan}
              onChange={(e) => handleOrangTuaChange(e, "ayah")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Alamat Ayah */}
          <div className="md:col-span-2 mb-6">
            <label className="block text-gray-700 font-semibold">Alamat</label>
            <textarea
              name="alamat"
              value={orangTua.ayah.alamat}
              onChange={(e) => handleOrangTuaChange(e, "ayah")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* No. HP Ayah */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">No. HP</label>
            <input
              type="text"
              name="no_hp"
              value={orangTua.ayah.no_hp}
              onChange={(e) => handleOrangTuaChange(e, "ayah")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Ibu */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Ibu</h4>
          {/* Nama Ibu */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Nama</label>
            <input
              type="text"
              name="nama"
              value={orangTua.ibu.nama}
              onChange={(e) => handleOrangTuaChange(e, "ibu")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* NIK Ibu */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">NIK</label>
            <input
              type="text"
              name="nik"
              value={orangTua.ibu.nik}
              onChange={(e) => handleOrangTuaChange(e, "ibu")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Nama Kecil & Gelar Ibu */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Nama Kecil & Gelar</label>
            <input
              type="text"
              name="nama_kecil"
              value={orangTua.ibu.nama_kecil}
              onChange={(e) => handleOrangTuaChange(e, "ibu")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Jumlah Saudara Ibu */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Jumlah Saudara</label>
            <input
              type="number"
              name="jumlah_saudara"
              value={orangTua.ibu.jumlah_saudara}
              onChange={(e) => handleOrangTuaChange(e, "ibu")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Pendidikan Ibu */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Pendidikan</label>
            <input
              type="text"
              name="pendidikan"
              value={orangTua.ibu.pendidikan}
              onChange={(e) => handleOrangTuaChange(e, "ibu")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Pekerjaan Ibu */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Pekerjaan</label>
            <input
              type="text"
              name="pekerjaan"
              value={orangTua.ibu.pekerjaan}
              onChange={(e) => handleOrangTuaChange(e, "ibu")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Alamat Ibu */}
          <div className="md:col-span-2 mb-6">
            <label className="block text-gray-700 font-semibold">Alamat</label>
            <textarea
              name="alamat"
              value={orangTua.ibu.alamat}
              onChange={(e) => handleOrangTuaChange(e, "ibu")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* No. HP Ibu */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">No. HP</label>
            <input
              type="text"
              name="no_hp"
              value={orangTua.ibu.no_hp}
              onChange={(e) => handleOrangTuaChange(e, "ibu")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center md:col-span-2"
          disabled={isLoading}
        >
          {isLoading ? <ClipLoader size={20} color="#ffffff" /> : hasDataAnak ? "Simpan Perubahan" : "Tambah Data"}
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  );
};

export default Form1;