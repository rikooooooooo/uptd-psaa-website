import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./authContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NewsPage from "./pages/NewsPage";
import TentangPage from "./pages/TentangPage";
import AllNewsPage from "./pages/AllNewsPage";
import AllPengumumanPage from "./pages/AllPengumumanPage";
import GalleryPage from "./pages/GalleryPage";
import NotFoundPage from "./pages/NotFoundPage";
import UserFormPage from "./pages/UserFormPage";
import PengumumanPage from "./pages/PengumumanPage";
import UserLoginPage from "./pages/UserLoginPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/logadminpsaa" element={<LoginPage />} />
          <Route
            path="/adminpsaa"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/news/:id" element={<NewsPage />} />
          <Route path="/announcements/:id" element={<PengumumanPage />} />
          <Route path="/pendaftaran" element={<UserFormPage />} />
          <Route path="/loginpsaa" element={<UserLoginPage />} />
          <Route path="/tentang/*" element={<TentangPage />} />
          <Route path="/all-news" element={<AllNewsPage />} />
          <Route path="/allPengumuman" element={<AllPengumumanPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;