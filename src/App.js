import React, { useEffect, useState } from "react";
import "react-multi-carousel/lib/styles.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import MobileView from "./components/Mobile/Mobile";
import DesktopView from "./components/Desktop/Desktop";
import useScreenOrientation from "./hooks/useScreenOrientation";
import NotSupportScreenMode from "./Pages/NotSupportScreenMode";
import Routes from "./routes";

const App = () => {
  const [screenType] = useScreenOrientation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {isMobile ? (
        screenType === "l" ? (
          <Routes />
        ) : (
          <NotSupportScreenMode />
        )
      ) : (
        <DesktopView />
      )}
    </>
  );
};

export default App;
