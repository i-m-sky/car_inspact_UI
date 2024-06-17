import React, { useState } from "react";
import "../Assets/css/Carousel.css";

const Carousel = ({ images, itemsPerRow }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handlePrevClick = () => {
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
  };

  const handleNextClick = () => {
    setSelectedIndex((selectedIndex + 1) % images.length);
  };

  return (
    <div className="carousel">
      <button className="prev" onClick={handlePrevClick}>
        ❮
      </button>
      <div
        className="slides"
        style={{ width: `${images.length * (100 / itemsPerRow)}%` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="slide"
            style={{ width: `${100 / itemsPerRow}%` }}
          >
            <img src={image} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>
      <button className="next" onClick={handleNextClick}>
        ❯
      </button>
    </div>
  );
};

export default Carousel;
