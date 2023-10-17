import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/BookShow.css";

function BookShow() {
  const { id } = useParams();

  const [nowPage, setNowPage] = useState(0);
  const [bookData, setbookData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`../bookdummy_${id}.json`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setbookData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  if (!bookData) {
    //로딩
    return <div>책Loading...</div>;
  }

  let currentPageContent = bookData.contents[nowPage];
  let nextPageContent = null;
  if (nowPage < bookData.contents.length - 1) {
    nextPageContent = bookData.contents[nowPage + 1];
  }

  const handlesuperPrevPage = () => {
    // 처음으로 돌아가기 버튼
    setNowPage(0);
  };

  const handlePreviousPage = () => {
    // 이전 페이지 버튼
    if (nowPage > 1) {
      setNowPage((nowPage) => nowPage - 2);
    }
  };

  const handleNextPage = () => {
    // 다음 페이지 버튼
    if (nowPage < bookData.contents.length - 2) {
      setNowPage((nowPage) => nowPage + 2);
    }
  };

  const handlesuperNextPage = () => {
    // 끝으로 가기 버튼
    if ((bookData.contents.length - 1) % 2 === 0) {
      setNowPage(bookData.contents.length - 1);
    } else {
      setNowPage(bookData.contents.length - 2);
    }
  };

  //진행도 계산
  let progress;
  if ((bookData.contents.length - 1) % 2 === 0) {
    progress = (nowPage / (bookData.contents.length - 1)) * 100;
  } else {
    progress = (nowPage / (bookData.contents.length - 2)) * 100;
  }

  return (
    <>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <PageShow page={nowPage} content={currentPageContent} isNext={0} />
      {nowPage < bookData.contents.length - 1 ? (
        <PageShow page={nowPage + 1} content={nextPageContent} isNext={1} />
      ) : null}
      <button className="btn-superPrev" onClick={handlesuperPrevPage}>
        &lt;&lt;
      </button>
      {nowPage > 1 ? (
        <button className="btn-prev" onClick={handlePreviousPage}>
          &lt;
        </button>
      ) : null}
      {nowPage < bookData.contents.length - 2 ? (
        <button className="btn-next" onClick={handleNextPage}>
          &gt;
        </button>
      ) : null}
      <button className="btn-superNext" onClick={handlesuperNextPage}>
        &gt;&gt;
      </button>
    </>
  );
}

function PageShow({ page, content, isNext }) {
  return (
    <div className={isNext === 0 ? "currentPage" : "nextPage"}>
      {content.type === "text" ? (
        <p>{content.text}</p>
      ) : content.type === "image" ? (
        <img src={`/${content.url}`} alt={content.caption} />
      ) : null}
    </div>
  );
}

export default BookShow;
