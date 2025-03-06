import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
// Import the form components (assuming they exist)
import Form1 from "./Form1";
import Form2 from "./Form2";
import Form3 from "./Form3";
import Form4 from "./Form4";
import Form5 from "./Form5";
import Form6 from "./Form6";

const UpdateDataAnak = ({ userNik }) => {
  const [formData, setFormData] = useState({
    nama: "",
    nik: userNik || "",
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
    file: null,
    filePreview: null,
  });

  const [users, setUsers] = useState([]); // State to store all users
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [activeFormIndex, setActiveFormIndex] = useState(0); // Track the active form in the carousel
  const [currentUserId, setCurrentUserId] = useState(null); // ID from data_anak table for related forms
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 9; // Items per page

  // Form names for navigation
  const formNames = ["Data Anak", "Kondisi Ekonomi", "Hubungan Sosial Ibadah", "Data Administrasi", "Lampiran Administrasi", "Pendaftaran"];

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/data_anak");
        setUsers(response.data); // Set the fetched users to state
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Gagal memuat data pengguna!");
      }
    };
    fetchUsers();
  }, []);

  // Fetch single user data if userNik exists
  useEffect(() => {
    if (!userNik) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userNik}`);
        const userData = response.data;

        setFormData((prev) => ({
          ...prev,
          ...userData,
          tanggal_lahir: userData.tanggal_lahir
            ? new Date(userData.tanggal_lahir).toISOString().split("T")[0]
            : "",
        }));
        
        // If the data has an ID, set it as currentUserId
        if (userData.id) {
          setCurrentUserId(userData.id);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Gagal mengambil data pengguna.");
      }
    };

    fetchUserData();
  }, [userNik]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      file: uploadedFile,
    }));

    if (uploadedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          filePreview: reader.result,
        }));
      };
      reader.readAsDataURL(uploadedFile);
    } else {
      setFormData((prev) => ({
        ...prev,
        filePreview: null,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      // First, save the data_anak form (Form1)
      const dataToSend = new FormData();
      // Append all form data fields
      Object.keys(formData).forEach(key => {
        if (key !== 'file' && key !== 'filePreview') {
          dataToSend.append(key, formData[key]);
        }
      });
      
      if (formData.file) {
        dataToSend.append("file", formData.file);
      }

      let savedUser;
      if (editIndex !== null) {
        // UPDATE user (PUT)
        const userToEdit = users[editIndex];
        const response = await axios.put(`http://localhost:5000/api/data_anak/${userToEdit.nik}`, dataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        savedUser = response.data;
        toast.success("Data berhasil diperbarui!");
        
        // Update the local users array
        const updatedUsers = [...users];
        updatedUsers[editIndex] = savedUser;
        setUsers(updatedUsers);
      } else {
        // CREATE user (POST)
        const response = await axios.post(`http://localhost:5000/api/data_anak`, dataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        savedUser = response.data;
        toast.success("Data berhasil ditambahkan!");
        
        // Add new user to the local users array
        setUsers([...users, savedUser]);
      }

      // Set the current user ID from the saved data
      if (savedUser && savedUser.id) {
        setCurrentUserId(savedUser.id);
      }

      resetForm();
      closeModal();
    } catch (error) {
      console.error("Error saving user data:", error);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "Gagal menyimpan data.");
      } else {
        toast.error("Gagal menyimpan data.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      nama: "",
      nik: userNik || "",
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
      file: null,
      filePreview: null,
    });
    setActiveFormIndex(0);
    setCurrentUserId(null);
  };

  // Open/close modal
  const openModal = () => {
    setIsModalOpen(true);
    setActiveFormIndex(0);
    setCurrentUserId(null);
  };

  const closeModal = () => {
    resetForm();
    setEditIndex(null);
    setIsModalOpen(false);
  };

  // Handle edit data anak
  const handleEdit = async (index) => {
    const userToEdit = users[index];
    setFormData({
      ...userToEdit,
      tanggal_lahir: userToEdit.tanggal_lahir
        ? new Date(userToEdit.tanggal_lahir).toISOString().split("T")[0]
        : "",
      filePreview: userToEdit.file_url,
    });
    setEditIndex(index);
    setActiveFormIndex(0);
    
    // Set the ID for related forms
    if (userToEdit.id) {
      setCurrentUserId(userToEdit.id);
    } else {
      try {
        // If ID is not in the user object, fetch it
        const response = await axios.get(`http://localhost:5000/api/data_anak/${userToEdit.nik}`);
        if (response.data && response.data.id) {
          setCurrentUserId(response.data.id);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
        toast.error("Gagal mengambil ID pengguna.");
      }
    }
    
    setIsModalOpen(true);
  };
  
  // Handle delete data anak
  const handleDelete = async (index) => {
    const userToDelete = users[index];
    try {
      // Use `nik` instead of `id` for the delete request
      await axios.delete(`http://localhost:5000/api/data_anak/${userToDelete.nik}`);
      const updatedUsers = users.filter((_, i) => i !== index);
      setUsers(updatedUsers);
      toast.success("Data pengguna berhasil dihapus!");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Gagal menghapus data pengguna!");
    }
  };

  // Navigate to next form
  const nextForm = () => {
    if (activeFormIndex < 5) {
      setActiveFormIndex(activeFormIndex + 1);
    }
  };

  // Navigate to previous form
  const prevForm = () => {
    if (activeFormIndex > 0) {
      setActiveFormIndex(activeFormIndex - 1);
    }
  };

  // Go to specific form
  const goToForm = (index) => {
    setActiveFormIndex(index);
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.nama && user.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting logic
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Render the current form in the carousel
  const renderCurrentForm = () => {
    const formProps = {
      formData,
      setFormData,
      handleChange,
      handleFileChange,
      userNik: editIndex !== null && users[editIndex] ? users[editIndex].nik : userNik,
    };

    // For Form1, we use the same form data handler
    if (activeFormIndex === 0) {
      return <Form1 {...formProps} />;
    }
    
    // For other forms, we need to pass userId (from data_anak)
    if (currentUserId) {
      switch (activeFormIndex) {
        case 1:
          return <Form2 userId={currentUserId} />;
        case 2:
          return <Form3 userId={currentUserId} />;
        case 3:
          return <Form4 userId={currentUserId} />;
        case 4:
          return <Form5 userId={currentUserId} />;
        case 5:
          return <Form6 userId={currentUserId} />;
        default:
          return <Form1 {...formProps} />;
      }
    } else {
      // Show message that user needs to be saved first
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-600 mb-4 text-center">
            {activeFormIndex === 0 
              ? "Silakan isi data anak terlebih dahulu"
              : "Silakan simpan data anak terlebih dahulu sebelum mengisi form lainnya"}
          </p>
          {activeFormIndex !== 0 && (
            <button
              onClick={() => setActiveFormIndex(0)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Kembali ke Form Data Anak
            </button>
          )}
        </div>
      );
    }
  };

  // Save Form1 first before proceeding to other forms
  const handleProceedToNextForm = async () => {
    // If we're on Form1 and trying to go to the next form, save the data first
    if (activeFormIndex === 0) {
      setIsLoading(true);
      try {
        // First, save the data_anak form
        const dataToSend = new FormData();
        // Append all form data fields
        Object.keys(formData).forEach(key => {
          if (key !== 'file' && key !== 'filePreview') {
            dataToSend.append(key, formData[key]);
          }
        });
        
        if (formData.file) {
          dataToSend.append("file", formData.file);
        }

        let savedUser;
        if (editIndex !== null) {
          // UPDATE user (PUT)
          const userToEdit = users[editIndex];
          const response = await axios.put(`http://localhost:5000/api/data_anak/${userToEdit.nik}`, dataToSend, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          savedUser = response.data;
          toast.success("Data berhasil disimpan!");
          
          // Update the local users array
          const updatedUsers = [...users];
          updatedUsers[editIndex] = savedUser;
          setUsers(updatedUsers);
        } else {
          // CREATE user (POST)
          const response = await axios.post(`http://localhost:5000/api/data_anak`, dataToSend, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          savedUser = response.data;
          toast.success("Data berhasil disimpan!");
          
          // Add new user to the local users array
          setUsers([...users, savedUser]);
          
          // Update editIndex to point to the newly added user
          setEditIndex(users.length);
        }

        // Set the current user ID from the saved data
        if (savedUser && savedUser.id) {
          setCurrentUserId(savedUser.id);
          // Proceed to the next form
          setActiveFormIndex(1);
        }
      } catch (error) {
        console.error("Error saving user data:", error);
        toast.error("Gagal menyimpan data. Mohon periksa form kembali.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // If we're not on Form1, just proceed to the next form
      nextForm();
    }
  };

  return (
    <div className="p-6">
      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <ClipLoader color="#ffffff" loading={isLoading} size={50} />
        </div>
      )}

      {/* Main Content - Daftar Pengguna */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Daftar Data Anak</h2>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pengguna..."
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Tambah Pengguna
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort("nama")}>
                  Nama {sortConfig.key === "nama" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
                </th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort("nik")}>
                  NIK {sortConfig.key === "nik" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
                </th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort("tanggal_lahir")}>
                  Tanggal Lahir {sortConfig.key === "tanggal_lahir" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
                </th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="px-4 py-2">{user.nama}</td>
                  <td className="px-4 py-2">{user.nik}</td>
                  <td className="px-4 py-2">{user.tanggal_lahir}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
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

      {/* Modal for Adding/Editing Users with Form Carousel */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editIndex !== null ? "Edit Data Anak" : "Tambah Data Anak"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Form Navigation Cards */}
            <div className="flex overflow-x-auto space-x-2 mb-6">
              {formNames.map((name, index) => (
                <button
                  key={index}
                  onClick={() => goToForm(index)}
                  className={`px-4 py-2 whitespace-nowrap rounded-md ${
                    activeFormIndex === index
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } ${index > 0 && !currentUserId ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={index > 0 && !currentUserId}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Current Form */}
            <div className="mb-6">
              {renderCurrentForm()}
            </div>

            {/* Navigation and Submit Buttons */}
            <div className="flex justify-between mt-6">
              <div>
                {activeFormIndex > 0 && (
                  <button
                    type="button"
                    onClick={prevForm}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-2"
                  >
                    Sebelumnya
                  </button>
                )}
              </div>
              <div>
                {activeFormIndex < 5 ? (
                  <button
                    type="button"
                    onClick={activeFormIndex === 0 ? handleProceedToNextForm : nextForm}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ClipLoader color="#ffffff" size={20} />
                    ) : (
                      activeFormIndex === 0 ? "Simpan & Lanjutkan" : "Selanjutnya"
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Selesai
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  );
};

export default UpdateDataAnak;