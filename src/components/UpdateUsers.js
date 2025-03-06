import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

function UpdateUser() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nik, setNik] = useState("");
  const [nama, setNama] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch users from PostgreSQL via API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users!");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all fields are empty
    if (!nama && !username && !password && !nik) {
      toast.error("Please fill at least one field!");
      return;
    }
  
    // Check if nama is empty when adding a new user
    if (editIndex === null && !nama) {
      toast.error("Nama is required when adding a new user!");
      return;
    }
  
    setLoading(true);
    try {
        const newUser = {
            nama: nama || users[editIndex]?.nama || "",
            username: username || users[editIndex]?.username || "",
            password: password || users[editIndex]?.password || "",
            nik: nik || users[editIndex]?.nik || "",
        };
  
        if (editIndex !== null) {
            await axios.put(
                `http://localhost:5000/api/users/${users[editIndex].id}`,
                newUser
            );
            
            const updatedUsers = [...users];
            updatedUsers[editIndex] = { 
                ...updatedUsers[editIndex], 
                nama: newUser.nama,
                username: newUser.username, 
                password: newUser.password,
                nik: newUser.nik,
            };
            setUsers(updatedUsers);
            
            toast.success("User updated successfully!");
        } else {
            const response = await axios.post("http://localhost:5000/api/users", newUser);
            // Change this line to use the response directly
            setUsers([...users, response.data]);
            toast.success("User added successfully!");
        }
  
        resetForm();
        closeModal();
    } catch (error) {
        console.error("Error saving user:", error);
        toast.error(error.response?.data?.error || "Failed to save user!");
    } finally {
        setLoading(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setUsername("");
    setPassword("");
    setNik("");
    setNama("");
    setEditIndex(null);
  };

  // Handle edit user
  const handleEdit = (index) => {
    const itemToEdit = users[index];
    setUsername(itemToEdit.username);
    setPassword(itemToEdit.password);
    setNik(itemToEdit.nik);
    setNama(itemToEdit.nama);
    setEditIndex(index);
    setIsModalOpen(true);
  };


  // Handle delete user
  const handleDelete = async () => {
    setIsDeleting(true);
    const itemToDelete = users[deleteIndex];
    try {
      await axios.delete(`http://localhost:5000/api/users/${itemToDelete.id}`);
      const updatedUsers = users.filter((_, i) => i !== deleteIndex);
      setUsers(updatedUsers);
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user!");
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

  // Filter users based on search query
  const filteredUsers = users.filter((item) =>
    item.username && item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting logic
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = useMemo(() => {
    let sortableUsers = [...filteredUsers];
    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [filteredUsers, sortConfig]);

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

  // Open/close modal for adding/editing users
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

      {/* Main Content - List of Users */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Daftar Users</h2>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add User
          </button>
        </div>
        {users.length === 0 && !loading ? (
          <p className="text-center py-4">No users found. Add a user to get started.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('username')}>
                    Username {sortConfig.key === 'username' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                  </th>
                  {/* <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('password')}>
                    Password {sortConfig.key === 'password' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                  </th> */}
                  <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('nik')}>
                    NIK {sortConfig.key === 'nik' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                  </th>
                  <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('nama')}>
                    Nama {sortConfig.key === 'nama' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                  </th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-2">{item.username}</td>
                    {/* <td className="px-4 py-2">{item.password}</td> */}
                    <td className="px-4 py-2">{item.nik}</td>
                    <td className="px-4 py-2">{item.nama}</td>
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
        )}

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

      {/* Modal for Adding/Editing Users */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[600px] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-6">
              {editIndex !== null ? "Edit User" : "Add User"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter user password"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">NIK</label>
                <input
                  type="text"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder="Enter NIK"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nama</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Enter Nama"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                {editIndex !== null ? "Update User" : "Add User"}
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
            <p className="mb-4">Are you sure you want to delete this user?</p>
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

export default UpdateUser;