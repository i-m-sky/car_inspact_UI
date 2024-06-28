import React, { useEffect, useState } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import DesktopView from "./components/Desktop/Desktop";
import NotSupportScreenMode from "./Pages/NotSupportScreenMode";
import Routes from "./routes";
import Auth from "./Services/Auth";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const App = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [inspectionToken, setInspectionToken] = useState(false);
  const [token_verifying, setTokenVerifying] = useState(true);
  const [token_message, setTokenMessage] = useState("Invalid token");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [orientation, setOrientation] = useState(window.orientation || 0);

  const verifyToken = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("inspection");
    if (!token) {
      setInspectionToken(false);
      setTokenVerifying(false);
      return;
    }
    try {
      const res = await Auth.verify_inpection_token(token);
      if (res.data.status) {
        setInspectionToken(true);
        setTokenVerifying(false);
      } else {
        setTokenMessage(res.data.message);
        setTokenVerifying(false);
      }
    } catch (e) {
      setTokenMessage("Token verification falid");
      setInspectionToken(false);
      setTokenVerifying(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    setIsMobile(screenWidth < 1000);
  }, [screenWidth]);

  function getInitialOrientation() {
    return window.matchMedia("(orientation: landscape)").matches
      ? "landscape"
      : "portrait";
  }

  // useEffect(() => {
  //   function handleOrientationChange() {
  //     setOrientation(
  //       window.matchMedia("(orientation: landscape)").matches
  //         ? "portrait"
  //         : "landscape"
  //     );
  //   }
  //   window.addEventListener("orientationchange", handleOrientationChange);

  //   return () => {
  //     window.removeEventListener("orientationchange", handleOrientationChange);
  //   };
  // }, []);

  const handleOrientationChange = () => {
    const newOrientation = window.orientation || 0;
    setOrientation(newOrientation);
  };

  useEffect(() => {
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  useEffect(() => {
    console.log(orientation, "or");
  }, [orientation]);
  return (
    <>
      {/* <Routes /> */}
      {isMobile ? (
        Math.abs(orientation) === 90 ? (
          token_verifying ? (
            <>
              <Spin
                fullscreen={true}
                tip={<span className="custom-tip">Verifying Token...</span>}
                indicator={
                  <LoadingOutlined
                    style={{
                      fontSize: 100,
                    }}
                    spin
                  />
                }
                style={{ backgroundColor: "white" }}
              />
            </>
          ) : inspectionToken ? (
            <Routes />
          ) : (
            <div>
              <p>{token_message}</p>
            </div>
          )
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
