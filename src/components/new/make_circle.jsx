import { useState, useEffect } from "react";

function MakeCircle({ phase }) {
  // 배경 원 효과
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

  return <div className="circle" style={circleStyle} />;
}

export { MakeCircle };
