import React from "react";

function GalleryItem({ item }) {
  return (
    <div className="w-full h-64 bg-black relative rounded-lg overflow-hidden">
      {item.url.endsWith(".mp4") ? (
        <video
          key={item.url}
          src={item.url}
          muted
          autoPlay
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src={item.url}
          alt={item.title || "Gallery"}
          className="w-full h-full object-cover"
        />
      )}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
        <p className="text-white text-sm font-semibold truncate">
          {item.title}
        </p>
      </div>
    </div>
  );
}

export default GalleryItem;
