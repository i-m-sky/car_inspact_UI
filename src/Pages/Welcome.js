import "../Assets/css/Welcome.css";
import WelcomeImage from "../Assets/images/Welcome.png";
import Logo from "../Assets/images/Wel.png";
import { Button } from "antd";

const Welcome = () => {
  return (
    <>
      <div className="mb-4">
        <div className="w-header text-center ">
          <img src={Logo} style={{ height: "80px", padding: "10px" }}></img>
        </div>
        <div className="text-center mt-2">
          <strong>
            <span className="w-head">Welcome to Image Capture Application</span>
          </strong>
        </div>
        <div className="text-center">
          <img src={WelcomeImage} style={{ height: "200px" }}></img>
        </div>
      </div>
    </>
  );
};

export default Welcome;
