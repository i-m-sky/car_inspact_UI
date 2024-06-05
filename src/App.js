import React, { useEffect, useState } from "react";
import "react-multi-carousel/lib/styles.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import DesktopView from "./components/Desktop/Desktop";
import useScreenOrientation from "./hooks/useScreenOrientation";
import NotSupportScreenMode from "./Pages/NotSupportScreenMode";
import Routes from "./routes";
import Auth from "./Services/Auth";

const App = () => {
  const [screenType] = useScreenOrientation();
  const [isMobile, setIsMobile] = useState(false);
  const [inspectionToken, setInspectionToken] = useState(false);

  const verifyToken = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("inspection");
    if (!token) {
      setInspectionToken(false);
      return;
    }
    try {
      const res = await Auth.verify_inpection_token(token);
      if (res.data.status) {
        setInspectionToken(true);
      }
    } catch (e) {
      setInspectionToken(false);
    }
  };

  useEffect(() => {
    verifyToken();
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
      {inspectionToken ? (
        isMobile ? (
          screenType === "l" ? (
            <Routes />
          ) : (
            <NotSupportScreenMode />
          )
        ) : (
          <DesktopView />
        )
      ) : (
        <div>
          <p>Error: Token is expired or invalid </p>
        </div>
      )}
    </>
  );
};

export default App;
