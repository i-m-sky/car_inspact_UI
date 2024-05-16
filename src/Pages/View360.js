import React, { useRef, useState } from "react";
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
import { GetApi, PostApi } from "../Services/Service";
import { Image, Spin } from "antd";

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
    text: "front_view",
    url: CarFront,
  },
  {
    text: "rear_view",
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

const View360 = () => {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("camera");
  const [currentView, setCurrentView] = useState("");
  const [checkedImages, setCheckedImages] = useState(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const [view360, setView360] = useState(true);
  const [images, setImages] = useState({
    front_view: [],
    rear_view: [],
    back_windshield: [],
    "Front Windshield": [],
  });

  const showDrawer = (view) => {
    if (view == "Images Capture") {
      setView360(false);
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
    onClose();
  };

  const triggerFileInput = (type) => {
    console.log(type, "type======");
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
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();

    for (const [label, files] of Object.entries(images)) {
      files.forEach((file, index) => {
        formData.append(`${label}`, file);
      });
    }

    PostApi("/predict", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setCheckedImages(res);
        setLoading(false);
        containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-12" ref={containerRef}>
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
                  <div key={index} className="view360slider text-center">
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

export default View360;
