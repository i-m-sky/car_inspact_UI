import React, { useEffect, useState } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import DesktopView from "./components/Desktop/Desktop";
import NotSupportScreenMode from "./Pages/NotSupportScreenMode";
import Routes from "./routes";
import Auth from "./Services/Auth";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useSelector } from "react-redux";

const App = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [inspectionToken, setInspectionToken] = useState(false);
  const [token_verifying, setTokenVerifying] = useState(true);
  const [token_message, setTokenMessage] = useState("Invalid token");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [orientation, setOrientation] = useState(window.orientation || 0);
  const state = useSelector((state) => state.cam);

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
    console.log(state, "all state");
    // verifyToken();
  }, [state]);

  useEffect(() => {
    setIsMobile(screenWidth < 1000);
  }, [screenWidth]);

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

  return (
    <>
      <Routes />
      {/* {isMobile ? (
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
      )} */}
    </>
  );
};

export default App;
