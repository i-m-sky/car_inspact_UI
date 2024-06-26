import React, { useEffect, useState } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import DesktopView from "./components/Desktop/Desktop";
import useScreenOrientation from "./hooks/useScreenOrientation";
import NotSupportScreenMode from "./Pages/NotSupportScreenMode";
import Routes from "./routes";
import Auth from "./Services/Auth";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const App = () => {
  const [screenType] = useScreenOrientation();
  const [isMobile, setIsMobile] = useState(false);
  const [inspectionToken, setInspectionToken] = useState(false);
  const [token_verifying, setTokenVerifying] = useState(true);
  const [token_message, setTokenMessage] = useState("Invalid token");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

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
    // verifyToken();
  }, []);

  useEffect(() => {
    console.log(screenWidth, "screenWidth");
    setIsMobile(screenWidth < 1000);
  }, [screenWidth]);

  return (
    <>
      {/* <Routes /> */}
      {isMobile ? (
        screenType == "l" ? (
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
