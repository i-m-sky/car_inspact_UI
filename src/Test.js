import React from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

function Test(props) {
  function handleTakePhoto(dataUri) {
    console.log("Photo taken:", dataUri);
  }

  function handleCameraError(error) {
    console.error("Camera error:", error);
  }

  return (
    <Camera
      onTakePhoto={(dataUri) => handleTakePhoto(dataUri)}
      onCameraError={(error) => handleCameraError(error)}
      idealFacingMode="environment"
      isImageMirror={false}
    />
  );
}

export default Test;
