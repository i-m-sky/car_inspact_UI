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

const Capture = (props) => {
  const [viewType, setViewType] = useState("");
  const [main_index, setMainIndex] = useState(null);
  const [inspectionToken, setInspectionToken] = useState("");
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
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
      title: "FrontView",
      status: "finish",
      icon: <FaCar />,
    },
    {
      title: "Right Side View",
      status: "finish",
      icon: <FaCarSide />,
    },
    {
      title: "Back View",
      status: "finish",
      icon: <IoCarOutline />,
    },
    {
      title: "Left Side View",
      status: "finish",
      icon: <FaCarSide />,
    },
  ];

  const getViewTypeMsg = async () => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("view");
    setViewType("Take a photo of the car's " + type);
  };

  useEffect(() => {
    getViewTypeMsg();
  }, []);

  const formData = new FormData();

  function handleTakePhoto(dataUri) {
    const byteString = atob(dataUri.split(",")[1]);
    const mimeString = dataUri.split(",")[0].split(":")[1].split(";")[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const image = new Blob([ab], { type: mimeString });

    console.log(getCurrentStepData(), "getCurrentStepData");

    const current_step = getCurrentStepData();

    formData.append(current_step.title, image);

    PostApi(
      "upload-360view?inspection=" + "SU5TUEVDXzU4Nl80NjU1Nw==",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
      .then((res) => {
        if (current_step.title == "Left Side View") {
          navigate("/?inspection=" + inspectionToken, {
            state: { currentIndex: main_index },
          });
        }
      })
      .catch((err) => {
        console.log("opps something went wrong");
      });

    console.log("Photo taken in Blob:", image);
    next();
  }

  function handleCameraError(error) {
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
        <div className="current-view-text">
          <Steps current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} icon={item.icon} />
            ))}
          </Steps>
        </div>
        <div className="overlay-text">
          <p>Please point your camera at car.</p>
        </div>
      </div>
    </>
  );
};

export default Capture;
