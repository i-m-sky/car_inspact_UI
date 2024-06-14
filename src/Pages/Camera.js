import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image360 from "../Assets/images/360.jpg";
import VIN from "../Assets/images/Vin.jpeg";
import Odometer from "../Assets/images/odometer.jpeg";
import Damage from "../Assets/images/Carscan.jpeg";
import NumberPlate from "../Assets/images/Number.jpeg";
import "../Assets/css/main.css";

export default function SimpleSlider() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };
  return (
    <Slider {...settings}>
      <div>
        <img
          src={Image360}
          role="presentation"
          style={{
            width: "75%",
            height: "75%",
            objectFit: "cover",
            cursor: "pointer",
          }}
        />
      </div>
      <div>
        <img
          src={VIN}
          role="presentation"
          style={{
            width: "70%",
            height: "70%",
            objectFit: "cover",
            cursor: "pointer",
          }}
        />
      </div>
      <div>
        <img
          src={Odometer}
          role="presentation"
          style={{
            width: "70%",
            height: "70%",
            objectFit: "cover",
            cursor: "pointer",
          }}
        />
      </div>
      <div>
        <img
          src={Damage}
          role="presentation"
          style={{
            width: "70%",
            height: "70%",
            objectFit: "cover",
            cursor: "pointer",
          }}
        />
      </div>
    </Slider>
  );
}

// import React from "react";
// import AliceCarousel from "react-alice-carousel";
// import "react-alice-carousel/lib/alice-carousel.css";
// import Image360 from "../Assets/images/360.jpg";
// import VIN from "../Assets/images/Vin.jpeg";
// import Odometer from "../Assets/images/odometer.jpeg";
// import Damage from "../Assets/images/Carscan.jpeg";
// import NumberPlate from "../Assets/images/Number.jpeg";

// const responsive = {
//   0: { items: 1 },
//   568: { items: 3 },
//   1024: { items: 4 },
// };

// const items = [
//   <div className="item" data-value="1">
//     <img
//       src={Image360}
//       role="presentation"
//       style={{
//         width: "50%",
//         height: "50%",
//         objectFit: "cover",
//         cursor: "pointer",
//       }}
//     />
//     ,
//   </div>,
//   <div className="item" data-value="2">
//     <img
//       src={VIN}
//       role="presentation"
//       style={{
//         width: "50%",
//         height: "50%",
//         objectFit: "cover",
//         cursor: "pointer",
//       }}
//     />
//     ,
//   </div>,
//   <div className="item" data-value="3">
//     <img
//       src={Odometer}
//       role="presentation"
//       style={{
//         width: "50%",
//         height: "50%",
//         objectFit: "cover",
//         cursor: "pointer",
//       }}
//     />
//   </div>,
//   <div className="item" data-value="4">
//     <img
//       src={Damage}
//       role="presentation"
//       style={{
//         width: "50%",
//         height: "50%",
//         objectFit: "cover",
//         cursor: "pointer",
//       }}
//     />
//   </div>,
// ];

// const Camera = () => (
//   <AliceCarousel
//     mouseTracking
//     items={items}
//     responsive={responsive}
//     controlsStrategy="alternate"
//   />
// );

// export default Camera;
