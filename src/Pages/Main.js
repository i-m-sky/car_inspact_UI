import React, { useEffect, useRef, useState } from "react";
import { Drawer, Space } from "antd";
import { FaCamera } from "react-icons/fa";
import { ImFolderUpload } from "react-icons/im";
import Carousel from "react-multi-carousel";
import Image360 from "../Assets/images/360.png";
import VIN from "../Assets/images/Vin.jpeg";
import Odometer from "../Assets/images/odometer.jpeg";
import Damage from "../Assets/images/Carscan.jpeg";
import NumberPlate from "../Assets/images/Number.jpeg";
import "react-multi-carousel/lib/styles.css";
import "../Assets/css/main.css";
import { GetApi, PostApi } from "../Services/Service";
import { Image, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import ScannerLoader from "./ScannerLoader";
import { useLocation } from "react-router-dom";

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
    text: "Images Capture",
    url: Image360,
    uploaded: false,
  },
  {
    text: "VIN",
    url: VIN,
    uploaded: false,
  },
  {
    text: "Number Plate",
    url: NumberPlate,
    uploaded: false,
  },
  {
    text: "Odometer",
    url: Odometer,
    uploaded: false,
  },
  {
    text: "Damage",
    url: Damage,
    uploaded: false,
  },
];

const Main = () => {
  const [open, setOpen] = useState(false);
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
  const location = useLocation();
  const [inspectionToken, setInspectionToken] = useState("");

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

  const showDrawer = (view, index) => {
    setCurrentIndex(index);
    if (view == "Images Capture") {
      navigate("/view360?inspection=" + inspectionToken);
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
    e.preventDefault();
    setScannerLoader(true);

    const formData = new FormData();

    for (const [label, files] of Object.entries(images)) {
      files.forEach((file, index) => {
        formData.append(`${label}`, file);
      });
    }

    if (location?.state?.view360) {
      for (const [label, files] of Object.entries(location?.state?.view360)) {
        files.forEach((file, index) => {
          formData.append(`${label}`, file);
        });
      }
    }

    PostApi("/predict?inspection=" + inspectionToken, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setCheckedImages(res);
        setScannerLoader(false);
        navigate("/submitted");
        containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
      })
      .catch((err) => {
        setScannerLoader(false);
        console.log(err);
      });
  };

  useEffect(() => {
    // console.log(location.state.view360);
  }, []);

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-12" ref={containerRef}>
          {scannerLoader ? (
            <ScannerLoader />
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
                  {HomeViewUrls &&
                    HomeViewUrls.map((image, index) => (
                      <div key={index} className="home-slider text-center">
                        <div>
                          <span className="img-type">{image.text}</span>
                        </div>
                        <img
                          id="uploaded-image"
                          src={image.url}
                          alt="Uploaded Image"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          className={
                            uploadedImageIndexs.includes(index)
                              ? "uploaded"
                              : ""
                          }
                          onClick={() => showDrawer(image.text, index)}
                        />
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
  );
};

export default Main;
