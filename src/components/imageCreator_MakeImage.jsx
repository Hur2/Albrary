import React, { useState, useEffect } from "react";

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
          top: 0,
          left: part.id * 200,
        }));

        setParts(updatedParts);
      } catch (error) {
        console.error("Error fetching base data:", error);
      }
    }

    fetchData();
  }, []);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const part = parts.find((p) => p.id === parseInt(id, 10));
    if (part) {
      // Check if the drop occurred inside the BackBox
      const backBox = document.querySelector(".BackBox");
      const rect = backBox.getBoundingClientRect();

      if (
        e.clientX >= rect.left &&
        e.clientX + 126 <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY + 126 <= rect.bottom
      ) {
        const updatedParts = parts.map((p) =>
          p.id === part.id
            ? {
                ...p,
                top: e.clientY - document.querySelector(".header").clientHeight,
                left: e.clientX - rect.left,
              }
            : p
        );
        setParts(updatedParts);
      }
    }
  };

  return (
    <div className="image-container">
      <div className="part-base-container">
        {parts.map((part) => (
          <PartBox
            className="partBox"
            key={part.id}
            part={part}
            onDragStart={(e) => handleDragStart(e, part.id)}
          />
        ))}
      </div>
      <div
        className="BackBox"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{ display: "inline-block" }}
      >
        <BackBox image="img/back.png" />
      </div>
      <button className="image-btn-placing">위치정하기</button>
      <button className="image-btn-resizing">크기정하기</button>
      <button className="image-btn">제출하기</button>
    </div>
  );
}

function PartBox({ part, onDragStart }) {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [startX, setStartX] = useState(part.left);
  const [startY, setStartY] = useState(part.top);

  const handleDragStart = (e) => {
    const boundingBox = e.currentTarget.getBoundingClientRect();
    setOffsetX(e.clientX - boundingBox.left - boundingBox.width / 2);
    setOffsetY(e.clientY - boundingBox.top - boundingBox.height / 2);
    setStartX(part.left);
    setStartY(part.top);
    onDragStart(e);
  };

  const handleDrag = (e) => {
    const boundingBox = e.currentTarget.getBoundingClientRect();
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;

    const backBox = document.querySelector(".BackBox");
    const backBoxRect = backBox.getBoundingClientRect();

    if (
      newX >= backBoxRect.left &&
      newX + boundingBox.width <= backBoxRect.right &&
      newY >= backBoxRect.top &&
      newY + boundingBox.height <= backBoxRect.bottom
    ) {
      part.left = newX;
      part.top = newY;
    } else {
      part.left = startX;
      part.top = startY;
    }
  };

  return (
    <div
      className="PartBoxItem"
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      style={{
        top: part.top,
        left: part.left,
        position: "absolute",
      }}
    >
      <img src={part.src} alt="Part" />
    </div>
  );
}

function BackBox({ image }) {
  return (
    <div
      className="BackBoxItem"
      style={{ position: "relative", display: "inline-block" }}
    >
      <img src={image} alt="Back" />
    </div>
  );
}

export default MakeImage;
