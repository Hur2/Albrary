import React, { useRef, useEffect, useState } from "react";
import "../../styles/MakeContentImage.css"


function MakeImage() {
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
      backgroundImage.src = "img/back.png";
  
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
        ctx.strokeStyle = "red";
        ctx.lineWidth = 5;
        ctx.moveTo(lastX, lastY);
        const x = e.clientX - canvas.offsetLeft;
        const y = e.clientY - canvas.offsetTop;
        ctx.lineTo(x, y);
        ctx.stroke();
        [lastX, lastY] = [x, y];
      }
    }, []);
  
    //이미지 저장
    const saveCanvasAsImage = () => {
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL("image/png");
      console.log(dataURL);
    };
  
    return (
      <div className="image-container">
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

export { MakeImage };
