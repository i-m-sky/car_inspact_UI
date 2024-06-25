import { useState, useEffect } from "react";

const isLandscape = () => {
  if (window.screen && window.screen.orientation) {
    return window.screen.orientation.type.startsWith("landscape");
  } else if (typeof window.orientation === "number") {
    return Math.abs(window.orientation) === 90;
  }
  return window.innerWidth > window.innerHeight;
};

const useScreenOrientation = () => {
  const [landscape, setLandscape] = useState(isLandscape());

  const updateOrientation = () => {
    setLandscape(isLandscape());
  };

  useEffect(() => {
    window.addEventListener("orientationchange", updateOrientation);
    // window.addEventListener("resize", updateOrientation);

    return () => {
      // window.removeEventListener("orientationchange", updateOrientation);
      // window.removeEventListener("resize", updateOrientation);
    };
  }, [landscape]);

  console.log(landscape, "landscape");

  return landscape ? "l" : "p";
};

export default useScreenOrientation;
