import React, { useRef, useEffect, useState } from "react";

function Everyone(arg) {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState("draw");
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 이미지 가져오기
    const backgroundImage = new Image();
    backgroundImage.src = "img/back.png"; // 이미지 파일 경로를 맞게 설정해야 합니다.

    backgroundImage.onload = () => {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    };

    canvas.addEventListener("mousedown", (e) => {
      isDrawing = true;
      [lastX, lastY] = [
        e.clientX - canvas.offsetLeft,
        e.clientY - canvas.offsetTop,
      ];
    });

    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", () => (isDrawing = false));
    canvas.addEventListener("mouseout", () => (isDrawing = false));

    function draw(e) {
      if (!isDrawing) return;
      ctx.beginPath();
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 1;
      ctx.moveTo(lastX, lastY);
      const x = e.clientX - canvas.offsetLeft;
      const y = e.clientY - canvas.offsetTop;
      ctx.lineTo(x, y);
      ctx.stroke();
      [lastX, lastY] = [x, y];
    }
  }, []);

  const saveCanvasAsImage = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png"); // "image/png" 형식으로 추출

    // dataURL을 사용하거나 전송하거나 저장할 수 있습니다.
    console.log(dataURL);
  };

  return (
    <div className="container">
      <canvas ref={canvasRef} width={512} height={512}></canvas>
      <div>
        <button onClick={() => setMode("draw")}>그리기</button>
        <button onClick={() => setMode("erase")}>지우기</button>
        <button onClick={saveCanvasAsImage}>저장</button>
        {mode}
      </div>
    </div>
  );
}

export default Everyone;
