import { useState, useEffect } from "react";

const getOrientation = () => {
  if (
    window.screen &&
    window.screen.orientation &&
    window.screen.orientation.type
  ) {
    return window.screen.orientation.type;
  }
  // Fallback for iOS
  const angle = window.orientation;
  switch (angle) {
    case 0:
    case 180:
      return "portrait-primary";
    case 90:
    case -90:
      return "landscape-primary";
    default:
      return "unknown";
  }
};

const useScreenOrientation = () => {
  const [orientation, setOrientation] = useState(getOrientation());

  const updateOrientation = () => {
    setOrientation(getOrientation());
  };

  useEffect(() => {
    window.addEventListener("orientationchange", updateOrientation);
    return () => {
      window.removeEventListener("orientationchange", updateOrientation);
    };
  }, []);

  return orientation;
};

export default useScreenOrientation;
