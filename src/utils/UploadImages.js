import React, { useState } from "react";
import CarFront from "../Assets/CarFront.png";
import CarBack from "../Assets/CarBack.png";
import FrontWindshield from "../Assets/FrontWindshield.png";
import BackWindshield from "../Assets/BackWindshield.png";
import "./UploadImages.css";

const ImageUpload = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleImageClick = () => {
    // Toggle the visibility of the overlay
    setShowOverlay(true);
  };

  const handleFileChange = (event) => {
    // Handle the file input change event
    // ...
    setShowOverlay(false);
  };

  return (
    <div id="image-container">
      <img
        id="uploaded-image"
        src={FrontWindshield}
        alt="Uploaded Image"
        onClick={handleImageClick}
        style={{ cursor: "pointer" }}
      />

      {showOverlay && (
        <div className="overlay">
          <div className="action-container">
            <button
              onClick={() => document.getElementById("upload-btn").click()}
            >
              Open Camera
            </button>
            <button onClick={() => document.getElementById("file-btn").click()}>
              Choose File
            </button>
          </div>
        </div>
      )}

      <input
        type="file"
        id="upload-btn"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <input
        type="file"
        id="file-btn"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUpload;
