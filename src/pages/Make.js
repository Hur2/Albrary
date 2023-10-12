import React, { useState, useEffect } from "react";
import "../styles/Make.css";
import TextCreator from "../components/textCreator";
import ImageCreator from "../components/imageCreator";

function Make() {
  const [phase, setPhase] = useState(0); // 현재 책 만들기 단계, 0 : 프론트 1/2/3 : 배경 2 : 텍스트 3: 그림

  const handlePhaseChange = (newPhase) => {
    if (newPhase !== phase) {
      setPhase(newPhase);
    }
  };

  return (
    <>
      {phase === 0 ? (
        <MakeFrontCreator onPhaseChange={handlePhaseChange} />
      ) : null}
      {phase === 1 || phase === 2 || phase === 3 ? (
        <MakeCircle onPhaseChange={handlePhaseChange} />
      ) : null}
      {phase === 2 ? <TextCreator onPhaseChange={handlePhaseChange} /> : null}
      {phase === 3 ? <ImageCreator onPhaseChange={handlePhaseChange} /> : null}
    </>
  );
}

function MakeFrontCreator({ onPhaseChange }) {
  const handleImageClick = () => {
    onPhaseChange(1);
    setTimeout(() => {
      onPhaseChange(2);
    }, 250);
  };

  return (
    <div>
      <img
        src="img/make_front.png"
        alt="frontimage"
        onClick={handleImageClick}
      />
    </div>
  );
}

function MakeCircle() {
  // 배경 원 효과
  const [timing, setTiming] = useState(0); // 페이드 인 시작 타이밍
  const [circleStyle, setCircleStyle] = useState({ width: 0, height: 0 });
  const [isCircleVisible, setIsCircleVisible] = useState(true);

  const handleResize = () => {
    // 화면 크기만큼 원 크기(width, height) 변경
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const dest = Math.sqrt(
      Math.pow(screenWidth, 2) + Math.pow(screenHeight, 2)
    );

    setCircleStyle({
      width: `${dest}px`,
      height: `${dest}px`,
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setTiming(true);
    }, 750);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (isCircleVisible) {
      window.addEventListener("resize", handleResize);
      handleResize();
      document.body.style.overflow = "hidden";
    } else {
      setCircleStyle({ width: 0, height: 0 });
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isCircleVisible]);

  const handleButtonClick = () => {
    // 뒤로가기 버튼
    setIsCircleVisible(false);
  };

  return (
    <div className="circle-wrapper">
      <div className="circle" style={circleStyle}></div>
      {(isCircleVisible && timing) === true && (
        <div className="fade-in">
          <div className="buttonESC" onClick={handleButtonClick}>
            <img src="img/make_button_back.png" alt="backbutton" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Make;
