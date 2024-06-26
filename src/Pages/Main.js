import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Assets/css/Carousel.css";
import Image360 from "../Assets/images/360U.jpg";
import VIN from "../Assets/images/VinU.jpg";
import Odometer from "../Assets/images/odometerU.jpg";
import Damage from "../Assets/images/CarscanU.jpg";
import NumberPlate from "../Assets/images/Number.jpeg";
import { GrNext, GrPrevious } from "react-icons/gr";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { Alert, Drawer, Space } from "antd";
import { FaCamera } from "react-icons/fa";
import { ImFolderUpload } from "react-icons/im";
import "../Assets/css/main.css";
import { GetApi, PostApi } from "../Services/Service";
import { Image, Spin, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import ScannerLoader from "./ScannerLoader";
import { useLocation } from "react-router-dom";

const Camera = () => {
  const Scanned_Types = [
    {
      text: "View 360",
      url: Image360,
      uploaded: false,
    },
    {
      text: "VIN",
      url: VIN,
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
  const [not_image_upload, setNotImageUpload] = useState(false);
  const [customMsg, setCustomMsg] = useState("Please Upload Images");
  const formRef = useRef(null); // Create a ref for the form

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
      let incno = 0;
      const dataItems = "data-items";
      const itemClass = ".item";
      let id = 0;
      let btnParentSb = "";
      let itemsSplit = "";
      const sampwidth = $(itemsMainDiv).width();
      const bodyWidth = $("body").width();

      $(itemsDiv).each(function () {
        id = id + 1;
        const itemNumbers = $(this).find(itemClass).length;
        btnParentSb = $(this).parent().attr(dataItems);
        itemsSplit = btnParentSb.split(",");

        $(this).parent().attr("id", `MultiCarousel${id}`);

        if (bodyWidth < 768) {
          // Show 3 items when width is less than 768px
          incno = itemsSplit[1]; // Index 1 corresponds to 3 items
          itemWidth = sampwidth / incno;
        } else if (bodyWidth >= 768 && bodyWidth < 992) {
          incno = itemsSplit[1]; // Show 3 items
          itemWidth = sampwidth / incno;
        } else if (bodyWidth >= 992 && bodyWidth < 1200) {
          incno = itemsSplit[2]; // Show 5 items
          itemWidth = sampwidth / incno;
        } else {
          incno = itemsSplit[3]; // Show 6 items
          itemWidth = sampwidth / incno;
        }

        $(this).css({
          transform: "translateX(0px)",
          width: itemWidth * itemNumbers,
        });

        $(this)
          .find(itemClass)
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
    // if (
    //   view === "View 360" &&
    //   Object.keys(location?.state?.view360 ?? {}).length > 0
    // ) {
    //   return;
    // }
    if (view === "View 360") {
      navigate(
        "/capture?inspection=" +
          inspectionToken +
          "&current_index=" +
          index +
          "&view=" +
          view
      );
      // navigate(
      //   "/view360?inspection=" + inspectionToken + "&current_index=" + index
      // );
      setCurrentView(view);
      return;
    }
    setCurrentView(view);
    setOpen(true);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      Object.keys(images).length < 1 &&
      Object.keys(location?.state?.view360 ?? {}).length < 1
    ) {
      setNotImageUpload(true);
      setTimeout(() => {
        setNotImageUpload(false);
      }, 5000);
      return;
    }

    if (
      !Object.keys(images).includes("VIN") &&
      !Object.keys(images).includes("Odometer")
    ) {
      setCustomMsg("Please Upload One Image Either VIN or Odometer");
      setNotImageUpload(true);
      setTimeout(() => {
        setNotImageUpload(false);
      }, 5000);
      return;
    }

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
        navigate("/submitted?report_url=" + res.url);
        containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
      })
      .catch((err) => {
        setScannerLoader(false);
        console.log("opps something went wrong");
      });
  };

  useEffect(() => {
    if (
      location?.state?.currentIndex &&
      Object.keys(location?.state?.view360 ?? {}).length > 0
    ) {
      openMessage();
      setUploadedImageIndex((uploadedImageIndexs) => [
        ...uploadedImageIndexs,
        Number(location?.state?.currentIndex),
      ]);
    }
  }, []);

  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";
  const openMessage = () => {
    messageApi.open({
      key,
      type: "loading",
      content: "Uploading...",
    });
    setTimeout(() => {
      messageApi.open({
        key,
        type: "success",
        content: "360 view Image Uploaded",
        duration: 2,
      });
    }, 1000);
  };

  return (
    <>
      {contextHolder}
      <div className="container-fluid">
        <div className="row">
          {scannerLoader ? (
            <ScannerLoader />
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="mt-2 text-dark">
                <strong>
                  Please upload images by clicking on the sections below to
                  start the inspection.
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
                      className="item text-center w-25"
                      style={{ lineHeight: "1px" }}
                    >
                      <p className="text-dark">
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
                        }}
                        className={
                          uploadedImageIndexs.includes(index) ? "uploaded" : ""
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
                <Alert type="error" message={customMsg} banner />
              )}
              <div className="text-center">
                {loading ? (
                  <Spin />
                ) : (
                  <>
                    <button type="submit" className="sbmt-btn mt-1">
                      Upload and Submit
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
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

export default Camera;
