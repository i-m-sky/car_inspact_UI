import CarFront from "../../Assets/CarFront.png";
import CarBack from "../../Assets/CarBack.png";
import FrontWindshield from "../../Assets/FrontWindshield.png";
import BackWindshield from "../../Assets/BackWindshield.png";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
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
  const [imageSrc, setImageSrc] = useState("placeholder.jpg");

  // Function to handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to trigger file input click
  const handleImageClick = () => {
    document.getElementById("upload-btn").click();
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
            <Carousel
              responsive={responsive}
              dotListClass="custom-dot-list-style"
            >
              <div className="slider text-center">
                <div className="">
                  <span className="img-type">Front View</span>
                </div>
                <div id="image-container">
                  <img
                    id="uploaded-image"
                    src={CarFront}
                    alt="Uploaded Image"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={handleImageClick}
                  />

                  <input
                    type="file"
                    id="upload-btn"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="slider text-center">
                <div className="">
                  <span className="img-type">Rear View</span>
                </div>

                <div id="image-container">
                  <img
                    id="uploaded-image"
                    src={CarBack}
                    alt="Uploaded Image"
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={handleImageClick}
                  />

                  <input
                    type="file"
                    id="upload-btn"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="slider text-center">
                <div className="">
                  <span className="img-type">Back Windshield</span>
                </div>

                <div id="image-container">
                  <img
                    id="uploaded-image"
                    src={BackWindshield}
                    alt="Uploaded Image"
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={handleImageClick}
                  />

                  <input
                    type="file"
                    id="upload-btn"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="slider text-center">
                <div className="">
                  <span className="img-type">Front Windshield</span>
                </div>

                <div id="image-container">
                  <img
                    id="uploaded-image"
                    src={FrontWindshield}
                    alt="Uploaded Image"
                    onClick={handleImageClick}
                    style={{
                      cursor: "pointer",
                    }}
                  />

                  <input
                    type="file"
                    id="upload-btn"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>
              </div>
    
            </Carousel>
            <div className="d-flex justify-content-center align-items-center">
              <button className="sbmt-btn">Submit and Upload</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Mobile;
