import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/BookShow.css";

function BookShow() {
  const { id } = useParams();

  const [nowPage, setNowPage] = useState(0);
  const [contentList, setContentList] = useState([]);
  const [dataLoading, setDataLoading] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [dataTitle, setDataTitle] = useState("");

  useEffect(() => {
    async function sendGetRequest() {
      try {
        //실제
        const response = await axios.get(`http://localhost:8082/books/${id}` ,{withCredentials:true});
        setDataTitle(response.data.title);
        //더미
        //const response = await axios.get("/bookdummy_new.json");

        const tempList = response.data.pages.map((page) => page.content_data);

        setContentList(tempList);

        setDataLoading(1);
      } catch (error) {
        console.log(error);
      }
    }
    if (!dataLoading) {
      sendGetRequest();
    }
  }, [dataLoading]);

  const handlesuperPrevPage = () => {
    // 처음으로 돌아가기 버튼
    setNowPage(0);
  };

  const handlePreviousPage = () => {
    // 이전 페이지 버튼
    if (nowPage > 0) {
      setNowPage((nowPage) => nowPage - 1);
    }
  };

  const handleNextPage = () => {
    // 다음 페이지 버튼
    if (nowPage < contentList.length - 1) {
      setNowPage((nowPage) => nowPage + 1);
    }
  };

  const handlesuperNextPage = () => {
    // 끝으로 가기 버튼
    setNowPage(contentList.length - 1);
  };

  useEffect(() => {
    const handleFullScreenClick = (e) => {
      const screenWidth = window.innerWidth;
      const clickX = e.clientX;
      if (clickX < screenWidth / 2 && nowPage > 0) {
        setNowPage((prevPage) => prevPage - 1);
      } else if (
        clickX >= screenWidth / 2 &&
        nowPage < contentList.length - 1
      ) {
        setNowPage((prevPage) => prevPage + 1);
      }
    };

    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
      }
    };

    if (isFullScreen) {
      document.addEventListener("click", handleFullScreenClick);
    }

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("click", handleFullScreenClick);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, [isFullScreen, nowPage, contentList.length]);

  const handleFullScreen = () => {
    const element = document.querySelector(".content-book");
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
    setIsFullScreen(true);
  };

  const navigate = useNavigate();

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`http://localhost:8082/books/delete/${bookId}`,{withCredentials:true});
      navigate("/Mine");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("내 책이 아니에요!");
    }
    }
  };

  const DownloadPdf = ({ bookId, dataTitle }) => {
    const handleDownloadPdf = async () => {
      try {
        const response = await axios({
          url: `http://localhost:8082/books/${bookId}/pdf`,
          method: "GET",
          responseType: "blob",
        }, {withCredentials:true}
        );
        console.log(response);

        const downloadUrl = window.URL.createObjectURL(
          new Blob([response.data])
        );
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", dataTitle + '.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error("PDF 다운로드 오류", error);
      }
    };

    return (
      <button className="tab-button-pdf" onClick={handleDownloadPdf}>
        PDF출력
      </button>
    );
  };

  return (
    <>
      <div className="tab-wrapper">
        <button className="tab-button-delete" onClick={() => handleDeleteBook(id)}>
          책 삭제
        </button>
        <DownloadPdf bookId={id} dataTitle={dataTitle} />
        <button className="tab-button-fullscreen" onClick={handleFullScreen}>
          전체화면
        </button>
      </div>
      <div className="content-wrapper">
        <img
          className="content-book"
          src={`data:image/png;base64,${contentList[nowPage]}`}
          alt="Book Content"
          draggable="false"
        />
      </div>

      <div className="button-wrapper">
        <button className="btn-superPrev" onClick={handlesuperPrevPage}>
          &lt;&lt;
        </button>
        {nowPage > 0 ? (
          <button className="btn-prev" onClick={handlePreviousPage}>
            &lt;
          </button>
        ) : null}
        {nowPage < contentList.length - 1 ? (
          <button className="btn-next" onClick={handleNextPage}>
            &gt;
          </button>
        ) : null}
        <button className="btn-superNext" onClick={handlesuperNextPage}>
          &gt;&gt;
        </button>
      </div>
    </>
  );
}

export default BookShow;
