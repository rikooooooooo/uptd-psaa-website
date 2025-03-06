import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

function UpdateBerita() {
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");
  const [news, setNews] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 9; // Items per page

  // Fetch news from PostgreSQL via API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/news");
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
        toast.error("Gagal memuat berita!");
      }
    };
    fetchNews();
  }, []);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected File:", file); // Debugging
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("File Preview Generated:", reader.result); // Debugging
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected"); // Debugging
      setImagePreview(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !writer) {
      toast.error("Judul, isi berita, dan nama penulis tidak boleh kosong!");
      return;
    }
    if (!imageFile && editIndex === null) {
      toast.error("Silakan unggah gambar!");
      return;
    }
  
    setLoading(true);
    try {
      let image_url = news[editIndex]?.image_url || "";
      let public_id = news[editIndex]?.public_id || "";
  
      // If a new image is uploaded, delete the previous one and upload the new one
      if (imageFile) {
        if (editIndex !== null && news[editIndex]?.public_id) {
          await axios.post("http://localhost:5000/api/delete-media", {
            publicId: news[editIndex].public_id,
            resourceType: "image",
          });
        }
  
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "test_preset");
  
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/df4qrohsq/image/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
  
        image_url = response.data.secure_url;
        public_id = response.data.public_id;
      }
  
      const currentDate = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
  
      const updatedNewsItem = {
        title,
        content,
        writer,
        image_url,
        public_id,
        date: editIndex !== null ? news[editIndex].date : currentDate,
        timestamp: editIndex !== null ? news[editIndex].timestamp : new Date().toISOString(),
      };
  
      console.log("Updated News Item to be sent to backend:", updatedNewsItem);
  
      if (editIndex !== null) {
        const response = await axios.put(`http://localhost:5000/api/news/${news[editIndex].id}`, updatedNewsItem);
        console.log("Backend Response after Edit:", response.data);
        toast.success("Berita berhasil diperbarui!");
      } else {
        const response = await axios.post("http://localhost:5000/api/upload-news", updatedNewsItem);
        updatedNewsItem.id = response.data.id;
        toast.success("Berita berhasil ditambahkan!");
      }
  
      const updatedNews = editIndex !== null
        ? news.map((item, index) => (index === editIndex ? { ...item, ...updatedNewsItem } : item))
        : [...news, updatedNewsItem];
  
      setNews(updatedNews);
      resetForm();
      closeModal();
    } catch (error) {
      console.error("Error saving news:", error);
      toast.error("Gagal menyimpan berita!");
    } finally {
      setLoading(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setImageFile(null);
    setTitle("");
    setContent("");
    setWriter("");
    setEditIndex(null);
    setImagePreview(null);
  };

  // Handle edit news
  const handleEdit = (index) => {
    const itemToEdit = news[index];
    setTitle(itemToEdit.title);
    setContent(itemToEdit.content);
    setWriter(itemToEdit.writer);
    setImagePreview(itemToEdit.image_url);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  // Handle delete news
  const handleDelete = async () => {
    setIsDeleting(true);
    const itemToDelete = news[deleteIndex];
    try {
      if (itemToDelete.public_id) {
        // Call the backend to delete the image from Cloudinary
        await axios.post("http://localhost:5000/api/delete-media", {
          publicId: itemToDelete.public_id,
          resourceType: "image",
        });
      }

      // Delete the news document from PostgreSQL via API
      await axios.delete(`http://localhost:5000/api/news/${itemToDelete.id}`);

      // Update local state
      const updatedNews = news.filter((_, i) => i !== deleteIndex);
      setNews(updatedNews);
      toast.success("Berita dan gambar berhasil dihapus!");
    } catch (error) {
      console.error("Failed to delete news:", error);
      toast.error("Gagal menghapus berita!");
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

  // Filter news based on search query
  const filteredNews = news.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.writer.toLowerCase().includes(query)
    );
  });

  // Sorting logic
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedNews = useMemo(() => {
    let sortableNews = [...filteredNews];
    if (sortConfig.key !== null) {
      sortableNews.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableNews;
  }, [filteredNews, sortConfig]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedNews.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedNews.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Open/close modal for adding/editing news
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

      {/* Main Content - Daftar Berita */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Daftar Berita</h2>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berita..."
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Tambah Berita
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('image_url')}>
                  Gambar {sortConfig.key === 'image_url' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                </th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('title')}>
                  Judul {sortConfig.key === 'title' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                </th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('writer')}>
                  Penulis {sortConfig.key === 'writer' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
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
                    <img
                      src={item.image_url} 
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">{item.writer}</td>
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

      {/* Modal for Adding/Editing News */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[600px] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-6">{editIndex !== null ? "Edit Berita" : "Tambah Berita"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Gambar Berita</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-md mt-2"
                  />
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Judul</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul berita"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Penulis</label>
                <input
                  type="text"
                  value={writer}
                  onChange={(e) => setWriter(e.target.value)}
                  placeholder="Nama penulis"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Isi Berita</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tulis isi berita"
                  className="w-full border border-gray-300 rounded-md p-2 h-32"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                {editIndex !== null ? "Update Berita" : "Tambah Berita"}
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
            <p className="mb-4">Apakah Anda yakin ingin menghapus berita ini?</p>
            {news[deleteIndex]?.image_url && ( 
              <img
                src={news[deleteIndex].image_url}
                alt="Preview"
                className="w-full max-w-[300px] max-h-[300px] h-auto object-cover rounded-md mb-4"
              />
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

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default UpdateBerita;