import React, { useState, useEffect, useRef, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import HelpButton from "./make_helpbutton";
import html2canvas from "html2canvas";
import axios from "axios";
import "../../styles/MakeFairytale.css";

const DraggableText = ({ id, text, style, mode, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.TEXT,
    item: { id, type: ItemType.TEXT },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleClick = () => {
    if (mode === "edit") {
      const newText = prompt("텍스트를 수정하세요", text);
      if (newText !== null && newText !== "") {
        onEdit(id, newText);
      }
    } else if (mode === "delete") {
      onDelete(id);
    }
  };

  return (
    <p
      className="make-text"
      ref={mode === "move" ? drag : null}
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
        position: "absolute",
        cursor: mode === "move" ? "move" : "pointer",
      }}
      onClick={handleClick}
    >
      {text}
    </p>
  );
};

const DroppableArea = ({ children, onDrop, onAddText, mode, onImageDrop }) => {
  const [, drop] = useDrop(() => ({
    accept: [ItemType.TEXT, ItemType.IMAGE],
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (item.type === ItemType.TEXT && delta) {
        onDrop(item.id, delta);
      } else if (item.type === ItemType.IMAGE && delta && onImageDrop) {
        onImageDrop(delta);
      }
    },
  }));

  const handleClick = (event) => {
    if (mode === "add") {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top - 60;
      const newText = prompt("추가할 텍스트를 입력하세요");
      if (newText) {
        onAddText(newText, { x, y });
      }
    }
  };

  return (
    <div
      className="make-content-area"
      ref={drop}
      onClick={handleClick}
      style={{
        width: "1024px",
        height: "512px",
        position: "relative",
        pointerEvents: mode === "draw" || mode === "erase" ? "none" : "auto",
      }}
    >
      {children}
    </div>
  );
};

const DrawingCanvas = React.forwardRef(
  ({ width, height, color, lineWidth, mode }, ref) => {
    const [isDrawing, setIsDrawing] = useState(false);

    const preventScroll = (e) => {
      if (isDrawing) {
        e.preventDefault();
      }
    };

    useEffect(() => {
      document.addEventListener("touchmove", preventScroll, { passive: false });

      return () => {
        document.removeEventListener("touchmove", preventScroll);
      };
    }, [isDrawing]);

    useEffect(() => {
      const context = ref.current.getContext("2d");

      if (mode === "erase") {
        context.globalCompositeOperation = "destination-out";
        context.lineWidth = lineWidth;
      } else {
        context.globalCompositeOperation = "source-over";
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.lineCap = "round";
      }
    }, [color, lineWidth, mode, ref]);

    const startDrawing = ({ nativeEvent }) => {
      const { offsetX, offsetY } = getCoordinates(nativeEvent);
      const context = ref.current.getContext("2d");
      context.beginPath();
      context.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
      if (!isDrawing) return;
      const { offsetX, offsetY } = getCoordinates(nativeEvent);
      const context = ref.current.getContext("2d");
      context.lineTo(offsetX, offsetY);
      context.stroke();
    };

    const stopDrawing = () => {
      setIsDrawing(false);
    };

    const getCoordinates = (nativeEvent) => {
      if (nativeEvent.touches && nativeEvent.touches.length > 0) {
        const touch = nativeEvent.touches[0];
        return { offsetX: touch.clientX - 50, offsetY: touch.clientY - 110 };
      }
      return { offsetX: nativeEvent.offsetX, offsetY: nativeEvent.offsetY };
    };

    return (
      <canvas
        ref={ref}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onTouchCancel={stopDrawing}
        style={{
          position: "absolute",
          pointerEvents: mode === "draw" || mode === "erase" ? "auto" : "none",
        }}
      />
    );
  }
);

const ItemType = {
  IMAGE: "image",
  TEXT: "text",
  RESIZE: "resize",
};

