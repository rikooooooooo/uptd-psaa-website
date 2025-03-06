import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 text-center p-6">
        <h1 className="text-8xl font-extrabold text-blue-600 mb-4">404</h1>
        <p className="text-2xl text-gray-700 mb-4">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <p className="text-lg text-gray-500 mb-8">
          The page might have been removed or the URL might be incorrect.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-green-500 text-white rounded-lg text-lg hover:bg-green-600 transition duration-200"
        >
          Back to Homepage
        </Link>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default NotFoundPage;
