import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

function UpdatePengumuman() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 9; // Items per page

  // Fetch announcements from PostgreSQL via API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/announcements");
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        toast.error("Gagal memuat pengumuman!");
      }
    };
    fetchAnnouncements();
  }, []);

  // Handle file upload
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(uploadedFile);
    } else {
      setFilePreview(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title && !description && !file) {
        toast.error("Tidak ada perubahan yang dilakukan!");
        return;
    }

    setLoading(true);
    try {
        let file_url = "";
        let public_id = "";

        // If a new file is uploaded, delete the old file from Cloudinary
        if (file && editIndex !== null && announcements[editIndex]?.public_id) {
            await axios.post("http://localhost:5000/api/delete-media", {
                publicId: announcements[editIndex].public_id,
                resourceType: "raw",
            });
        }

        // Upload new file to Cloudinary
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "test_preset");
            formData.append("resource_type", "raw");

            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/df4qrohsq/raw/upload",
                formData
            );
            file_url = response.data.secure_url;
            public_id = response.data.public_id;
        }

        const newAnnouncement = {
            file_url: file_url || announcements[editIndex]?.file_url || "",
            public_id: public_id || announcements[editIndex]?.public_id || "",
            title: title || announcements[editIndex]?.title || "",
            description: description || announcements[editIndex]?.description || "",
        };

        console.log("New Announcement to be sent:", newAnnouncement);

        if (editIndex !== null) {
            const response = await axios.put(
                `http://localhost:5000/api/announcements/${announcements[editIndex].id}`,
                newAnnouncement
            );
            console.log("Backend Response after Edit:", response.data);
            toast.success("Pengumuman berhasil diperbarui!");
        } else {
            const response = await axios.post("http://localhost:5000/api/announcements", newAnnouncement);
            toast.success("Pengumuman berhasil ditambahkan!");
        }

        resetForm();
        closeModal();
    } catch (error) {
        console.error("Error saving announcement:", error);
        toast.error("Gagal menyimpan pengumuman!");
    } finally {
        setLoading(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setEditIndex(null);
    setFilePreview(null);
  };

  // Handle edit announcement
  const handleEdit = (index) => {
    const itemToEdit = announcements[index];
    setFile(null);
    setFilePreview(itemToEdit.file_url); // Use file_url instead of file
    setTitle(itemToEdit.title);
    setDescription(itemToEdit.description);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  // Handle delete announcement
  const handleDelete = async () => {
    setIsDeleting(true);
    const itemToDelete = announcements[deleteIndex];
    try {
      if (itemToDelete.public_id) {
        await axios.post("http://localhost:5000/api/delete-media", {
          publicId: itemToDelete.public_id,
          resourceType: "raw",
        });
      }
      await axios.delete(`http://localhost:5000/api/announcements/${itemToDelete.id}`);
      const updatedAnnouncements = announcements.filter((_, i) => i !== deleteIndex);
      setAnnouncements(updatedAnnouncements);
      toast.success("Pengumuman dan file berhasil dihapus!");
    } catch (error) {
      console.error("Failed to delete announcement:", error);
      toast.error("Gagal menghapus pengumuman!");
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  // Open/close delete confirmation modal
  const openDeleteModal = (index) => {
    setDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteIndex(null);
  };

  // Filter announcements based on search query
  const filteredAnnouncements = announcements.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting logic
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAnnouncements = useMemo(() => {
    let sortableAnnouncements = [...filteredAnnouncements];
    if (sortConfig.key !== null) {
      sortableAnnouncements.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableAnnouncements;
  }, [filteredAnnouncements, sortConfig]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAnnouncements.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedAnnouncements.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Open/close modal for adding/editing announcements
  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <ClipLoader color="#ffffff" loading={loading} size={50} />
        </div>
      )}

      {/* Main Content - Daftar Pengumuman */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Daftar Pengumuman</h2>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pengumuman..."
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Tambah Pengumuman
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('file')}>
                  File {sortConfig.key === 'file' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                </th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('title')}>
                  Judul {sortConfig.key === 'title' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                </th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('description')}>
                  Deskripsi {sortConfig.key === 'description' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                </th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('date')}>
                  Tanggal {sortConfig.key === 'date' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                </th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="px-4 py-2">
                    {item.file_url && item.file_url.endsWith(".pdf") ? (
                      <iframe
                        src={item.file_url}
                        className="w-16 h-16 object-cover rounded-md"
                        title="File Preview"
                      />
                    ) : item.file_url && (item.file_url.endsWith(".jpg") || item.file_url.endsWith(".png")) ? (
                      <img
                        src={item.file_url}
                        alt="File Preview"
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center text-gray-500">
                        <span>File tidak dapat dipratinjau</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <span>Halaman {currentPage} dari {totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      </div>

      {/* Modal for Adding/Editing Announcements */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[600px] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-6">
              {editIndex !== null ? "Edit Pengumuman" : "Tambah Pengumuman"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">File Pendukung</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                {filePreview && (
                  <embed
                    src={filePreview}
                    className="w-full h-32 object-cover rounded-md mt-2"
                    type="application/pdf"
                  />
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Judul</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul pengumuman"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tulis deskripsi pengumuman"
                  className="w-full border border-gray-300 rounded-md p-2 h-32"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                {editIndex !== null ? "Update Pengumuman" : "Tambah Pengumuman"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="w-full mt-2 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Batal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50]">
          <div className="bg-white p-6 rounded-lg">
            <p className="mb-4">Apakah Anda yakin ingin menghapus pengumuman ini?</p>
            {announcements[deleteIndex]?.file && (
              <div className="mb-4">
                {announcements[deleteIndex].file.endsWith(".pdf") ? (
                  <iframe
                    src={announcements[deleteIndex].file}
                    className="w-full h-32 object-cover rounded-md"
                    title="File Preview"
                  />
                ) : announcements[deleteIndex].file.endsWith(".jpg") || announcements[deleteIndex].file.endsWith(".png") ? (
                  <img
                    src={announcements[deleteIndex].file}
                    alt="File Preview"
                    className="w-full max-w-[300px] max-h-[300px] h-32 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center text-gray-500">
                    <span>File tidak dapat dipratinjau</span>
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-between">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Hapus
              </button>
              <button
                onClick={closeDeleteModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading screen for deletion */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ClipLoader color="#ffffff" loading={isDeleting} size={50} />
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default UpdatePengumuman;