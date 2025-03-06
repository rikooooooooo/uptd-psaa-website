import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Form6({ userId }) {
  const [formData, setFormData] = useState({
    fotocopy_akte_kelahiran_sekolah: "",
    fotocopy_nisn_sekolah: "",
    fotocopy_rapor_5_semester: "",
    pas_foto_sekolah: "",
    fotocopy_kartu_keluarga_sekolah: "",
    fotocopy_ijazah_sementara: "",
    fotocopy_surat_tanda_kelulusan: "",
    fotocopy_sktm: "",
    fotocopy_sertifikat_prestasi: "",
    fotocopy_sertifikat_akreditasi: "",
    fotocopy_user_password_ppdb: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch data by user_id when the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/api/persyaratan_sekolah/${userId}`);
        if (response.data) {
          // Ensure all fields are strings or null
          const data = {
            fotocopy_akte_kelahiran_sekolah: response.data.fotocopy_akte_kelahiran_sekolah || "",
            fotocopy_nisn_sekolah: response.data.fotocopy_nisn_sekolah || "",
            fotocopy_rapor_5_semester: response.data.fotocopy_rapor_5_semester || "",
            pas_foto_sekolah: response.data.pas_foto_sekolah || "",
            fotocopy_kartu_keluarga_sekolah: response.data.fotocopy_kartu_keluarga_sekolah || "",
            fotocopy_ijazah_sementara: response.data.fotocopy_ijazah_sementara || "",
            fotocopy_surat_tanda_kelulusan: response.data.fotocopy_surat_tanda_kelulusan || "",
            fotocopy_sktm: response.data.fotocopy_sktm || "",
            fotocopy_sertifikat_prestasi: response.data.fotocopy_sertifikat_prestasi || "",
            fotocopy_sertifikat_akreditasi: response.data.fotocopy_sertifikat_akreditasi || "",
            fotocopy_user_password_ppdb: response.data.fotocopy_user_password_ppdb || "",
          };
          setFormData(data);
          setIsEditMode(true);
        } else {
          setIsEditMode(false);
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
    const { name, files } = e.target;
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedFormData = { ...formData };

      // List of file fields in the form
      const fileFields = [
        "fotocopy_akte_kelahiran_sekolah",
        "fotocopy_nisn_sekolah",
        "fotocopy_rapor_5_semester",
        "pas_foto_sekolah",
        "fotocopy_kartu_keluarga_sekolah",
        "fotocopy_ijazah_sementara",
        "fotocopy_surat_tanda_kelulusan",
        "fotocopy_sktm",
        "fotocopy_sertifikat_prestasi",
        "fotocopy_sertifikat_akreditasi",
        "fotocopy_user_password_ppdb",
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
        await axios.put(`http://localhost:5000/api/persyaratan_sekolah/${formData.id}`, payload);
        toast.success("Data berhasil diperbarui");
      } else {
        // Upload new data
        await axios.post("http://localhost:5000/api/persyaratan_sekolah", payload);
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
      <h2 className="text-xl font-bold mb-6">Form 6: Persyaratan Sekolah</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <ClipLoader color="#4A90E2" size={40} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Persyaratan Sekolah Fields */}
          <div className="space-y-4">
            {/* Example Field: Fotocopy Akte Kelahiran Anak */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotocopy Akte Kelahiran Anak:
              </label>
              <input
                type="file"
                name="fotocopy_akte_kelahiran_sekolah"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.fotocopy_akte_kelahiran_sekolah)}
              {formData.fotocopy_akte_kelahiran_sekolah && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Fotocopy NISN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotocopy NISN:
              </label>
              <input
                type="file"
                name="fotocopy_nisn_sekolah"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.fotocopy_nisn_sekolah)}
              {formData.fotocopy_nisn_sekolah && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Fotocopy Rapor 5 Semester */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotocopy Rapor 5 Semester Terakhir yang Dilegalisir:
              </label>
              <input
                type="file"
                name="fotocopy_rapor_5_semester"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.fotocopy_rapor_5_semester)}
              {formData.fotocopy_rapor_5_semester && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Pas Foto Sekolah */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pas Photo Ukuran 2 x 3, 3 x 4, dan 4 x 6:
              </label>
              <input
                type="file"
                name="pas_foto_sekolah"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.pas_foto_sekolah)}
              {formData.pas_foto_sekolah && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
              <p className="text-sm text-gray-600 mt-2">
                Berjumlah 5 lembar berwarna dan 5 lembar hitam putih setiap ukurannya.
              </p>
            </div>

            {/* Fotocopy Kartu Keluarga */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotocopy Kartu Keluarga:
              </label>
              <input
                type="file"
                name="fotocopy_kartu_keluarga_sekolah"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.fotocopy_kartu_keluarga_sekolah)}
              {formData.fotocopy_kartu_keluarga_sekolah && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Fotocopy Ijazah Sementara */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotocopy Ijazah/Ijazah Sementara:
              </label>
              <input
                type="file"
                name="fotocopy_ijazah_sementara"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.fotocopy_ijazah_sementara)}
              {formData.fotocopy_ijazah_sementara && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Fotocopy Surat Tanda Kelulusan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotocopy Surat Tanda Kelulusan:
              </label>
              <input
                type="file"
                name="fotocopy_surat_tanda_kelulusan"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.fotocopy_surat_tanda_kelulusan)}
              {formData.fotocopy_surat_tanda_kelulusan && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Fotocopy SKTM */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotocopy Surat Keterangan Tidak Mampu (SKTM):
              </label>
              <input
                type="file"
                name="fotocopy_sktm"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.fotocopy_sktm)}
              {formData.fotocopy_sktm && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Fotocopy Sertifikat Prestasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotocopy Sertifikat Prestasi Akademik dan Non Akademik (Jika Ada):
              </label>
              <input
                type="file"
                name="fotocopy_sertifikat_prestasi"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.fotocopy_sertifikat_prestasi)}
              {formData.fotocopy_sertifikat_prestasi && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Fotocopy Sertifikat Akreditasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotocopy Sertifikat Akreditasi Sekolah:
              </label>
              <input
                type="file"
                name="fotocopy_sertifikat_akreditasi"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.fotocopy_sertifikat_akreditasi)}
              {formData.fotocopy_sertifikat_akreditasi && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
            </div>

            {/* Fotocopy User dan Password PPDB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotocopy User dan Password PPDB (Khusus yang Daftar SMA):
              </label>
              <input
                type="file"
                name="fotocopy_user_password_ppdb"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="application/pdf"
              />
              {renderFilePreview(formData.fotocopy_user_password_ppdb)}
              {formData.fotocopy_user_password_ppdb && (
                <p className="text-sm text-green-600 mt-2">File sudah diunggah.</p>
              )}
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

export default Form6;