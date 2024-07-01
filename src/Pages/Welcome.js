import "../Assets/css/Welcome.css";
import WelcomeImage from "../Assets/images/Welcome.png";
import Logo from "../Assets/images/CarRideLogo.png";
import { Button } from "antd";

const Welcome = () => {
  return (
    <>
      <div className="mb-4">
        <div className="w-header text-center ">
          <img src={Logo} style={{ height: "88px", padding: "10px" }}></img>
        </div>
        <div className="text-center mt-2">
          <span className="w-head">Welcome to Image Capture Application</span>
        </div>
        <div className="text-center">
          <img src={WelcomeImage} style={{ height: "200px" }}></img>
        </div>
      </div>
    </>
  );
};

export default Welcome;
