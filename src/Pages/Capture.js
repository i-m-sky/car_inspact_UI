import React, { useEffect, useState } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import "../Assets/css/Capture.css";
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Steps } from "antd";
import { FaCarSide } from "react-icons/fa";
import { FaCar } from "react-icons/fa";
import { IoCarOutline } from "react-icons/io5";
import { Step } from "@material-ui/core";
import { PostApi } from "../Services/Service";
import { useNavigate } from "react-router-dom";
import CarDirectionGuide from "../components/CarDirectionGuide";
import { useDispatch } from "react-redux";
import { setUploadedIndexs } from "../Features/CamSlice";

const Capture = (props) => {
  const [viewType, setViewType] = useState("Please capture front view of car.");
  const [main_index, setMainIndex] = useState(null);
  const [inspectionToken, setInspectionToken] = useState("");
  const [current, setCurrent] = useState(0);
  const [current_active_side, setCurrentActiveSide] = useState("");
  const [controls, setControls] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [Images, setImages] = useState({
    FrontView: "",
    RightSideView: "",
    BackView: "",
    LeftSideView: "",
  });

  const display_msgs = {
    point: "Please point your camera at car.",
    FrontView: "Capture Front View",
    RightSideView: "Capture Right Side View",
    BackView: "Capture Back View",
    LeftSideView: "Caputer Left Side View",
  };

  const steps = [
    {
      id: 0,
      title: "Front View",
      name: "FrontView",
      status: "finish",
      icon: <FaCar />,
    },
    {
      id: 1,
      title: "Right Front Window",
      name: "RightFrontWindow",
      status: "finish",
      icon: <FaCarSide />,
    },
    {
      id: 2,
      title: "Right View",
      name: "RightView",
      status: "finish",
      icon: <FaCarSide />,
    },
    {
      id: 3,
      title: "Right Rear Window",
      name: "RightRearWindow",
      status: "finish",
      icon: <IoCarOutline />,
    },
    {
      id: 4,
      title: "Rear View",
      name: "RearView",
      status: "finish",
      icon: <FaCarSide />,
    },
    {
      id: 5,
      title: "Left Rear Window",
      name: "LeftRearWindow",
      status: "finish",
      icon: <FaCarSide />,
    },
    {
      id: 6,
      title: "Left View",
      name: "LeftView",
      status: "finish",
      icon: <FaCarSide />,
    },
    {
      id: 7,
      title: "Left Front Window",
      name: "LeftFrontWindow",
      status: "finish",
      icon: <FaCarSide />,
    },
  ];

  function base64ToFile(base64String, filename) {
    let byteString = atob(base64String.split(",")[1]);

    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    let blob = new Blob([ab], { type: "image/jpeg" });

    let file = new File([blob], filename, { type: "image/jpeg" });

    return file;
  }

  const formData = new FormData();

  function handleTakePhoto(dataUri) {
    const current_step = getCurrentStepData();
    const current = steps[current_step["id"] + 1];

    if (current?.name) setCurrentActiveSide(current?.name);

    if (current_step && current) {
      setViewType(
        "Please capture " + current?.title?.toLocaleLowerCase() + " of car."
      );
    }

    const file = base64ToFile(dataUri, current_step.name + ".jpg");

    formData.append(current_step.name, file);

    PostApi("upload-360view?inspection=" + inspectionToken, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {})
      .catch((err) => {
        alert("opps something went wrong,please re upload images");
        console.log("opps something went wrong");
      });

    if (current_step?.name == "LeftFrontWindow") {
      dispatch(setUploadedIndexs(main_index));
      navigate("/?inspection=" + inspectionToken, {
        state: { currentIndex: main_index, is_uploaded: true },
      });
      return;
    }

    next();
  }

  function handleCameraError(error) {
    if (error) {
      setControls(false);
      document.getElementById("outer-circle").style = "display:none;";
    }

    console.error("Camera error:", error);
  }

  const next = () => {
    setCurrent((prev) => prev + 1);
  };

  const prev = () => {
    setCurrent((prev) => prev - 1);
  };

  const goToStep = (step) => {
    setCurrent(step);
    const current = steps[step];
    if (current) {
      setViewType(
        "Please capture " + current?.title?.toLocaleLowerCase() + " of car."
      );
    }
  };

  const getCurrentStepData = () => {
    return steps[current];
  };

  const { Step } = Steps;

  const getInspectionToken = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("inspection");
    if (token) {
      setInspectionToken(token);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setControls(true);
    }, 1500);
    getInspectionToken();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const index = params.get("current_index");
    setMainIndex(index);
  }, []);

  return (
    <>
      <div className="camera-container">
        <Camera
          onTakePhoto={(dataUri) => handleTakePhoto(dataUri)}
          onCameraError={(error) => handleCameraError(error)}
          idealFacingMode="environment"
          isImageMirror={false}
          className="camera"
          imageCompression={0.8}
          idealResolution={{ width: 1520, height: 600 }}
        />
        {/* <div className="current-view-text">
          <Steps current={current}>
            {steps.map((item, i) => (
              <Step
                className="antd-steps text-center"
                key={item.title}
                title={item.title}
                icon={item.icon}
                onClick={() => goToStep(i)}
              />
            ))}
          </Steps>
        </div> */}

        {controls ? (
          <>
            <div className="overlay-text">{viewType && <p>{viewType}</p>}</div>
            <div className="guide">
              <CarDirectionGuide current_active_side={current_active_side} />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Capture;
