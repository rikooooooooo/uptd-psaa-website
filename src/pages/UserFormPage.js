import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../authContext";
import "react-toastify/dist/ReactToastify.css";
import Form1 from "../components/Form1";
import Form2 from "../components/Form2";
import Form3 from "../components/Form3";
import Form4 from "../components/Form4";
import Form5 from "../components/Form5";
import Form6 from "../components/Form6";

function UserFormPage() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeForm, setActiveForm] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/loginpsaa");
    }
  }, [isAuthenticated, navigate]);

  const handleFormSwitch = (formNumber) => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveForm(formNumber);
      setIsLoading(false);
    }, 500); // Simulating a brief loading delay
  };

  const renderForm = () => {
    switch (activeForm) {
      case 1:
        return (
          <Form1
            userNik={currentUser?.nik}
            userId={currentUser?.id}
            currentUser={currentUser}
          />
        );
      case 2:
        return <Form2 userId={currentUser?.id} currentUser={currentUser} />;
      case 3:
        return <Form3 userId={currentUser?.id} currentUser={currentUser} />;
      case 4:
        return <Form4 userId={currentUser?.id} currentUser={currentUser} />;
      case 5:
        return <Form5 userId={currentUser?.id} currentUser={currentUser} />;
      case 6:
        return <Form6 userId={currentUser?.id} currentUser={currentUser} />;
      default:
        return (
          <Form1
            userNik={currentUser?.nik}
            currentUser={currentUser}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center bg-gray-100 p-6">
        {/* Progress Bar at the Top (Full Width) */}
        <div className="w-full mb-6 px-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-500 h-2.5 rounded-full"
              style={{ width: `${(activeForm / 6) * 100}%` }}
            ></div>
          </div>
          {/* Centered Progress Text */}
          <p className="text-sm text-gray-600 mt-2 text-center">
            Step {activeForm} of 6
          </p>
        </div>

        {/* Navigation Bar with Logout Button (Full Width) */}
        <div className="w-full mb-6 px-4 overflow-x-auto">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 min-w-[600px]">
            {[
              { num: 1, label: "Data Pribadi" },
              { num: 2, label: "Kondisi Ekonomi" },
              { num: 3, label: "Hubungan Sosial" },
              { num: 4, label: "Data Administrasi" },
              { num: 5, label: "Lampiran Administrasi" },
              { num: 6, label: "Daftar Sekolah" },
            ].map(({ num, label }) => (
              <button
                key={num}
                onClick={() => handleFormSwitch(num)}
                className={`w-full px-2 py-2 text-sm md:text-base rounded-md text-center transition-colors ${
                  activeForm === num
                    ? "bg-blue-500 text-white font-semibold underline"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                {label}
              </button>
            ))}

            {/* Logout Button (Same Size as Navigation Buttons) */}
            <button
              onClick={logout}
              className="w-full px-2 py-2 text-sm md:text-base bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Form Container (Centered with padding) */}
        <div className="bg-white p-8 rounded-lg shadow-md w-full border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            {[
              "Data Pribadi",
              "Kondisi Ekonomi",
              "Hubungan Sosial",
              "Data Administrasi",
              "Lampiran Administrasi",
              "Daftar Sekolah",
            ][activeForm - 1]}
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader color="#4A90E2" size={50} />
            </div>
          ) : (
            renderForm()
          )}
        </div>

        {/* Previous/Next Buttons (Centered) */}
        <div className="flex justify-between mt-6 w-full">
          <button
            onClick={() => handleFormSwitch(activeForm - 1)}
            disabled={activeForm === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => handleFormSwitch(activeForm + 1)}
            disabled={activeForm === 6}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  );
}

export default UserFormPage;
