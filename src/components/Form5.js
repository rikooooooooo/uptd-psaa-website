import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Form5({ userId }) {
  const [formData, setFormData] = useState({
    surat_rekomendasi: "",
    surat_permohonan: "",
    surat_keterangan_miskin: "",
    nisn: "",
    surat_keterangan_sehat: "",
    fotocopy_rapor_skhu_sttb: "",
    fotocopy_akte_kelahiran: "",
    ijazah_khatam: "",
    fotocopy_kartu_keluarga: "",
    fotocopy_ijazah_terakhir: "",
    no_hp: "",
    rapor_surat_pindah: "",
    kartu_kis_bpjs: "",
    surat_dtks: "",
    ukuran_seragam_sepatu: "",
    pas_foto: "",
    pakaian_harian: "",
    pakaian_seragam_sekolah: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch data by user_id when the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/api/syarat_administrasi/${userId}`);
        if (response.data) {
          // Ensure all fields are strings or empty strings
          const data = {
            surat_rekomendasi: response.data.surat_rekomendasi || "",
            surat_permohonan: response.data.surat_permohonan || "",
            surat_keterangan_miskin: response.data.surat_keterangan_miskin || "",
            nisn: response.data.nisn || "",
            surat_keterangan_sehat: response.data.surat_keterangan_sehat || "",
            fotocopy_rapor_skhu_sttb: response.data.fotocopy_rapor_skhu_sttb || "",
            fotocopy_akte_kelahiran: response.data.fotocopy_akte_kelahiran || "",
            ijazah_khatam: response.data.ijazah_khatam || "",
            fotocopy_kartu_keluarga: response.data.fotocopy_kartu_keluarga || "",
            fotocopy_ijazah_terakhir: response.data.fotocopy_ijazah_terakhir || "",
            no_hp: response.data.no_hp || "",
            rapor_surat_pindah: response.data.rapor_surat_pindah || "",
            kartu_kis_bpjs: response.data.kartu_kis_bpjs || "",
            surat_dtks: response.data.surat_dtks || "",
            ukuran_seragam_sepatu: response.data.ukuran_seragam_sepatu || "",
            pas_foto: response.data.pas_foto || "",
            pakaian_harian: response.data.pakaian_harian || "",
            pakaian_seragam_sekolah: response.data.pakaian_seragam_sekolah || "",
          };
          setFormData(data);
          setIsEditMode(true); // Set to update mode
        } else {
          setIsEditMode(false); // Set to upload mode
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    if (files) {
      const file = files[0];
      if (file.type !== "application/pdf") {
        toast.error("File harus dalam format PDF");
        return;
      }
      if (file.size > 2000 * 1024) {
        toast.error("Ukuran file tidak boleh lebih dari 2 MB");
        return;
      }
      setFormData((prevData) => ({
        ...prevData,
        [name]: file, // Store the file object
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedFormData = { ...formData };

      // List of file fields in the form
      const fileFields = [
        "surat_rekomendasi",
        "surat_permohonan",
        "surat_keterangan_miskin",
        "nisn",
        "surat_keterangan_sehat",
        "fotocopy_rapor_skhu_sttb",
        "fotocopy_akte_kelahiran",
        "ijazah_khatam",
        "fotocopy_kartu_keluarga",
        "fotocopy_ijazah_terakhir",
        "rapor_surat_pindah",
        "kartu_kis_bpjs",
        "surat_dtks",
        "pas_foto",
        "pakaian_harian",
        "pakaian_seragam_sekolah",
      ];

      // Upload each file to Cloudinary and update the form data with the URL
      for (const field of fileFields) {
        if (updatedFormData[field] instanceof File) {
          const formDataUpload = new FormData();
          formDataUpload.append("file", updatedFormData[field]);
          formDataUpload.append("upload_preset", "test_preset");
          formDataUpload.append("resource_type", "raw");

          const uploadResponse = await axios.post(
            "https://api.cloudinary.com/v1_1/df4qrohsq/raw/upload",
            formDataUpload
          );

          updatedFormData[field] = uploadResponse.data.secure_url;
        }
      }

      // Create payload with updated file URLs
      const payload = {
        ...updatedFormData,
        userId, // Include userId
      };

      if (isEditMode) {
        // Update existing data
        await axios.put(`http://localhost:5000/api/syarat_administrasi/${formData.id}`, payload);
        toast.success("Data berhasil diperbarui");
      } else {
        // Upload new data
        await axios.post("http://localhost:5000/api/syarat_administrasi", payload);
        toast.success("Data berhasil disimpan");
        setIsEditMode(true); // Switch to edit mode
      }
    } catch (error) {
      toast.error(isEditMode ? "Gagal memperbarui data" : "Gagal menyimpan data");
      console.error("Error saving data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render file preview or link
  const renderFilePreview = (fileUrl) => {
    if (typeof fileUrl === "string" && fileUrl.trim() !== "") {
      if (fileUrl.endsWith(".pdf")) {
        return (
          <div className="mt-2">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Lihat PDF
            </a>
          </div>
        );
      } else {
        return (
          <div className="mt-2">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Lihat File
            </a>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-6">Form 5: Syarat Administrasi</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <ClipLoader color="#4A90E2" size={40} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Syarat Administrasi Fields */}
          <div className="space-y-4">
            {/* Surat Rekomendasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Surat Rekomendasi dari Dinas Sosial Kab/Kota setempat:
              </label>
              <input
                type="file"
                name="surat_rekomendasi"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.surat_rekomendasi)}
              {formData.surat_rekomendasi && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Surat Permohonan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Surat Permohonan Orang Tua/Wali Calon Anak Asuh:
              </label>
              <input
                type="file"
                name="surat_permohonan"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.surat_permohonan)}
              {formData.surat_permohonan && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Surat Keterangan Miskin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Surat Keterangan Miskin (Asli) dari Kantor Lurah/Wali setempat:
              </label>
              <input
                type="file"
                name="surat_keterangan_miskin"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.surat_keterangan_miskin)}
              {formData.surat_keterangan_miskin && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* NISN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mencatat NISN (Nomor Induk Siswa Nasional) dari sekolah:
              </label>
              <input
                type="file"
                name="nisn"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.nisn)}
              {formData.nisn && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Surat Keterangan Sehat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Surat Keterangan Berbadan Sehat (Asli) dari Puskesmas:
              </label>
              <input
                type="file"
                name="surat_keterangan_sehat"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.surat_keterangan_sehat)}
              {formData.surat_keterangan_sehat && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Fotocopy Rapor, SKHU & STTB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotocopy Rapor, SKHU & STTB SD/SMP:
              </label>
              <input
                type="file"
                name="fotocopy_rapor_skhu_sttb"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.fotocopy_rapor_skhu_sttb)}
              {formData.fotocopy_rapor_skhu_sttb && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Fotocopy Akte Kelahiran */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotocopy Akte Kelahiran / Surat Keterangan Kelahiran:
              </label>
              <input
                type="file"
                name="fotocopy_akte_kelahiran"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.fotocopy_akte_kelahiran)}
              {formData.fotocopy_akte_kelahiran && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Ijazah Khatam */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ijazah Khatam bagi yang tamat Al Quran (Jika Ada):
              </label>
              <input
                type="file"
                name="ijazah_khatam"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.ijazah_khatam)}
              {formData.ijazah_khatam && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Fotocopy Kartu Keluarga */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotocopy Kartu Keluarga terbaru orangtua/wali:
              </label>
              <input
                type="file"
                name="fotocopy_kartu_keluarga"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.fotocopy_kartu_keluarga)}
              {formData.fotocopy_kartu_keluarga && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Fotocopy Ijazah Terakhir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotocopy Ijazah Terakhir Calon Kelayan dan Rapor Semester 1 s/d 6:
              </label>
              <input
                type="file"
                name="fotocopy_ijazah_terakhir"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.fotocopy_ijazah_terakhir)}
              {formData.fotocopy_ijazah_terakhir && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* No. HP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. HP yang dapat dihubungi:
              </label>
              <input
                type="text"
                name="no_hp"
                value={formData.no_hp}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Rapor dan Surat Pindah */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rapor dan Surat Keterangan Pindah (Asli) dari sekolah lama:
              </label>
              <input
                type="file"
                name="rapor_surat_pindah"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.rapor_surat_pindah)}
              {formData.rapor_surat_pindah && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Kartu KIS/BPJS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kartu KIS/BPJS yang asli:
              </label>
              <input
                type="file"
                name="kartu_kis_bpjs"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.kartu_kis_bpjs)}
              {formData.kartu_kis_bpjs && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Surat DTKS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Surat DTKS (Kelayan terdaftar DTKS):
              </label>
              <input
                type="file"
                name="surat_dtks"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.surat_dtks)}
              {formData.surat_dtks && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Ukuran Seragam dan Sepatu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ukuran Seragam Sekolah dan Sepatu:
              </label>
              <input
                type="text"
                name="ukuran_seragam_sepatu"
                value={formData.ukuran_seragam_sepatu}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Pas Foto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pas Photo Berjilbab:
              </label>
              <input
                type="file"
                name="pas_foto"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.pas_foto)}
              {formData.pas_foto && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
              <p className="text-sm text-gray-600 mt-2">
                Pas Photo berjilbab beserta klisenya (CD Foto dibawa) Ukuran:
                <ul className="list-disc pl-6 mt-2">
                  <li>4 x 6: 5 lembar berwarna dan 5 lembar hitam putih</li>
                  <li>3 x 4: 5 lembar berwarna dan 5 lembar hitam putih</li>
                  <li>2 x 3: 5 lembar berwarna dan 5 lembar hitam putih</li>
                  <li>Foto tampak seluruh badan ukuran 4R: 1 Lembar</li>
                </ul>
              </p>
            </div>

            {/* Pakaian Harian dan Seragam Sekolah */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pakaian Harian dan Seragam Sekolah:
              </label>
              {/* <input
                type="file"
                name="pakaian_harian"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {renderFilePreview(formData.pakaian_harian)}
              {formData.pas_foto && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
              <p className="text-sm text-gray-600 mt-2"></p> */}
              <p className="text-sm text-gray-600 mt-2">
                Membawa Pakaian Harian dan Pakaian Seragam Sekolah Yang Lama:
                <ul className="list-disc pl-6 mt-2">
                  <li>Pakaian Sekolah Muslim beserta Jilbab Warna Putih dan Sepatu</li>
                  <li>Pakaian Pramuka Muslim beserta Jilbab Warna Coklat</li>
                  <li>Pakaian Olah Raga beserta Jilbab Warna Putih dan Sepatu</li>
                </ul>
              </p>
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

export default Form5;