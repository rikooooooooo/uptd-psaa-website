import React from "react";
import { FaMapMarkerAlt, FaFacebook, FaInstagram } from "react-icons/fa";

function TopBar() {
  return (
    <div className="top-bar bg-gray-800 text-white py-2 sm:py-3">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-2 sm:space-y-0">
        {/* Left Section: Address */}
        <div className="flex items-center justify-center sm:justify-start space-x-2 sm:w-full md:w-3/4">
          <FaMapMarkerAlt className="flex-shrink-0" />
          <span className="text-[10px] sm:text-xs break-words leading-tight">
            JL. SUTAN SYAHRIR NO. 270 KEL. SILAING BAWAH KEC. PADANG PANJANG BARAT KOTA PADANG PANJANG
          </span>
        </div>

        {/* Right Section: Social Media Icons */}
        <div className="flex justify-center sm:justify-end space-x-4 sm:w-full md:w-1/4 social-media">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500"
            aria-label="Facebook"
          >
            <FaFacebook size={16} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500"
            aria-label="Instagram"
          >
            <FaInstagram size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
