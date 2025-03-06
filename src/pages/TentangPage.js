import React from "react";
import Navbar from "../components/Navbar";
import { Routes, Route } from "react-router-dom";
import Sejarah from "../components/Sejarah";
import VisiMisi from "../components/VisiMisi";
import Struktur from "../components/Struktur";
import Footer from "../components/Footer";

function Tentang() {
  return (
    <div>
      {/* Fixed header wrapper */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="w-full bg-white">
          <Navbar />
        </div>
      </div>

      {/* Main content */}
      <div className="w-full pt-24">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Tentang Kami</h1>
          <div className="flex justify-center">
            {/* Content Area */}
            <div className="w-full max-w-3xl">
              <Routes>
                <Route path="sejarah" element={<Sejarah />} />
                <Route path="visi-misi" element={<VisiMisi />} />
                <Route path="struktur" element={<Struktur />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Tentang;
