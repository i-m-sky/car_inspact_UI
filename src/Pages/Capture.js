import React, { useEffect, useState } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import "../Assets/css/Capture.css";
const Capture = (props) => {
  const [viewType, setViewType] = useState("");

  const getViewTypeMsg = async () => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("view");
    setViewType("Take a photo of the car's " + type);
  };

  useEffect(() => {
    getViewTypeMsg();
  }, []);

  function handleTakePhoto(dataUri) {
    console.log("Photo taken:", dataUri);
  }

  function handleCameraError(error) {
    console.error("Camera error:", error);
  }

  return (
    <div className="camera-container">
      <Camera
        onTakePhoto={(dataUri) => handleTakePhoto(dataUri)}
        onCameraError={(error) => handleCameraError(error)}
        idealFacingMode="environment"
        isImageMirror={false}
        className="camera" // Optional: Add a class for specific camera styling
        imageCompression={0.8} // Adjust compression level as needed (0.8 is a good starting point)
        idealResolution={{ width: 1024, height: 768 }}
      />
      <div className="overlay-text">
        <p>{viewType}</p>
      </div>
    </div>
  );
};

export default Capture;
