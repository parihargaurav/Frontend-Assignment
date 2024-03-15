/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import "./HomePage.css"; 

const HomePage = () => {
  const [direction, setDirection] = useState(1); 
  const [leftPosition, setLeftPosition] = useState(0); 
  const animateText = () => {
    const newLeftPosition = leftPosition + direction * 2;

    if (newLeftPosition >= 200 || newLeftPosition <= 0) {
      setDirection(direction * -1);
    }

    setLeftPosition(newLeftPosition);
  };

  useEffect(() => {
    const intervalId = setInterval(animateText, 50);

    return () => clearInterval(intervalId);
  }, [leftPosition, direction, animateText]);

  return (
    <div className="home-page">
      <div
        className="moving-text"
        style={{ left: `${leftPosition}px` }} 
      >
        Click on Logs and Metrics to proceed -- ⬆️⬆️
      </div>
    </div>
  );
};

export default HomePage;