const DraggableImage = ({
  src,
  position,
  size,
  onResize,
  onFinish,
  onCancel,
}) => {
  const [, drag] = useDrag(() => ({
    type: ItemType.IMAGE,
    item: { type: ItemType.IMAGE },
  }));

  const handleResizing = useCallback(
    (e) => {
      const clientX = e.type.includes("touch")
        ? e.touches[0].clientX - 50
        : e.clientX;
      const clientY = e.type.includes("touch")
        ? e.touches[0].clientY - 110
        : e.clientY;

      const newWidth = clientX - position.x;
      const newHeight = clientY - position.y;
      onResize({ width: newWidth, height: newHeight });
    },
    [position, onResize]
  );

  const startResizing = useCallback(
    (e) => {
      e.preventDefault();
      window.addEventListener("mousemove", handleResizing);
      window.addEventListener("mouseup", stopResizing);
      window.addEventListener("touchmove", handleResizing, { passive: false });
      window.addEventListener("touchend", stopResizing);
    },
    [handleResizing]
  );

  const stopResizing = useCallback(() => {
    window.removeEventListener("mousemove", handleResizing);
    window.removeEventListener("mouseup", stopResizing);
    window.removeEventListener("touchmove", handleResizing);
    window.removeEventListener("touchend", stopResizing);
  }, [handleResizing]);

  return (
    <div
      ref={drag}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        cursor: "move",
        width: size.width,
        height: size.height,
      }}
    >
      <img
        src={src}
        alt="Uploaded"
        style={{ width: "100%", height: "100%", zIndex: "99" }}
      />
      <div style={{ position: "absolute", top: 0, right: 0, zIndex: "99" }}>
        <button className="button-imageUpload-done" onClick={onFinish}>
          완료
        </button>
        <button className="button-imageUpload-cancel" onClick={onCancel}>
          취소
        </button>
      </div>
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "20px",
          height: "20px",
          backgroundColor: "rgba(0, 0, 255, 0.7)",
          cursor: "nwse-resize",
          zIndex: "100",
        }}
        onMouseDown={startResizing} // 크기 조절 시작
        onTouchStart={startResizing}
      />
    </div>
  );
};

