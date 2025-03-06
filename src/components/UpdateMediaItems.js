import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

function UpdateSlideGallery() {
  const [mediaFile, setMediaFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [author, setAuthor] = useState("");
  const [type, setType] = useState("slideshow");
  const [mediaItems, setMediaItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 9; // Items per page

  // Fetch media items from PostgreSQL via API
  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/media");
        const mappedData = response.data.map(item => ({
          ...item,
          type: item.media_type 
        }));
        setMediaItems(mappedData);
      } catch (error) {
        console.error("Error fetching media items:", error);
        toast.error("Failed to fetch media items!");
      }
    };
    fetchMediaItems();
  }, []);

  // Handle media file input change
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setMediaFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setMediaPreview(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author || !type) {
      toast.error("Title, author, and type are required!");
      return;
    }
    if (!mediaFile && editIndex === null) {
      toast.error("Please upload an image or video!");
      return;
    }
  
    setLoading(true);
    try {
      let url = mediaItems[editIndex]?.url || "";
      let public_id = mediaItems[editIndex]?.public_id || "";
  
      // If a new file is uploaded, delete the previous file from Cloudinary
      if (mediaFile) {
        if (editIndex !== null && mediaItems[editIndex]?.public_id) {
          await axios.post("http://localhost:5000/api/delete-media", {
            publicId: mediaItems[editIndex].public_id,
            resourceType: mediaItems[editIndex].media_type === "video" ? "video" : "image",
          });
        }
  
        const formData = new FormData();
        formData.append("file", mediaFile);
        formData.append("upload_preset", "test_preset");
  
        // Check if it's a video or image
        const isVideo = mediaFile.type.startsWith("video");
        const cloudinaryUploadUrl = isVideo
          ? "https://api.cloudinary.com/v1_1/df4qrohsq/video/upload"
          : "https://api.cloudinary.com/v1_1/df4qrohsq/image/upload";
  
        const response = await axios.post(cloudinaryUploadUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        url = response.data.secure_url;
        public_id = response.data.public_id;
      }
  
      // Prepare the payload (use `url`, not `media_url`)
      const updatedMediaItem = {
        title,
        description: subtitle,
        author,
        media_type: type,
        url, // Fixed here
        public_id,
      };
  
      console.log("Updated Media Item to be sent to backend:", updatedMediaItem);
  
      if (editIndex !== null) {
        const response = await axios.put(`http://localhost:5000/api/media/${mediaItems[editIndex].id}`, updatedMediaItem);
        console.log("Backend Response after Edit:", response.data);
        toast.success("Media item updated successfully!");
      } else {
        const response = await axios.post("http://localhost:5000/api/upload-media", updatedMediaItem);
        updatedMediaItem.id = response.data.id;
        toast.success("Media item added successfully!");
      }
  
      // Update local state
      const updatedMediaItems = editIndex !== null
        ? mediaItems.map((item, index) => (index === editIndex ? { ...item, ...updatedMediaItem } : item))
        : [...mediaItems, updatedMediaItem];
  
      setMediaItems(updatedMediaItems);
      resetForm();
      closeModal();
    } catch (error) {
      console.error("Error saving media item:", error);
      toast.error("Failed to save media item!");
    } finally {
      setLoading(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setMediaFile(null);
    setTitle("");
    setSubtitle("");
    setAuthor("");
    setType("slideshow");
    setEditIndex(null);
    setMediaPreview(null);
  };

  // Handle edit media item
  const handleEdit = (index) => {
    const itemToEdit = mediaItems[index];
    setMediaFile(null);
    setMediaPreview(itemToEdit.url);
    setTitle(itemToEdit.title);
    setSubtitle(itemToEdit.description);
    setAuthor(itemToEdit.author);
    setType(itemToEdit.type);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  // Handle delete media item
  const handleDelete = async () => {
    setIsDeleting(true);
    const itemToDelete = mediaItems[deleteIndex];
    try {
      if (itemToDelete.public_id) {
        // Call the backend to delete the file from Cloudinary and the database
        await axios.post("http://localhost:5000/api/delete-media", {
          publicId: itemToDelete.public_id,
          resourceType: itemToDelete.url.endsWith(".mp4") ? "video" : "image",
          id: itemToDelete.id, // Include the id for deleting from the database
        });
      }
  
      // Update local state
      const updatedMediaItems = mediaItems.filter((_, i) => i !== deleteIndex);
      setMediaItems(updatedMediaItems);
      toast.success("Media item deleted successfully!");
    } catch (error) {
      console.error("Failed to delete media item:", error);
      toast.error("Failed to delete media item!");
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

  // Open/close modal for adding/editing
  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  // Filter media items based on search query
  const filteredMediaItems = mediaItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting logic
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedMediaItems = useMemo(() => {
    let sortableMediaItems = [...filteredMediaItems];
    if (sortConfig.key !== null) {
      sortableMediaItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableMediaItems;
  }, [filteredMediaItems, sortConfig]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedMediaItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedMediaItems.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="p-6">
      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <ClipLoader color="#ffffff" loading={loading} size={50} />
        </div>
      )}

      {/* Main Content - Media List */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Daftar Media</h2>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media..."
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Media
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('url')}>
                  Media {sortConfig.key === 'url' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                </th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('title')}>
                  Title {sortConfig.key === 'title' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                </th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('description')}>
                  Subtitle {sortConfig.key === 'description' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                </th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('author')}>
                  Author {sortConfig.key === 'author' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                </th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('type')}>
                  Type {sortConfig.key === 'type' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                </th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="px-4 py-2">
                    {item.url?.endsWith(".mp4") ? (
                      <video
                        src={item.url}
                        controls
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                  </td>
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2">{item.author}</td>
                  <td className="px-4 py-2">{item.type}</td>
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
                        Delete
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
            Previous
          </button>
          <span>Halaman {currentPage} dari {totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for Adding/Editing Media */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[600px] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-6">
              {editIndex !== null ? "Edit Media" : "Add Media"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Media (Image/Video)</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                {mediaPreview && (
                  <div className="mt-2">
                    {mediaFile?.type?.startsWith("video") ? (
                      <video src={mediaPreview} controls className="w-full h-32 object-cover rounded-md" />
                    ) : (
                      <img src={mediaPreview} alt="Preview" className="w-full h-32 object-cover rounded-md" />
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Enter subtitle"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter author name"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="slideshow">Slideshow</option>
                  <option value="gallery">Gallery</option>
                  <option value="sejarah">Sejarah</option>
                  <option value="struktur">Struktur</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                {editIndex !== null ? "Update Media" : "Add Media"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="w-full mt-2 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50]">
          <div className="bg-white p-6 rounded-lg">
            <p className="mb-4">Are you sure you want to delete this media item?</p>
            {mediaItems[deleteIndex]?.url?.endsWith(".mp4") ? (
              <video src={mediaItems[deleteIndex].url} controls className="w-full max-w-[300px] max-h-[300px] h-32 object-cover rounded-md mb-4" />
            ) : (
              <img src={mediaItems[deleteIndex].url} alt="Preview" className="w-full max-w-[300px] max-h-[300px] h-32 object-cover rounded-md mb-4" />
            )}
            <div className="flex justify-between">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
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

export default UpdateSlideGallery;