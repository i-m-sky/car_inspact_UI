import React, { useState } from "react";
import { Drawer, Space } from "antd";
import { FaCamera } from "react-icons/fa";
import { ImFolderUpload } from "react-icons/im";
import Carousel from "react-multi-carousel";
import CarFront from "../../Assets/CarFront.png";
import CarBack from "../../Assets/CarBack.png";
import FrontWindshield from "../../Assets/FrontWindshield.png";
import BackWindshield from "../../Assets/BackWindshield.png";
import "react-multi-carousel/lib/styles.css";
import "./mobile.css";

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

const sliderImageUrl = [
  {
    text: "Front View",
    url: CarFront,
  },
  {
    text: "Rear View",
    url: CarBack,
  },
  {
    text: "Back Windshield",
    url: BackWindshield,
  },
  {
    text: "Front Windshield",
    url: FrontWindshield,
  },
];

const Mobile = () => {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("camera");
  const [currentView, setCurrentView] = useState("");

  const [images, setImages] = useState({
    "Front View": [],
    "Rear View": [],
    "Back Windshield": [],
    "Front Windshield": [],
  });

  const showDrawer = (view) => {
    setCurrentView(view);
    setOpen(true);
  };
  const onClose = () => setOpen(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImages((prevImages) => ({
          ...prevImages,
          [currentView]: [...(prevImages[currentView] || []), base64String],
        }));
      };
      reader.readAsDataURL(file);
    });
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
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-12">
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
                {sliderImageUrl.map((image, index) => (
                  <div key={index} className="slider text-center">
                    <div>
                      <span className="img-type">{image.text}</span>
                    </div>
                    <div id="image-container">
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
                        onClick={() => showDrawer(image.text)}
                      />
                    </div>
                  </div>
                ))}
              </Carousel>
              <div className="d-flex justify-content-center align-items-center">
                <button type="submit" className="sbmt-btn">
                  Submit and Upload
                </button>
              </div>
            </form>
          </div>
        </div>
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
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Mobile;
