import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Assets/css/Carousel.css";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { Alert, Drawer, Space } from "antd";
import { FaCamera } from "react-icons/fa";
import { ImFolderUpload } from "react-icons/im";
import { Spin, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CarFront from "../Assets/images/CarFront.png";
import CarBack from "../Assets/images/CarBack.png";
import FrontWindshield from "../Assets/images/FrontWindShield.png";
import BackWindshield from "../Assets/images/BackWindShield.png";
import RightRearWindow from "../Assets/images/RRW2.jpg";
import RightFrontWindow from "../Assets/images/LFW.jpg";
import LeftRearWindow from "../Assets/images/LRW.jpg";
import LeftFrontWindow from "../Assets/images/RFW.jpg";
import "../Assets/css/view360.css";
import Auth from "../Services/Auth";
import { PostApi } from "../Services/Service";

const View360 = () => {
  const Scanned_Types = [
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
      text: "RightRearWindow",
      url: RightRearWindow,
      uploaded: false,
    },
    {
      text: "RightFrontWindow",
      url: RightFrontWindow,
      uploaded: false,
    },
    {
      text: "LeftRearWindow",
      url: LeftRearWindow,
      uploaded: false,
    },
    {
      text: "LeftFrontWindow",
      url: LeftFrontWindow,
      uploaded: false,
    },
    {
      text: "BackWindshield",
      url: BackWindshield,
      uploaded: false,
    },
    {
      text: "FrontWindshield",
      url: FrontWindshield,
      uploaded: false,
    },
  ];

  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("camera");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [uploadedImageIndexs, setUploadedImageIndex] = useState([]);
  const [currentView, setCurrentView] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const [scannerLoader, setScannerLoader] = useState(false);
  const [images, setImages] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [inspectionToken, setInspectionToken] = useState("");
  const [isVerifyInspectionToken, setIsVerifyInspectionToken] = useState("");
  const [not_image_upload, setNotImageUpload] = useState(false);
  const [main_index, setMainIndex] = useState(null);
  const [inspection, setInspection] = useState("");
  const [loadingBar, setLoadingBar] = useState(true);
  const [cameraOpen, setCameraOpen] = useState(false);

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
    const itemsMainDiv = ".MultiCarousel";
    const itemsDiv = ".MultiCarousel-inner";
    let itemWidth = "";

    $(".leftLst, .rightLst").click(function () {
      const condition = $(this).hasClass("leftLst");
      if (condition) click(0, this);
      else click(1, this);
    });

    ResCarouselSize();

    $(window).resize(function () {
      ResCarouselSize();
    });

    function ResCarouselSize() {
      const itemsMainDivWidth = $(itemsMainDiv).width();
      const bodyWidth = $("body").width();
      let visibleItems = 4;

      if (bodyWidth < 768) {
        visibleItems = 4;
      } else if (bodyWidth >= 768 && bodyWidth < 992) {
        visibleItems = 3;
      } else if (bodyWidth >= 992 && bodyWidth < 1200) {
        visibleItems = 5;
      } else {
        visibleItems = 6;
      }

      itemWidth = itemsMainDivWidth / visibleItems;

      $(itemsDiv).each(function () {
        const itemNumbers = $(this).find(".item").length;
        $(this).css({
          transform: "translateX(0px)",
          width: itemWidth * itemNumbers,
        });

        $(this)
          .find(".item")
          .each(function () {
            $(this).outerWidth(itemWidth);
          });

        $(".leftLst").addClass("over");
        $(".rightLst").removeClass("over");
      });
    }

    function ResCarousel(e, el, s) {
      const leftBtn = ".leftLst";
      const rightBtn = ".rightLst";
      const divStyle = $(`${el} ${itemsDiv}`).css("transform");
      const values = divStyle.match(/-?[\d\.]+/g);
      const xds = Math.abs(values[4]);

      if (e === 0) {
        let translateXval = parseInt(xds) - parseInt(itemWidth * s);
        $(`${el} ${rightBtn}`).removeClass("over");

        if (translateXval <= itemWidth / 2) {
          translateXval = 0;
          $(`${el} ${leftBtn}`).addClass("over");
        }
        $(`${el} ${itemsDiv}`).css(
          "transform",
          `translateX(${-translateXval}px)`
        );
      } else if (e === 1) {
        const itemsCondition = $(el).find(itemsDiv).width() - $(el).width();
        let translateXval = parseInt(xds) + parseInt(itemWidth * s);
        $(`${el} ${leftBtn}`).removeClass("over");

        if (translateXval >= itemsCondition - itemWidth / 2) {
          translateXval = itemsCondition;
          $(`${el} ${rightBtn}`).addClass("over");
        }
        $(`${el} ${itemsDiv}`).css(
          "transform",
          `translateX(${-translateXval}px)`
        );
      }
    }

    function click(ell, ee) {
      const Parent = `#${$(ee).parent().attr("id")}`;
      const slide = $(Parent).attr("data-slide");
      ResCarousel(ell, Parent, slide);
    }
  }, []);

  const showDrawer = (view, index) => {
    setCurrentIndex(index);

    navigate(
      "/capture?inspection=" +
        inspectionToken +
        "&current_index=" +
        index +
        "&view=" +
        view
    );

    // if (view === "View 360") {
    //   navigate(
    //     "/view360?inspection=" + inspectionToken + "&current_index=" + index
    //   );
    //   setCurrentView(view);
    // } else {
    //   setCurrentView(view);
    //   setOpen(true);
    // }
  };

  const onClose = () => setOpen(false);

  const handleFileChange = (event) => {
    event.preventDefault();
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const index = params.get("current_index");
    setMainIndex(index);
  }, []);

  const verifyInspectionToken = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("inspection");
    setInspection(token);
    if (!token) {
      setIsVerifyInspectionToken(false);
      return;
    }
    try {
      const res = await Auth.verify_inpection_token(token);
      if (res.data.status) {
        setIsVerifyInspectionToken(true);
      }
    } catch (e) {
      setIsVerifyInspectionToken(false);
    }
  };

  // const handleSubmit = (e) => {
  //   // upload-360view
  //   e.preventDefault();
  //   navigate("/?inspection=" + inspection, {
  //     state: { view360: images, currentIndex: main_index },
  //   });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    if (Object.keys(images).length < 1) {
      alert("Please upload an image");
      setLoading(false);
      return;
    }
    const formData = new FormData();

    for (const [label, files] of Object.entries(images)) {
      files.forEach((file, index) => {
        formData.append(`${label}`, file);
      });
    }

    PostApi("/upload-360view?inspection=" + inspectionToken, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        if (res.status) {
          setLoading(false);
          navigate("/?inspection=" + inspection, {
            state: { view360: images, currentIndex: main_index },
          });
        } else {
          alert("Something went wrong please upload again");
        }
      })
      .catch((err) => {
        setLoading(false);
        alert("Something went wrong please upload again");
      });
  };

  useEffect(() => {
    verifyInspectionToken();
    setTimeout(() => {
      setLoadingBar(false);
    }, 1600);
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <form onSubmit={handleSubmit}>
            <p className="mt-3 text-dark">
              <strong>
                Please upload images by clicking on the sections below to start
                the inspection.
              </strong>
            </p>
            <div
              className="MultiCarousel"
              data-items="4,3,5,6"
              data-slide="1"
              id="MultiCarousel"
              data-interval="1000"
            >
              <div className="MultiCarousel-inner">
                {Scanned_Types.map((image, index) => (
                  <div
                    key={index}
                    className="item text-center"
                    style={{ lineHeight: "1px" }}
                  >
                    <p
                      className={
                        uploadedImageIndexs.includes(index)
                          ? "uploaded_360-text-color"
                          : "text-dark"
                      }
                    >
                      <strong>{image.text}</strong>
                    </p>
                    <img
                      id="uploaded-image"
                      src={image.url}
                      alt={image.text}
                      style={{
                        width: "50%",
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                        cursor: "pointer",
                        border: "1.5px solid #cec0c0",
                        borderRadius: "10px",
                        padding: "25px",
                      }}
                      className={
                        uploadedImageIndexs.includes(index)
                          ? "uploaded_360"
                          : ""
                      }
                      onClick={() => showDrawer(image.text, index)}
                    />
                  </div>
                ))}
              </div>
              <span className="leftLst">
                <MdOutlineKeyboardDoubleArrowLeft size={50} />
              </span>
              <span className="rightLst">
                <MdOutlineKeyboardDoubleArrowRight size={50} />
              </span>
            </div>
            {not_image_upload && (
              <Alert type="error" message="Please Upload Images" banner />
            )}
            <div className="text-center">
              {loading ? (
                <Spin />
              ) : (
                <>
                  <button type="submit" className="sbmt-btn mt-3">
                    Upload
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
        <Drawer
          placement="bottom"
          height={130}
          onClose={onClose}
          open={open}
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
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </>
  );
};

export default View360;
