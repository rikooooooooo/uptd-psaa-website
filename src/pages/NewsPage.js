import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function NewsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/news/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        setNewsItem(data);
      } catch (error) {
        console.error('Error fetching news:', error);
        navigate('/'); // Redirect if news not found
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#36D7B7" size={50} />
      </div>
    );
  }

  if (!newsItem) return null;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-6 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <img 
            src={newsItem.image_url} // Use image_url from PostgreSQL
            alt={newsItem.title}
            className="w-full h-[400px] object-cover rounded-lg mb-6"
          />
          <div className="text-sm text-gray-600 mb-2">
            {newsItem.writer} | {newsItem.date}
          </div>
          <h1 className="text-3xl font-bold mb-4">
            {newsItem.title}
          </h1>
          <div className="prose max-w-none">
            {newsItem.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
          <button 
            onClick={() => navigate('/')}
            className="mt-8 text-green-600 hover:text-blue-800 font-medium"
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default NewsPage;
