import { useEffect, useState } from "react";
import "../Assets/css/CarDirectionGuide.css";
import Car from "../Assets/images/Car.png";

const CarDirectionGuide = (props) => {
  const [current_dot_class, setCurrentDotClass] = useState("");

  const dot_classes = {
    FrontView: "front-dot",
    RightFrontWindow: "right-front-dot",
    RightView: "right-dot",
    RightRearWindow: "right-rear-dot",
    RearView: "rear-dot",
    LeftRearWindow: "left-rear-dot",
    LeftView: "left-dot",
    LeftFrontWindow: "left-front-dot",
  };

  const getClassByName = (name) => {
    return dot_classes[name];
  };

  useEffect(() => {
    const curr_class = getClassByName(props.current_active_side);
    setCurrentDotClass(curr_class);
    console.log(curr_class, "curr_class");
  }, [props.current_active_side]);

  return (
    <>
      <div class="outer">
        <div class="line line1"></div>
        <div class="line line2"></div>
        <div class="line line3"></div>
        <div class="line line4"></div>
        <div class={`dot ${current_dot_class && current_dot_class}`}></div>
        <div class="mid">
          <img src={Car} class="inner"></img>
        </div>
      </div>
    </>
  );
};

export default CarDirectionGuide;
