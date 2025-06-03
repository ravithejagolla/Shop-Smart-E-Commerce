import React, { useEffect, useState } from "react";

const HeroCarousel = ({ images, children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative bg-gradient-to-r from-indigo-700 to-purple-700 overflow-hidden">
      {images.map((image, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 bg-cover bg-center bg-no-repeat ${
            currentIndex === idx ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${image})` }}
        ></div>
      ))}
      <div className="absolute inset-0 bg-indigo-900 bg-opacity-70"></div>
      <div className="relative z-10">{children}</div>
      <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-2 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${
              currentIndex === idx ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
