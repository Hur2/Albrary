import React, { useState, useEffect } from "react";

let backgroundLeft = 200; // background left
let backgroundTop = 280; // background top
let partBoxContainerLeft = 200;
let partBoxContainerTop = 70;
let backgroundSize = 512;

function MakeImage() {
  const [parts, setParts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("Make_image.json");
        if (!response.ok) {
          throw new Error("Failed to fetch base data");
        }

        const data = await response.json();

        //left top 값 주기
        const updatedParts = data.part.map((part) => ({
          ...part,
          top: 95,
          left: 200 + part.id * 150,
        }));

        setParts(updatedParts);
      } catch (error) {
        console.error("Error fetching base data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="image-wrapper">
      <div
        className="part-base-container"
        style={{ left: partBoxContainerLeft, top: partBoxContainerTop }}
      />
      {parts.map((part) => (
        <PartBox className="PartBox" key={part.id} part={part} />
      ))}
      <BackBox image="img/back.png" />

      <button className="image-btn-submit">제출하기</button>
    </div>
  );
}

function PartBox({ part }) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 200 + part.id * 150, y: 90 });
  const [initialPos, setInitialPos] = useState({
    x: 200 + part.id * 150,
    y: 90,
  });
  const [boxSize, setBoxSize] = useState(100);

  const handleDragStart = (e) => {
    setIsDragging(true);
    setInitialPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrag = (e) => {
    if (isDragging) {
      let newX = e.clientX - initialPos.x;
      let newY = e.clientY - initialPos.y;

      if (newX < backgroundLeft) {
        newX = backgroundLeft;
        setIsDragging(false);
      }
      if (newX + boxSize > backgroundLeft + backgroundSize) {
        newX = backgroundLeft + backgroundSize - boxSize - 4;
        setIsDragging(false);
      }

      if (newY < backgroundTop) {
        newY = backgroundTop;
        setIsDragging(false);
      }
      if (newY + boxSize > backgroundTop + backgroundSize) {
        newY = backgroundTop + backgroundSize - boxSize - 4;
        setIsDragging(false);
      }

      setPosition({ x: newX, y: newY });
    }
  };

  const handleResize = (e) => {
    setBoxSize((prevSize) => prevSize + e.movementX);
  };

  return (
    <div
      className="active-part-box"
      style={{
        position: "absolute",
        width: boxSize + "px",
        height: boxSize + "px",
        left: position.x + "px",
        top: position.y + "px",
        zIndex: isDragging ? "99" : "5",
        border: "2px solid #0074d9",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDrag}
    >
      <div
        className="resize-handle"
        style={{
          width: "10px",
          height: "10px",
          position: "absolute",
          bottom: 0,
          right: 0,
          background: "#0074d7",
          cursor: "se-resize",
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          document.addEventListener("mousemove", handleResize);
          document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", handleResize);
          });
        }}
      />
      <img
        src={part.src}
        alt="part"
        draggable="false"
        style={{ width: boxSize + "px", height: boxSize + "px" }}
      ></img>
    </div>
  );
}

function BackBox({ image }) {
  return (
    <div className="BackBox">
      <img
        src={image}
        alt="Back"
        style={{
          position: "absolute",
          zIndex: 3,
          left: backgroundLeft + "px",
          top: backgroundTop + "px",
        }}
      />
    </div>
  );
}

export default MakeImage;
