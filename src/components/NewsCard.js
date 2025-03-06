import React from 'react';
import { Link } from 'react-router-dom';

function NewsCard({ id, image, title, writer, date }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="text-sm text-gray-600 mb-2">
          {writer} | {date}
        </div>
        <h2 className="text-xl font-semibold mb-2 line-clamp-2">
          {title}
        </h2>
        <Link
          to={`/news/${id}`}
          className="text-green-600 hover:text-blue-800 font-medium"
        >
          Baca Selengkapnya →
        </Link>
      </div>
    </div>
  );
}

export default NewsCard;