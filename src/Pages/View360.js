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
import "../Assets/css/view360.css";
import Auth from "../Services/Auth";

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
  const [not_image_upload, setNotImageUpload] = useState(false);
  const [main_index, setMainIndex] = useState(null);
  const [inspection, setInspection] = useState("");
  const [loadingBar, setLoadingBar] = useState(true);

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
    if (view === "View 360") {
      navigate(
        "/view360?inspection=" + inspectionToken + "&current_index=" + index
      );
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

  const handleSubmit = (e) => {
    navigate("/?inspection=" + inspection, {
      state: { view360: images, currentIndex: main_index },
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
                          width: "60%",
                          aspectRatio: "1 / 1",
                          objectFit: "cover",
                          cursor: "pointer",
                          border: "1.5px solid #cec0c0",
                          borderRadius: "10px",
                          padding: "18px",
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

// import React, { useEffect, useRef, useState } from "react";
// import { Drawer, Space } from "antd";
// import { FaCamera } from "react-icons/fa";
// import { ImFolderUpload } from "react-icons/im";
// import Carousel from "react-multi-carousel";
// import CarFront from "../Assets/images/CarFront.png";
// import CarBack from "../Assets/images/CarBack.png";
// import FrontWindshield from "../Assets/images/FrontWindshield.png";
// import BackWindshield from "../Assets/images/BackWindshield.png";
// import "react-multi-carousel/lib/styles.css";
// import "../Assets/css/view360.css";
// import { Image, Spin } from "antd";
// import { useNavigate } from "react-router-dom";
// import LoadingBar from "../components/LoadingBar";
// import Auth from "../Services/Auth";

// const responsive = {
//   desktop: {
//     breakpoint: { max: 3000, min: 1024 },
//     items: 3,
//     slidesToSlide: 4,
//   },
//   tablet: {
//     breakpoint: { max: 1024, min: 768 },
//     items: 3,
//     slidesToSlide: 3,
//   },
//   mobile: {
//     breakpoint: { max: 767, min: 464 },
//     items: 3,
//     slidesToSlide: 1,
//   },
// };

// const HomeViewUrls = [
//   {
//     text: "FrontView",
//     url: CarFront,
//     uploaded: false,
//   },
//   {
//     text: "BackView",
//     url: CarBack,
//     uploaded: false,
//   },
//   {
//     text: "FrontWindshield",
//     url: FrontWindshield,
//     uploaded: false,
//   },
//   {
//     text: "BackWindshield",
//     url: BackWindshield,
//     uploaded: false,
//   },
// ];

// const View360 = () => {
//   const [open, setOpen] = useState(false);
//   const [loadingBar, setLoadingBar] = useState(true);
//   const [selectedType, setSelectedType] = useState("camera");
//   const [currentIndex, setCurrentIndex] = useState(null);
//   const [uploadedImageIndexs, setUploadedImageIndex] = useState([]);
//   const [currentView, setCurrentView] = useState("");
//   const [loading, setLoading] = useState(false);
//   const containerRef = useRef(null);
//   const [scannerLoader, setScannerLoader] = useState(false);
//   const [images, setImages] = useState({});
//   const [checkedImages, setCheckedImages] = useState(null);
//   const navigate = useNavigate();
//   const [inspectionToken, setInspectionToken] = useState(false);
//   const [inspection, setInspection] = useState("");
//   const [main_index, setMainIndex] = useState(null);

//   const showDrawer = (view, index) => {
//     setCurrentIndex(index);
//     if (view == "Images Capture") {
//       setCurrentView(view);
//       return;
//     }
//     setCurrentView(view);
//     setOpen(true);
//   };

//   const onClose = () => setOpen(false);

//   const handleFileChange = (event) => {
//     const files = event.target.files[0];
//     setImages((prevImages) => ({
//       ...prevImages,
//       [currentView]: [...(prevImages[currentView] || []), files],
//     }));
//     setUploadedImageIndex((uploadedImageIndexs) => [
//       ...uploadedImageIndexs,
//       currentIndex,
//     ]);
//     onClose();
//   };

//   const triggerFileInput = (type) => {
//     const fileInput = document.getElementById("upload-btn");
//     if (fileInput) {
//       if (type === "camera") {
//         fileInput.setAttribute("capture", "environment");
//         fileInput.accept = "image/*";
//       } else {
//         fileInput.removeAttribute("capture");
//         fileInput.accept = "*/*";
//       }
//       fileInput.click();
//     }
//   };

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const index = params.get("current_index");
//     setMainIndex(index);
//   }, []);

//   const verifyInspectionToken = async () => {
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get("inspection");
//     setInspection(token);
//     if (!token) {
//       setInspectionToken(false);
//       return;
//     }
//     try {
//       const res = await Auth.verify_inpection_token(token);
//       if (res.data.status) {
//         setInspectionToken(true);
//       }
//     } catch (e) {
//       setInspectionToken(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     navigate("/?inspection=" + inspection, {
//       state: { view360: images, currentIndex: main_index },
//     });
//   };

//   useEffect(() => {
//     verifyInspectionToken();
//     setTimeout(() => {
//       setLoadingBar(false);
//     }, 1600);
//   }, []);

//   return (
//     <>
//       {inspectionToken ? (
//         <div className="container-fluid mt-4">
//           <div className="row">
//             <div className="col-md-12" ref={containerRef}>
//               {loadingBar ? (
//                 <LoadingBar />
//               ) : (
//                 <div className="parent mb-4">
//                   <span className="main-heading">
//                     Please Upload Images click on the section below start the
//                     inspection.
//                   </span>

//                   <form onSubmit={handleSubmit}>
//                     <Carousel
//                       responsive={responsive}
//                       dotListClass="custom-dot-list-style"
//                     >
//                       {HomeViewUrls.map((image, index) => (
//                         <div key={index} className="slider text-center">
//                           <div>
//                             <span className="img-type">{image.text}</span>
//                           </div>
//                           <div>
//                             <img
//                               src={image.url}
//                               alt="Uploaded Image"
//                               style={{
//                                 width: "100%",
//                                 height: "100%",
//                                 objectFit: "cover",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => showDrawer(image.text, index)}
//                               className={
//                                 uploadedImageIndexs.includes(index)
//                                   ? "uploaded_360"
//                                   : ""
//                               }
//                             />
//                           </div>
//                         </div>
//                       ))}
//                     </Carousel>
//                     <div className="d-flex justify-content-center align-items-center">
//                       {loading ? (
//                         <Spin />
//                       ) : (
//                         <button type="submit" className="sbmt-btn">
//                           Upload
//                         </button>
//                       )}
//                     </div>
//                   </form>
//                 </div>
//               )}
//             </div>

//             {checkedImages &&
//               Object.entries(checkedImages).map(([key, value]) => (
//                 <div className="col-4 mt-5 mb-3">
//                   <Image width={200} src={value.checked_image_path} />
//                 </div>
//               ))}
//           </div>

//           <Drawer
//             placement="bottom"
//             height={130}
//             onClose={onClose}
//             open={open}
//             headerStyle={{ display: "none" }}
//             closeIcon={null}
//             extra={<Space />}
//             className="upload-file-drawer"
//           >
//             <div>
//               <h5 className="text-center">Choose an Action</h5>
//               <div className="d-flex">
//                 <div className="upload-btns">
//                   <div className="cam-btn text-center">
//                     <FaCamera
//                       size={35}
//                       onClick={() => triggerFileInput("camera")}
//                     />
//                   </div>
//                   <div className="text-center">Camera</div>
//                 </div>
//                 <div className="upload-btns">
//                   <div className="cam-btn text-center">
//                     <ImFolderUpload
//                       size={35}
//                       onClick={() => triggerFileInput("files")}
//                     />
//                   </div>
//                   <div className="text-center">Files</div>
//                 </div>
//               </div>
//             </div>
//           </Drawer>
//           <input
//             type="file"
//             id="upload-btn"
//             accept="image/*"
//             capture={selectedType}
//             // multiple
//             style={{ display: "none" }}
//             onChange={handleFileChange}
//           />
//         </div>
//       ) : (
//         <div>
//           <p>Error: Token is expired or invalid </p>
//         </div>
//       )}
//     </>
//   );
// };

// export default View360;
