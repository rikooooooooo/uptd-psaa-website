import React from "react";
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {/* Left Section: Contact Information */}
        <div>
          <h3 className="text-lg font-bold mb-2">Contact Us</h3>
          <p className="mb-1">Address: JL. SUTAN SYAHRIR NO. 270, KEL. SILAING BAWAH, KEC. PADANG PANJANG BARAT, KOTA PADANG PANJANG</p>
          <p className="mb-1"><FaPhone className="inline mr-2" /> +62 123 4567 890</p>
          <p><FaEnvelope className="inline mr-2" /> info@example.com</p>
        </div>

        {/* Right Section: Social Media Icons */}
        <div className="flex flex-col items-start sm:items-end">
          <h3 className="text-lg font-bold mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
              aria-label="Facebook"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;