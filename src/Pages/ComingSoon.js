import React, { useState, useEffect } from "react";
import "../Assets/css/commingsoon.css";

const ComingSoon = () => {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const countDownDate = new Date("June 1, 2024 00:00:00").getTime();

    const intervalId = setInterval(() => {
      const now = new Date().getTime();

      const distance = countDownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const countdownString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      setCountdown(countdownString);

      if (distance < 0) {
        clearInterval(intervalId);
        setCountdown("EXPIRED");
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="coming-container">
      <h1>Coming Soon</h1>
      <p>Our website is under construction</p>
      <div className="countdown">{countdown}</div>
    </div>
  );
};

export default ComingSoon;
