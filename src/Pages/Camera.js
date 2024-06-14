import React, { useState, useRef } from "react";

const Camera = () => {
  const [mediaStream, setMediaStream] = useState(null);
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  };

  return (
    <div>
      <h1>Camera Access Demo</h1>
      <div>
        {mediaStream ? (
          <button onClick={stopCamera}>Stop Camera</button>
        ) : (
          <button onClick={startCamera}>Start Camera</button>
        )}
      </div>
      {mediaStream && <video ref={videoRef} autoPlay />}
    </div>
  );
};

export default Camera;
