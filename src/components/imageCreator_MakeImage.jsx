import React, { useState, useEffect } from "react";

let firstClickX = 0; // part 처음 클릭 시 x 좌표 (part 좌상단 기준)
let firstClickY = 0; // part 처음 클릭 시 y 좌표 (part 좌상단 기준)
let partSize = 126;
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
      <BackBox
        image="img/back.png"
        onDrop={handleDrop}
        onDragOver={allowDrop}
      />

      <button className="image-btn-submit">제출하기</button>
    </div>
  );
}

function PartBox({ part }) {
  let originalLeft = 0;
  let originalTop = 0;

  const handleDragStart = (e) => {
    firstClickX = e.clientX - e.target.offsetLeft;
    firstClickY = e.clientY - e.target.offsetTop;
    originalLeft = e.target.style.left;
    originalTop = e.target.style.top;
    e.target.style.zIndex = "3";
  };

  const dragHandler = (e) => {
    e.target.style.position = "absolute";
    e.target.style.left = `${e.clientX - firstClickX}px`;
    e.target.style.top = `${e.clientY - firstClickY}px`;
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const dragEndHandler = (e) => {
    e.target.style.position = "absolute";
    e.target.style.zIndex = "4";

    if (e.clientX - firstClickX < backgroundLeft) {
      e.target.style.left = backgroundLeft + "px";
    }

    if (e.clientX - firstClickX + partSize > backgroundLeft + backgroundSize) {
      e.target.style.left = backgroundLeft + backgroundSize - partSize + "px";
    }

    if (e.clientY - firstClickY < backgroundTop) {
      e.target.style.top = backgroundTop + "px";
    }

    if (e.clientY - firstClickY + partSize > backgroundTop + backgroundSize) {
      e.target.style.top = backgroundTop + backgroundSize - partSize + "px";
    }
  };

  const dragLeaveHandler = (e) => {
    e.preventDefault();
    e.target.style.left = originalLeft;
    e.target.style.top = originalTop;
  };

  return (
    <div
      className="PartBox"
      onDragStart={(e) => handleDragStart(e)}
      onDrag={dragHandler}
      onDragOver={onDragOver}
      onDrop={dragEndHandler}
      onDragLeave={dragLeaveHandler}
      draggable="true"
    >
      <img
        src={part.src}
        alt="Part"
        style={{
          position: "absolute",
          zIndex: 3,
          left: part.left + "px", // JSON 데이터에서 받아온 초기 left 값 설정
          top: part.top + "px", // JSON 데이터에서 받아온 초기 top 값 설정
        }}
      />
    </div>
  );
}

function BackBox({ image }) {
  return (
    <div onDrop={handleDrop} onDragOver={allowDrop} className="BackBox">
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

function allowDrop(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  // 드롭된 아이템을 처리하는 로직을 추가하세요.
  console.log("아이템이 드롭되었습니다.");
}
export default MakeImage;
