import React, { useEffect, useState } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import "../Assets/css/Capture.css";
import { useNavigate } from "react-router-dom";

const CaptureSingle = (props) => {
  const [main_index, setMainIndex] = useState(null);
  const [inspectionToken, setInspectionToken] = useState("");
  const [currentView, setCurrentView] = useState("");
  const [controls, setControls] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const index = params.get("current_index");
    const current_view = params.get("current_view");
    setMainIndex(index);
    setCurrentView(current_view);
  }, []);

  function base64ToFile(base64String, filename) {
    let byteString = atob(base64String.split(",")[1]);

    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    let blob = new Blob([ab], { type: "image/jpeg" });

    let file = new File([blob], filename, { type: "image/jpeg" });

    return file;
  }

  const formData = new FormData();

  function handleTakePhoto(dataUri) {
    const file = base64ToFile(dataUri, currentView + ".jpg");

    formData.append(currentView, file);

    navigate("/?inspection=" + inspectionToken, {
      state: {
        currentIndex: main_index,
        is_uploaded: true,
        file: file,
        from: "single_upload",
      },
    });
  }

  function handleCameraError(error) {
    console.error("Camera error:", error);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const index = params?.get("current_index");
    setMainIndex(index);
  }, []);

  return (
    <>
      <div className="camera-container">
        <Camera
          onTakePhoto={(dataUri) => handleTakePhoto(dataUri)}
          onCameraError={(error) => handleCameraError(error)}
          idealFacingMode="environment"
          isImageMirror={false}
          className="camera"
          imageCompression={0.8}
          idealResolution={{ width: 1520, height: 600 }}
        />
      </div>
    </>
  );
};

export default CaptureSingle;
