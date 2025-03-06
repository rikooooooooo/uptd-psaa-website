import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

function Navbar({ isOpen, toggleNavbar, isAdminPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isAdminPage && toggleNavbar) {
      toggleNavbar();
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-[#00A85A] p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Logopadangpanjang.png" 
              alt="Logo" 
              className="w-10 h-10"
            />
            <h1 className="text-lg font-bold">UPTD Panti Sosial Asuhan Anak Tri Murni</h1>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="block md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <FaBars size={24} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className={`${
          isAdminPage ? (isOpen ? 'block' : 'hidden md:block') : (isMenuOpen ? 'block' : 'hidden md:block')
        } fixed md:static top-[72px] left-0 right-0 bg-[#00A85A] md:bg-transparent p-4 md:p-0 md:flex md:items-center md:space-x-6`}>
          <Link 
            to="/" 
            className="block py-2 md:py-0 md:inline hover:underline" 
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          {/* Tentang Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center w-full py-2 md:py-0 hover:underline focus:outline-none"
            >
              Tentang
              <svg
                className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="md:absolute relative mt-2 md:mt-4 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link
                  to="/tentang/sejarah"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsMenuOpen(false);
                  }}
                >
                  Sejarah Ringkas
                </Link>
                <Link
                  to="/tentang/visi-misi"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsMenuOpen(false);
                  }}
                >
                  Visi & Misi
                </Link>
                <Link
                  to="/tentang/struktur"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsMenuOpen(false);
                  }}
                >
                  Struktur Organisasi
                </Link>
              </div>
            )}
          </div>

          <Link 
            to="/allPengumuman" 
            className="block py-2 md:py-0 md:inline hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Pengumuman
          </Link>

          <Link 
            to="/pendaftaran" 
            className="block py-2 md:py-0 md:inline hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Pendaftaran
          </Link>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;