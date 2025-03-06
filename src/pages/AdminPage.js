import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateBerita from "../components/UpdateBerita";
import UpdateSlideGallery from "../components/UpdateMediaItems";
import UpdatePengumuman from "../components/UpdatePengumuman";
import UpdateDataAnak from "../components/UpdateDataAnak";
import UpdateUser from "../components/UpdateUsers";
import { useAuth } from "../authContext";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";


function AdminPage() {
  const [activeComponent, setActiveComponent] = useState("berita");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated()); // Debugging
    if (!isAuthenticated()) {
      console.log("Redirecting to login..."); // Debugging
      navigate("/logadminpsaa"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isNavbarOpen) setIsNavbarOpen(false); // Close Navbar when Sidebar is opened
  };

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
    if (isSidebarOpen) setIsSidebarOpen(false); // Close Sidebar when Navbar is opened
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar isOpen={isNavbarOpen} toggleNavbar={toggleNavbar} isAdminPage={true} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div
            className={`fixed md:static inset-y-0 left-0 bg-white shadow-md z-50 transform ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 md:translate-x-0 w-64 p-4`}
          >
            <button
              className="md:hidden text-red-500 mb-4"
              onClick={toggleSidebar}
            >
              Close Menu
            </button>
            <ul className="space-y-4">
              <li>
                <button
                  className={`w-full text-left py-2 px-4 rounded-md ${
                    activeComponent === "berita"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => {
                    setActiveComponent("berita");
                    toggleSidebar();
                  }}
                >
                  Update Berita
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left py-2 px-4 rounded-md ${
                    activeComponent === "gallery"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => {
                    setActiveComponent("gallery");
                    toggleSidebar();
                  }}
                >
                  Update Media
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left py-2 px-4 rounded-md ${
                    activeComponent === "pengumuman"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => {
                    setActiveComponent("pengumuman");
                    toggleSidebar();
                  }}
                >
                  Update Pengumuman
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left py-2 px-4 rounded-md ${
                    activeComponent === "UpdateDataAnak"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => {
                    setActiveComponent("UpdateDataAnak");
                    toggleSidebar();
                  }}
                >
                  Update Data Anak
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left py-2 px-4 rounded-md ${
                    activeComponent === "UpdateUser"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => {
                    setActiveComponent("UpdateUser");
                    toggleSidebar();
                  }}
                >
                  Update User
                </button>
              </li>
            </ul>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-full mt-6 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Sidebar Toggle Button */}
          {!isSidebarOpen && (
            <button
              className="md:hidden fixed bg-blue-600 text-white p-2 shadow-lg z-[60]"
              style={{
                top: "50%",
                left: "0",
                transform: "translateY(-50%)",
                width: "64px", // Adjust width as needed
                height: "48px", // Adjust height as needed
                borderTopRightRadius: "24px", // Rounded circle on the right
                borderBottomRightRadius: "24px", // Rounded circle on the right
              }}
              onClick={toggleSidebar}
            >
              <FaBars size={24} className="ml-auto" /> {/* Icon aligned to the right */}
            </button>
          )}

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            {activeComponent === "berita" && <UpdateBerita />}
            {activeComponent === "gallery" && <UpdateSlideGallery />}
            {activeComponent === "pengumuman" && <UpdatePengumuman />}
            {activeComponent === "UpdateDataAnak" && <UpdateDataAnak />}
            {activeComponent === "UpdateUser" && <UpdateUser />}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminPage;