import React, { useEffect, useRef, useState } from "react";
import { Drawer, Space } from "antd";
import { FaCamera } from "react-icons/fa";
import { ImFolderUpload } from "react-icons/im";
import Carousel from "react-multi-carousel";
import CarFront from "../Assets/images/CarFront.png";
import CarBack from "../Assets/images/CarBack.png";
import FrontWindshield from "../Assets/images/FrontWindshield.png";
import BackWindshield from "../Assets/images/BackWindshield.png";
import "react-multi-carousel/lib/styles.css";
import "../Assets/css/view360.css";
import { Image, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import LoadingBar from "../components/LoadingBar";
import Auth from "../Services/Auth";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
    slidesToSlide: 3,
  },
  mobile: {
    breakpoint: { max: 767, min: 464 },
    items: 3,
    slidesToSlide: 1,
  },
};

const HomeViewUrls = [
  {
    text: "FrontView",
    url: CarFront,
    uploaded: false,
  },
  {
    text: "BackView",
    url: CarBack,
    uploaded: false,
  },
  {
    text: "FrontWindshield",
    url: FrontWindshield,
    uploaded: false,
  },
  {
    text: "BackWindshield",
    url: BackWindshield,
    uploaded: false,
  },
];

const View360 = () => {
  const [open, setOpen] = useState(false);
  const [loadingBar, setLoadingBar] = useState(true);
  const [selectedType, setSelectedType] = useState("camera");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [uploadedImageIndexs, setUploadedImageIndex] = useState([]);
  const [currentView, setCurrentView] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const [scannerLoader, setScannerLoader] = useState(false);
  const [images, setImages] = useState({});
  const [checkedImages, setCheckedImages] = useState(null);
  const navigate = useNavigate();
  const [inspectionToken, setInspectionToken] = useState(false);
  const [inspection, setInspection] = useState("");

  const showDrawer = (view, index) => {
    setCurrentIndex(index);
    if (view == "Images Capture") {
      setCurrentView(view);
      return;
    }
    setCurrentView(view);
    setOpen(true);
  };

  const onClose = () => setOpen(false);

  const handleFileChange = (event) => {
    const files = event.target.files[0];
    setImages((prevImages) => ({
      ...prevImages,
      [currentView]: [...(prevImages[currentView] || []), files],
    }));
    setUploadedImageIndex((uploadedImageIndexs) => [
      ...uploadedImageIndexs,
      currentIndex,
    ]);
    onClose();
  };

  const triggerFileInput = (type) => {
    const fileInput = document.getElementById("upload-btn");
    if (fileInput) {
      if (type === "camera") {
        fileInput.setAttribute("capture", "environment");
        fileInput.accept = "image/*";
      } else {
        fileInput.removeAttribute("capture");
        fileInput.accept = "*/*";
      }
      fileInput.click();
    }
  };

  const handleSubmit = (e) => {
    navigate("/?inspection=" + inspection, { state: { view360: images } });
  };

  const verifyInspectionToken = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("inspection");
    setInspection(token);
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
    verifyInspectionToken();
    setTimeout(() => {
      setLoadingBar(false);
    }, 1600);
  }, []);

  return (
    <>
      {inspectionToken ? (
        <div className="container-fluid mt-4">
          <div className="row">
            <div className="col-md-12" ref={containerRef}>
              {loadingBar ? (
                <LoadingBar />
              ) : (
                <div className="parent mb-4">
                  <span className="main-heading">
                    Please Upload Images click on the section below start the
                    inspection.
                  </span>

                  <form onSubmit={handleSubmit}>
                    <Carousel
                      responsive={responsive}
                      dotListClass="custom-dot-list-style"
                    >
                      {HomeViewUrls.map((image, index) => (
                        <div key={index} className="slider text-center">
                          <div>
                            <span className="img-type">{image.text}</span>
                          </div>
                          <div>
                            <img
                              src={image.url}
                              alt="Uploaded Image"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                cursor: "pointer",
                              }}
                              onClick={() => showDrawer(image.text, index)}
                              className={
                                uploadedImageIndexs.includes(index)
                                  ? "uploaded_360"
                                  : ""
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </Carousel>
                    <div className="d-flex justify-content-center align-items-center">
                      {loading ? (
                        <Spin />
                      ) : (
                        <button type="submit" className="sbmt-btn">
                          Submit and Upload
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>

            {checkedImages &&
              Object.entries(checkedImages).map(([key, value]) => (
                <div className="col-4 mt-5 mb-3">
                  <Image width={200} src={value.checked_image_path} />
                </div>
              ))}
          </div>

          <Drawer
            placement="bottom"
            height={130}
            onClose={onClose}
            open={open}
            headerStyle={{ display: "none" }}
            closeIcon={null}
            extra={<Space />}
            className="upload-file-drawer"
          >
            <div>
              <h5 className="text-center">Choose an Action</h5>
              <div className="d-flex">
                <div className="upload-btns">
                  <div className="cam-btn text-center">
                    <FaCamera
                      size={35}
                      onClick={() => triggerFileInput("camera")}
                    />
                  </div>
                  <div className="text-center">Camera</div>
                </div>
                <div className="upload-btns">
                  <div className="cam-btn text-center">
                    <ImFolderUpload
                      size={35}
                      onClick={() => triggerFileInput("files")}
                    />
                  </div>
                  <div className="text-center">Files</div>
                </div>
              </div>
            </div>
          </Drawer>
          <input
            type="file"
            id="upload-btn"
            accept="image/*"
            capture={selectedType}
            // multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div>
          <p>Error: Token is expired or invalid </p>
        </div>
      )}
    </>
  );
};

export default View360;