function MakeFairytaleWithAi({ setPhase, setProgress, storyResponseData }) {
  const maxPageLength = 20; // 최대 페이지 길이
  const [pages, setPages] = useState([[]]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageLength, setCurrentPageLength] = useState(0); // 현재 페이지 최대 길이 (정확히는 마지막 page index)
  const currentPageRef = useRef(currentPage);
  const [mode, setMode] = useState("null");
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);
  const canvasRef = useRef(null);
  const colorRef = useRef(null);
  const [canvasImages, setCanvasImages] = useState(
    Array(maxPageLength).fill(null)
  );

  // ai 전용 ---------------------------
  const [backgroundImages, setBackgroundImages] = useState(
    Array(maxPageLength).fill(null)
  ); // background image base64 저장 배열

  const [isAvailableBack, setIsAvailableBack] = useState(
    Array(maxPageLength).fill(0)
  ); // ai로 생성한 background on/off

  const [aiCreatePageLength, setAiCreatePageLength] = useState(0); // ai가 생성한 page 길이
  // -----------------------------------

  const [isTakingScreenshot, setIsTakingScreenshot] = useState(false);

  //이미지 업로드
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 100, height: 100 });

  // 제출 모달
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    if (
      storyResponseData &&
      storyResponseData.data &&
      storyResponseData.data.contents
    ) {
      const initialPages = storyResponseData.data.contents.map((content) => {
        const randomPosition1 = {
          x: 64 + Math.random() * 256,
          y: 32 + Math.random() * 128,
        };
        const randomPosition2 = {
          x: 256 + Math.random() * 256,
          y: 192 + Math.random() * 128,
        };
        return [
          { id: 1, text: content.text[0], position: randomPosition1 },
          { id: 2, text: content.text[1], position: randomPosition2 },
        ];
      });

      const initialBackgroundImages = storyResponseData.data.contents.map(
        (content) => content.base64
      );

      setPages(initialPages);
      setBackgroundImages(initialBackgroundImages);

      const initialIsAvailableBack = Array(maxPageLength)
        .fill(0)
        .map((_, index) =>
          index < storyResponseData.data.contents.length ? 1 : 0
        );

      setIsAvailableBack(initialIsAvailableBack);

      setCurrentPageLength(storyResponseData.data.contents.length - 1);
      setAiCreatePageLength(storyResponseData.data.contents.length - 1);
    }
  }, []);

  const saveCanvasImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imageData = canvas.toDataURL("image/png");
      setCanvasImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[currentPage] = imageData;
        return newImages;
      });
    }
  };

  const loadCanvasImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (canvasImages[currentPage]) {
      const image = new Image();
      image.onload = () => ctx.drawImage(image, 0, 0);
      image.src = canvasImages[currentPage];
    }
  };

  useEffect(() => {
    loadCanvasImage();
  }, [currentPage, canvasImages]);

  const moveText = (id, delta) => {
    setPages((pages) =>
      pages.map((texts, pageIndex) => {
        if (pageIndex === currentPageRef.current) {
          return texts.map((text) => {
            if (text.id === id) {
              return {
                ...text,
                position: {
                  x: text.position.x + delta.x,
                  y: text.position.y + delta.y,
                },
              };
            }
            return text;
          });
        }
        return texts;
      })
    );
  };

  const editText = (id, newText) => {
    setPages((pages) =>
      pages.map((texts, pageIndex) =>
        pageIndex === currentPage
          ? texts.map((text) =>
              text.id === id ? { ...text, text: newText } : text
            )
          : texts
      )
    );
  };

  const addText = (text, position) => {
    setPages((pages) =>
      pages.map((texts, pageIndex) =>
        pageIndex === currentPage
          ? [...texts, { id: texts.length + 1, text, position }]
          : texts
      )
    );
  };

  const deleteText = (id) => {
    setPages((pages) =>
      pages.map((texts, pageIndex) =>
        pageIndex === currentPage
          ? texts.filter((text) => text.id !== id)
          : texts
      )
    );
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setMode("draw");
      saveCanvasImage();
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage + 1 < maxPageLength) {
      setMode("draw");
      saveCanvasImage();
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      if (currentPageLength < nextPage) {
        setCurrentPageLength(nextPage);
      }

      if (nextPage === pages.length) {
        setPages([...pages, []]);
      }
    }
  };

  const [base64Images, setBase64Images] = useState([]);
  const takeScreenshots = async () => {
    for (let i = 0; i <= currentPageLength; i++) {
      setCurrentPage(i);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const element = document.querySelector(".make-wrapper");
      const canvas = await html2canvas(element);
      base64Images.push(canvas.toDataURL("image/png"));
    }

    setIsTakingScreenshot(true);
  };

  const handleShowSubmitModal = () => {
    saveCanvasImage();
    setShowSubmitModal(true);
    takeScreenshots();
  };

  const openColorSelect = () => {
    colorRef.current.click();
  };

  const deletePage = () => {
    if (pages.length <= 1) {
      return;
    }

    const confirmDelete = window.confirm(
      "정말로 이 페이지를 삭제하시겠습니까?"
    );
    if (confirmDelete) {
      const newPages = pages.filter((_, index) => index !== currentPage);
      setPages(newPages);

      const newCanvasImages = canvasImages.filter(
        (_, index) => index !== currentPage
      );
      setCanvasImages(newCanvasImages);

      // ai관련 업데이트
      if (currentPage <= aiCreatePageLength) {
        setAiCreatePageLength(aiCreatePageLength - 1);
      }
      const newIsAvailableBack = [...isAvailableBack];
      const newBackgroundImages = [...backgroundImages];
      if (currentPage < newIsAvailableBack.length) {
        newIsAvailableBack.splice(currentPage, 1);
        newBackgroundImages.splice(currentPage, 1);
      }
      newIsAvailableBack.push(0);
      newBackgroundImages.push("");
      setIsAvailableBack(newIsAvailableBack);
      setBackgroundImages(newBackgroundImages);

      if (currentPage === currentPageLength) {
        setCurrentPageLength((prevLength) => prevLength - 1);
      }

      if (currentPage >= newPages.length) {
        setCurrentPage(newPages.length - 1);
      }

      setCurrentPageLength(newPages.length - 1);
    }
  };

  //ai 백그라운드 함수  -------------------------------------------
  const handleToggleBackground = (pageIndex) => {
    if (currentPage < aiCreatePageLength) {
      setIsAvailableBack((prevIsAvailableBack) => {
        const updatedIsAvailableBack = [...prevIsAvailableBack];
        updatedIsAvailableBack[pageIndex] =
          prevIsAvailableBack[pageIndex] === 1 ? 0 : 1;

        return updatedIsAvailableBack;
      });
    }
  };

  // 이미지 업로드 관련 함수 -------------------------------------------
  // 이미지 업로드 핸들러
  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const fileInputRef = useRef(null);

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const image = new Image();
        image.onload = () => {
          const originalWidth = image.width;
          const originalHeight = image.height;

          //이미지 크기, 위치 초기값
          const initialWidth = 200;
          const initialHeight = (initialWidth / originalWidth) * originalHeight;

          setImagePosition({ x: 0, y: 0 });
          setImageSize({ width: initialWidth, height: initialHeight });

          setUploadedImage(e.target.result);
          setMode("imageUpload");
        };
        image.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    event.target.value = "";
  }, []);

  // 이미지 이동 초리
  const handleImageMove = useCallback((delta) => {
    setImagePosition((prevPosition) => ({
      x: prevPosition.x + delta.x,
      y: prevPosition.y + delta.y,
    }));
  }, []);

  // 이미지 업로드 완료 처리
  const handleFinishImageUpload = () => {
    if (!uploadedImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.onload = () => {
      ctx.drawImage(
        image,
        imagePosition.x,
        imagePosition.y,
        imageSize.width,
        imageSize.height
      );
      setUploadedImage(null);
      setMode("null");
    };
    image.src = uploadedImage;
  };

  // 이미지 업로드 취소 처리
  const handleCancelImageUpload = useCallback(() => {
    setUploadedImage(null);
    setMode("null");
  }, []);

  const handleResize = (newSize) => {
    setImageSize(newSize);
  };

  useEffect(() => {
    if (mode !== "imageUpload" && uploadedImage) {
      setUploadedImage(null);
    }
  }, [mode, uploadedImage]);

  const [showBasicImageModal, setShowBasicImageModal] = useState(false);

  // 기본 이미지 선택 핸들러
  const handleBasicImageSelect = (imageSrc) => {
    const image = new Image();
    image.onload = () => {
      const originalWidth = image.width;
      const originalHeight = image.height;

      const initialWidth = 200;
      const initialHeight = (initialWidth / originalWidth) * originalHeight;

      setImagePosition({ x: 0, y: 0 });
      setImageSize({ width: initialWidth, height: initialHeight });
      setUploadedImage(imageSrc);
      setMode("imageUpload");
    };
    image.src = imageSrc;
    setShowBasicImageModal(false);
  };

  // 기본 이미지 선택 모달 렌더링
  const BasicImageModal = ({ onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState("과일");

    const categories = {
      과일: [
        "fruit/apple.png",
        "fruit/banana.png",
        "fruit/cherries.png",
        "fruit/kiwi.png",
        "fruit/mango.png",
        "fruit/melon.png",
        "fruit/orange.png",
        "fruit/pear.png",
        "fruit/pineapple.png",
        "fruit/strawberry.png",
        "fruit/watermelon.png",
        "fruit/grape.png",
        "fruit/mandarin.png",
        "fruit/peach.png",
        "fruit/plum.png",
      ],
      동물: [
        "animal/0.png",
        "animal/1.png",
        "animal/2.png",
        "animal/3.png",
        "animal/4.png",
        "animal/5.png",
        "animal/6.png",
        "animal/7.png",
        "animal/8.png",
        "animal/9.png",
        "animal/10.png",
        "animal/11.png",
        "animal/12.png",
        "animal/13.png",
        "animal/14.png",
      ],
      나무: [
        "tree/0.png",
        "tree/1.png",
        "tree/2.png",
        "tree/3.png",
        "tree/4.png",
        "tree/5.png",
        "tree/6.png",
        "tree/7.png",
        "tree/8.png",
        "tree/9.png",
        "tree/10.png",
        "tree/11.png",
        "tree/12.png",
        "tree/13.png",
        "tree/14.png",
      ],
      꽃: [
        "flower/0.png",
        "flower/1.png",
        "flower/2.png",
        "flower/3.png",
        "flower/4.png",
        "flower/5.png",
        "flower/6.png",
        "flower/7.png",
        "flower/8.png",
        "flower/9.png",
        "flower/10.png",
        "flower/11.png",
        "flower/12.png",
        "flower/13.png",
        "flower/14.png",
      ],
      사람: [
        "people/0.png",
        "people/1.png",
        "people/2.png",
        "people/3.png",
        "people/4.png",
        "people/5.png",
        "people/6.png",
        "people/7.png",
        "people/8.png",
        "people/9.png",
        "people/10.png",
        "people/11.png",
        "people/12.png",
        "people/13.png",
        "people/14.png",
      ],
      말풍선: [
        "speechballon/0.png",
        "speechballon/1.png",
        "speechballon/2.png",
        "speechballon/3.png",
        "speechballon/12.png",
        "speechballon/4.png",
        "speechballon/5.png",
        "speechballon/6.png",
        "speechballon/7.png",
        "speechballon/13.png",
        "speechballon/8.png",
        "speechballon/9.png",
        "speechballon/10.png",
        "speechballon/11.png",
        "speechballon/14.png",
      ],
    };

    return (
      <div className="submit-modal-overlay">
        <div className="basic-image-modal">
          <div className="basic-category-list">
            {Object.keys(categories).map((category) => (
              <button
                className={
                  selectedCategory === category
                    ? "basic-category-button-active"
                    : "basic-category-button"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="basic-image-gallery">
            {categories[selectedCategory].map((imgsrc) => (
              <div
                className="basic-image-item"
                onClick={() => handleBasicImageSelect(`/img/basic/${imgsrc}`)}
              >
                <img
                  src={`/img/basic/${imgsrc}`}
                  alt="imgItem"
                  draggable="false"
                />
              </div>
            ))}
          </div>
          <button className="basic-close-button" onClick={onClose}>
            x
          </button>
        </div>
      </div>
    );
  };

  // "기본 이미지 도움" 버튼 클릭 핸들러
  const handleShowBasicImageModal = () => {
    setMode("imageUpload");
    setShowBasicImageModal(true);
  };

  const handleBasicImageModalClose = () => {
    setMode("");
    setShowBasicImageModal(false);
  };

  // "AI 색칠놀이" 모달
  const AIColoringModal = ({ onClose, onSelectImage }) => {
    const [inputText, setInputText] = useState("");

    const handleAiSketchSend = async () => {
      try {
        const response = await axios.post(
          "http://13.124.203.82:5000/makeLineart",
          {
            keyword: inputText,
          }
        );
        if (response.data && response.data.image) {
          const tempAiSketchImage =
            "data:image/png;base64," + response.data.image;
          handleAiSketchSelect(tempAiSketchImage);
        }
      } catch (error) {
        console.error(error);
      }
      onClose();
    };

    return (
      <div className="aisketch-modal-overlay">
        <div className="aisketch-image-modal">
          <input
            className="aisketch-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="원하는 그림을 써주세요"
          />
          <button className="aisketch-submit" onClick={handleAiSketchSend}>
            보내기
          </button>
          <button className="aisketch-close-button" onClick={onClose}>
            x
          </button>
        </div>
      </div>
    );
  };

  const [showAIColoringModal, setShowAIColoringModal] = useState(false);

  const handleAIColoringModalOpen = () => {
    setMode("imageUpload");
    setShowAIColoringModal(true);
  };

  const handleAIColoringModalClose = () => {
    setMode("");
    setShowAIColoringModal(false);
  };

  const handleAiSketchSelect = (imageSrc) => {
    const image = new Image();
    image.onload = () => {
      const originalWidth = image.width;
      const originalHeight = image.height;

      const initialWidth = 200;
      const initialHeight = (initialWidth / originalWidth) * originalHeight;

      setImagePosition({ x: 0, y: 0 });
      setImageSize({ width: initialWidth, height: initialHeight });
      setUploadedImage(imageSrc);
      setMode("imageUpload");
    };
    image.src = imageSrc;
    setShowBasicImageModal(false);
  };

  // 제출 모달
  // 모달 내 제출 버튼
  function removePrefix(inputString) {
    if (!inputString) {
      return null;
    }

    if (inputString.startsWith("data:image/png;base64,")) {
      return inputString.substring("data:image/png;base64,".length);
    } else {
      return inputString;
    }
  }

  const [isUploadTodb, setIsUploadTodb] = useState(0);
  const handleSubmit = () => {
    if (isTakingScreenshot === true) {
      const pagesData = base64Images.map((imgData) => ({
        content_data: removePrefix(imgData),
      }));

      const canvasSub = canvasSubmitRef.current;

      // 흰 사각형 채워넣기
      const newCanvas = document.createElement("canvas");
      newCanvas.width = canvasSub.width;
      newCanvas.height = canvasSub.height;
      const ctx = newCanvas.getContext("2d");
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
      ctx.drawImage(canvasSub, 0, 0);

      const cover_image = removePrefix(newCanvas.toDataURL("image/png"));

      const postJsonData = {
        cover_image: cover_image,
        title: title,
        author: author,
        pages: pagesData,
      };
      async function sendPostRequest() {
        try {
          setIsUploadTodb(1);
          //실제
          const response = await axios.post(
            "http://13.124.203.82:8082/books",
            postJsonData,
            { withCredentials: true }
          );
          setPhase(6);
        } catch (error) {
          console.log(error);
        }
      }

      if (isUploadTodb === 0) {
        sendPostRequest();
      }

      setShowSubmitModal(false);
      setPhase(6);
    }
  };
  //cover canvas
  const canvasSubmitRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [submitColor, setSubmitColor] = useState("black");
  const [submitLineWidth, setSubmitLineWidth] = useState(10);
  const [submitMode, setSubmitMode] = useState("draw");

  const handleMouseDown = (e) => {
    const canvas = canvasSubmitRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasSubmitRef.current;
    const ctx = canvas.getContext("2d");
    if (submitMode === "erase") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = submitLineWidth;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = submitColor;
      ctx.lineWidth = submitLineWidth;
      ctx.lineCap = "round";
    }
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleCanvasSetup = () => {
    const canvas = canvasSubmitRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = submitColor;
    ctx.lineWidth = submitLineWidth;
    ctx.lineCap = "round";
  };

  useEffect(() => {
    if (showSubmitModal) {
      handleCanvasSetup();
    }
  }, [showSubmitModal]);

  return (
    <>
      {showSubmitModal && (
        <div className="submit-modal-overlay">
          <div className="submit-modal">
            <div className="submit-cover-info">표지를 그려주세요.</div>
            <div className="submit-canvas">
              <canvas
                ref={canvasSubmitRef}
                width="384"
                height="512"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseOut={handleMouseUp}
              />
            </div>
            <div className="button-submit-container">
              <button
                className="button-color red"
                onClick={() => {
                  setSubmitMode("draw");
                  setSubmitColor("red");
                }}
              />
              <button
                className="button-color orange"
                onClick={() => {
                  setSubmitMode("draw");
                  setSubmitColor("orange");
                }}
              />
              <button
                className="button-color yellow"
                onClick={() => {
                  setSubmitMode("draw");
                  setSubmitColor("yellow");
                }}
              />
              <button
                className="button-color green"
                onClick={() => {
                  setSubmitMode("draw");
                  setSubmitColor("green");
                }}
              />
              <button
                className="button-color skyblue"
                onClick={() => {
                  setSubmitMode("draw");
                  setSubmitColor("skyblue");
                }}
              />
              <button
                className="button-color blue"
                onClick={() => {
                  setSubmitMode("draw");
                  setSubmitColor("blue");
                }}
              />
              <button
                className="button-color purple"
                onClick={() => {
                  setSubmitMode("draw");
                  setSubmitColor("purple");
                }}
              />
              <button
                className="button-color black"
                onClick={() => {
                  setSubmitMode("draw");
                  setSubmitColor("black");
                }}
              />
              <button
                className="button-color-rainbow"
                onClick={() => {
                  setSubmitMode("draw");
                  openColorSelect();
                }}
              ></button>
              <input
                ref={colorRef}
                type="color"
                value={color}
                onChange={(e) => setSubmitColor(e.target.value)}
                style={{ display: "none" }}
              />
            </div>
            <input
              className="submit-line-width"
              type="range"
              min="1"
              max="50"
              value={submitLineWidth}
              onChange={(e) => setSubmitLineWidth(e.target.value)}
            />
            <img
              className="submit-button-erase"
              src={
                submitMode === "erase"
                  ? "img/make_icon_erase_active.png"
                  : "img/make_icon_erase.png"
              }
              alt="icon-erase"
              onClick={() => setSubmitMode("erase")}
              draggable="false"
            ></img>
            <input
              className="submit-title"
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="submit-author"
              type="text"
              placeholder="작가 이름을 입력하세요"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <button className="submit-button-finish" onClick={handleSubmit}>
              제출
            </button>
          </div>
        </div>
      )}
      <div className="make-content-shadow" />
      <div className="make-wrapper">
        {currentPage <= aiCreatePageLength &&
        isAvailableBack[currentPage] === 1 ? (
          <img
            className="content-ai-background"
            src={"data:image/png;base64," + backgroundImages[currentPage]}
            alt="background"
          />
        ) : null}
        <DrawingCanvas
          width={1024}
          height={512}
          color={color}
          lineWidth={lineWidth}
          mode={mode}
          ref={canvasRef}
        />
        <DndProvider backend={HTML5Backend}>
          <DroppableArea
            onDrop={moveText}
            onAddText={addText}
            mode={mode}
            onImageDrop={handleImageMove}
          >
            {mode === "imageUpload" && uploadedImage && (
              <DraggableImage
                src={uploadedImage}
                position={imagePosition}
                size={imageSize}
                onResize={handleResize}
                onFinish={handleFinishImageUpload}
                onCancel={handleCancelImageUpload}
              />
            )}

            {pages[currentPage].map(({ id, text, position }) => (
              <DraggableText
                key={id}
                id={id}
                text={text}
                style={{ left: position.x, top: position.y }}
                mode={mode}
                onEdit={editText}
                onDelete={deleteText}
              />
            ))}
          </DroppableArea>
        </DndProvider>
      </div>
      <div className="button-container">
        <div className="button-text-field">
          <img
            src="img/make_icon_textfield.png"
            alt="texticon"
            draggable="false"
          />
          <button
            className={mode === "move" ? "button-active" : "button-normal"}
            onClick={() => setMode("move")}
          >
            텍스트 이동
          </button>
          <button
            className={mode === "edit" ? "button-active" : "button-normal"}
            onClick={() => setMode("edit")}
          >
            텍스트 수정
          </button>
          <button
            className={mode === "add" ? "button-active" : "button-normal"}
            onClick={() => setMode("add")}
          >
            텍스트 추가
          </button>
          <button
            className={mode === "delete" ? "button-active" : "button-normal"}
            onClick={() => setMode("delete")}
          >
            텍스트 삭제
          </button>
        </div>
        <div className="button-draw-field">
          <img
            src="img/make_icon_drawfield.png"
            alt="imageicon"
            draggable="false"
          />
          <div className="draw-container">
            <button
              className="button-color red"
              onClick={() => {
                setMode("draw");
                setColor("red");
              }}
            ></button>
            <button
              className="button-color orange"
              onClick={() => {
                setMode("draw");
                setColor("orange");
              }}
            ></button>
            <button
              className="button-color yellow"
              onClick={() => {
                setMode("draw");
                setColor("yellow");
              }}
            ></button>
            <button
              className="button-color green"
              onClick={() => {
                setMode("draw");
                setColor("green");
              }}
            ></button>
            <button
              className="button-color skyblue"
              onClick={() => {
                setMode("draw");
                setColor("skyblue");
              }}
            ></button>
            <button
              className="button-color blue"
              onClick={() => {
                setMode("draw");
                setColor("blue");
              }}
            ></button>
            <button
              className="button-color purple"
              onClick={() => {
                setMode("draw");
                setColor("purple");
              }}
            ></button>
            <button
              className="button-color black"
              onClick={() => {
                setMode("draw");
                setColor("black");
              }}
            ></button>
            <button
              className="button-color-rainbow"
              onClick={() => {
                setMode("draw");
                openColorSelect();
              }}
            ></button>
            <input
              ref={colorRef}
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ display: "none" }}
            />
            <input
              className="button-line-width"
              type="range"
              min="1"
              max="50"
              value={lineWidth}
              onChange={(e) => setLineWidth(e.target.value)}
            />

            <img
              className="button-erase"
              src={
                mode === "erase"
                  ? "img/make_icon_erase_active.png"
                  : "img/make_icon_erase.png"
              }
              alt="icon-erase"
              onClick={() => setMode("erase")}
              draggable="false"
            ></img>
          </div>
        </div>
        <div className="button-image-field">
          <img
            src="img/make_icon_imagefield.png"
            alt="imageicon"
            draggable="false"
          />
          <button
            className={
              mode === "imageUpload"
                ? "button-imageUpload-active"
                : "button-imageUpload-normal"
            }
            onClick={handleFileButtonClick}
          >
            이미지 업로드
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <button
            className={
              mode === "imageUpload"
                ? "button-imageUpload-active"
                : "button-imageUpload-normal"
            }
            onClick={handleShowBasicImageModal}
          >
            도움이미지
          </button>
          {showBasicImageModal && (
            <BasicImageModal onClose={handleBasicImageModalClose} />
          )}
          <button
            className={
              mode === "imageUpload"
                ? "button-imageUpload-active"
                : "button-imageUpload-normal"
            }
            onClick={handleAIColoringModalOpen}
          >
            AI 색칠놀이
          </button>
          {showAIColoringModal && (
            <AIColoringModal
              onClose={handleAIColoringModalClose}
              onSelectImage={handleAiSketchSelect}
            />
          )}
        </div>
        <div className="button-ai-field">
          <div className="ai-field-area">
            <div className="ai-info">스토리AI 가이드라인</div>
            <div className="ai-able">활성화</div>
          </div>
          <div className="ai-field-area">
            <div className="ai-info">배경AI 가이드라인</div>
            {isAvailableBack[currentPage] === 1 ? (
              <button
                className="button-ai-active"
                onClick={() => handleToggleBackground(currentPage)}
              >
                활성화
              </button>
            ) : (
              <button
                className="button-ai"
                onClick={() => handleToggleBackground(currentPage)}
              >
                비활성화
              </button>
            )}
          </div>
          <div className="side-deco-line" />
        </div>

        <div className="button-side-field">
          <div className="side-deco-line" />
          <div className="side-field-info">
            <div className="side-page-info">
              {currentPage + 1}p / {currentPageLength + 1}p
            </div>

            <button className="button-page-del" onClick={deletePage}>
              페이지 삭제
            </button>
          </div>
          <div className="side-button-move-field">
            <button className="button-page-move" onClick={goToPrevPage}>
              이전 페이지
            </button>
            <button className="button-page-move" onClick={goToNextPage}>
              다음 페이지
            </button>
          </div>
          <div className="side-submit-container">
            <button
              className="button-page-submit"
              onClick={handleShowSubmitModal}
            >
              제출하기
            </button>
          </div>
        </div>
        <HelpButton />
      </div>
    </>
  );
}

export { MakeFairytaleWithAi };
