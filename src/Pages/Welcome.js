import "../Assets/css/Welcome.css";
import WelcomeImage from "../Assets/images/Welcome.png";
import Logo from "../Assets/images/CarRideLogo.png";

const Welcome = () => {
  return (
    <>
      <div>
        <div className="w-header">
          <img src={Logo} style={{ height: "200px" }}></img>
        </div>
        <div className="text-center">
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
