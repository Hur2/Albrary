import React, { useRef, useEffect, useState } from "react";
import "../../styles/MakeContentImage.css";
import axios from "axios";

function DrawImage({ drawCanvas, setDrawCanvasList, canvasIndex }) {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState("draw");
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 이미지 가져오기
    const backgroundImage = new Image();
    backgroundImage.src = drawCanvas;

    backgroundImage.onload = () => {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    };

    canvas.addEventListener("mousedown", (e) => {
      isDrawing = true;
      [lastX, lastY] = [
        e.clientX - canvas.getBoundingClientRect().left,
        e.clientY - canvas.getBoundingClientRect().top,
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
      const x = e.clientX - canvas.getBoundingClientRect().left;
      const y = e.clientY - canvas.getBoundingClientRect().top;
      ctx.lineTo(x, y);
      ctx.stroke();
      [lastX, lastY] = [x, y];
    }
  }, [drawCanvas, canvasIndex]);

  // 이미지 저장
  const saveCanvasAsImage = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    setDrawCanvasList((prevDrawCanvasList) => {
      const newDrawCanvasList = [...prevDrawCanvasList];
      newDrawCanvasList[canvasIndex] = dataURL;
      return newDrawCanvasList;
    });
  };

  return (
    <div className="image-container">
      <canvas
        className="canvas-wrapper"
        ref={canvasRef}
        width={512}
        height={512}
      ></canvas>
      <div>
        <div className="btn-draw-wrapper">
          <button onClick={() => setMode("draw")}>그리기</button>
          <button onClick={() => setMode("erase")}>지우기</button>
          <button onClick={saveCanvasAsImage}>저장</button>
          {mode}
        </div>
      </div>
    </div>
  );
}

function MakeImage({ setPhase, setProgress, storyResponseData }) {
  const [nowPage, setNowPage] = useState(0);
  const [textList, setTextList] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [isUploadTodb, setIsUploadTodb] = useState(0);
  const pages = []; // 최종적으로 page 배열 담을 list
  const [isLoadingData, setIsLoadingData] = useState(0);
  const [drawCanvasList, setDrawCanvasList] = useState([]);

  if (isLoadingData === 0) {
    const storyList = storyResponseData.data.contents.map((item) => item.text);
    const base64List = storyResponseData.data.contents.map(
      (item) => item.base64
    );
    setTextList(storyList);
    setImageList(base64List);

    const initialDrawCanvasList = new Array(storyList.length).fill(null);
    setDrawCanvasList(initialDrawCanvasList);

    setProgress(0);
    setIsLoadingData(1);
  }

  // 이전 페이지로 이동
  function handleClickPrev() {
    if (nowPage > 0) {
      setNowPage(nowPage - 1);
    }
  }

  // 다음 페이지로 이동
  function handleClickNext() {
    if (nowPage < textList.length - 1) {
      setNowPage(nowPage + 1);
    }
  }

  function removePrefix(inputString) {
    // 'data:image/png;base64,' 부분을 제거하고 반환
    if (inputString === null) {
      return null;
    } else if (inputString.startsWith("data:image/png;base64,")) {
      return inputString.substring("data:image/png;base64,".length);
    } else {
      return inputString;
    }
  }

  //제출 버튼
  function handleClickFinish() {
    for (let index = 0; index < textList.length; index++) {
      const page = {
        text: textList[index],
        content_background: removePrefix(imageList[index]),
        content_drawing: removePrefix(drawCanvasList[index]),
      };
      pages.push(page);
    }

    const postJsonData = {
      cover_image: "6re466a86re466a86re466a87YWM7Iqk7Yq47ZWg6rGw7J6E",
      title: "555다섯번째 책제목입니당",
      author: "작가5",
      pages: pages,
    };

    async function sendPostRequest() {
      try {
        setIsUploadTodb(1);
        //실제
        const response = await axios.post(
          "http://localhost:8082/books",
          postJsonData
        );
        console.log(postJsonData);
        setPhase(6);
      } catch (error) {
        console.log(error);
      }
    }

    if (isUploadTodb === 0) {
      sendPostRequest();
    }
  }

  return (
    <div className="make-content-wrapper">
      <div className="text-wrapper">{textList[nowPage]}</div>
      <img
        className="image-wrapper"
        src={"data:image/png;base64," + imageList[nowPage]}
        alt="background"
        draggable="false"
      ></img>
      <div className="draw-canvas-wrapper">
        <DrawImage
          drawCanvas={drawCanvasList[nowPage]}
          setDrawCanvasList={setDrawCanvasList}
          canvasIndex={nowPage}
        />
      </div>
      <div className="btn-container">
        <button onClick={handleClickPrev}>이전</button>
        <button onClick={handleClickNext}>다음</button>
        <button onClick={handleClickFinish}>제출</button>
      </div>
    </div>
  );
}

export { MakeImage };
