import React, { useState } from "react";
import "../../styles/MakeFairytale.css";

function SubButton({ chapter, page, setHelpPage }) {
  if (chapter === 0) {
    return (
      <div className="help-sub-container">
        <button
          className={page === 0 ? "help-button-sub-active" : "help-button-sub"}
          onClick={() => setHelpPage(0)}
        >
          텍스트 추가
        </button>
        <button
          className={page === 1 ? "help-button-sub-active" : "help-button-sub"}
          onClick={() => setHelpPage(1)}
        >
          텍스트 삭제
        </button>
        <button
          className={page === 2 ? "help-button-sub-active" : "help-button-sub"}
          onClick={() => setHelpPage(2)}
        >
          텍스트 이동
        </button>
        <button
          className={page === 3 ? "help-button-sub-active" : "help-button-sub"}
          onClick={() => setHelpPage(3)}
        >
          텍스트 수정
        </button>
      </div>
    );
  } else if (chapter === 1) {
    return (
      <div className="help-sub-container">
        <button
          className={page === 0 ? "help-button-sub-active" : "help-button-sub"}
          onClick={() => setHelpPage(0)}
        >
          그리기
        </button>
        <button
          className={page === 1 ? "help-button-sub-active" : "help-button-sub"}
          onClick={() => setHelpPage(1)}
        >
          지우기
        </button>
      </div>
    );
  } else if (chapter === 2) {
    return (
      <div className="help-sub-container">
        <button
          className={page === 0 ? "help-button-sub-active" : "help-button-sub"}
          onClick={() => setHelpPage(0)}
        >
          이미지업로드
        </button>
        <button
          className={page === 1 ? "help-button-sub-active" : "help-button-sub"}
          onClick={() => setHelpPage(1)}
        >
          도움이미지
        </button>
        <button
          className={page === 2 ? "help-button-sub-active" : "help-button-sub"}
          onClick={() => setHelpPage(2)}
        >
          AI 색칠놀이
        </button>
      </div>
    );
  }
}

function ContentHelp({ chapter, page }) {
  if (chapter === 0) {
    if (page === 0) {
      return (
        <div className="help-content-container">
          <div className="help-content-text">
            버튼을 누르고 원하는 곳을 클릭하면 텍스트를 추가할 수 있어요.
          </div>
          <img
            className="help-content-image"
            src="img/help/help_textadd.gif"
            alt="help"
          />
        </div>
      );
    } else if (page === 1) {
      return (
        <div className="help-content-container">
          <div className="help-content-text">
            버튼을 누르고 원하는 텍스트를 클릭하면 텍스트를 삭제할 수 있어요.
          </div>
          <img
            className="help-content-image"
            src="img/help/help_textdelete.gif"
            alt="help"
          />
        </div>
      );
    } else if (page === 2) {
      return (
        <div className="help-content-container">
          <div className="help-content-text">
            버튼을 누르고 원하는 텍스트를 드래그&드롭해 이동시킬 수 있어요.
          </div>
          <img
            className="help-content-image"
            src="img/help/help_textmove.gif"
            alt="help"
          />
        </div>
      );
    } else if (page === 3) {
      return (
        <div className="help-content-container">
          <div className="help-content-text">
            버튼을 누르고 원하는 텍스트를 클릭하면 텍스트 내용을 수정할 수
            있어요.
          </div>
          <img
            className="help-content-image"
            src="img/help/help_textchange.gif"
            alt="help"
          />
        </div>
      );
    }
  } else if (chapter === 1) {
    if (page === 0) {
      return (
        <div className="help-content-container">
          <div className="help-content-text">
            그림을 그려요. 색을 선택하고 굵기를 선택할 수 있어요.
          </div>
          <img
            className="help-content-image"
            src="img/help/help_draw.gif"
            alt="help"
          />
        </div>
      );
    } else if (page === 1) {
      return (
        <div className="help-content-container">
          <div className="help-content-text">
            지우개 버튼을 누르면 그린 것들을 지울 수 있어요.
          </div>
          <img
            className="help-content-image"
            src="img/help/help_drawerase.gif"
            alt="help"
          />
        </div>
      );
    }
  } else if (chapter === 2) {
    if (page === 0) {
      return (
        <div className="help-content-container">
          <div className="help-content-text">
            이미지를 선택해 넣을 수 있어요. 원하지 않는 부분만 지울 수도 있어요.
          </div>
          <img
            className="help-content-image"
            src="img/help/help_imageupload.gif"
            alt="help"
          />
        </div>
      );
    } else if (page === 1) {
      return (
        <div className="help-content-container">
          <div className="help-content-text">
            도움을 주기 위한 기본 이미지 중 선택해 넣을 수 있어요.
          </div>
          <img
            className="help-content-image"
            src="img/help/help_imagebasic.gif"
            alt="help"
          />
        </div>
      );
    } else if (page === 2) {
      return (
        <div className="help-content-container">
          <div className="help-content-text">도움말넣기.</div>
          <img
            className="help-content-image"
            src="img/help/help_imagebasic.gif"
            alt="help"
          />
        </div>
      );
    }
  }
}

function HelpButton() {
  const [helpChapter, setHelpChapter] = useState(0); // 0 : 텍스트 / 1 : 그림 / 2 : 이미지 / 3 : 기타
  const [helpPage, setHelpPage] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <>
      <button className="help-button" onClick={toggleHelp}>
        ?
      </button>
      {showHelp && (
        <div className="help-modal-overlay">
          <div className="help-modal">
            <button className="help-modal-close" onClick={toggleHelp}>
              x
            </button>
            <div className="button-chapter-container">
              <button
                className={
                  helpChapter === 0
                    ? "help-button-chapter-active"
                    : "help-button-chapter"
                }
                onClick={() => {
                  setHelpChapter(0);
                  setHelpPage(0);
                }}
              >
                텍스트
              </button>
              <button
                className={
                  helpChapter === 1
                    ? "help-button-chapter-active"
                    : "help-button-chapter"
                }
                onClick={() => {
                  setHelpChapter(1);
                  setHelpPage(0);
                }}
              >
                그림
              </button>
              <button
                className={
                  helpChapter === 2
                    ? "help-button-chapter-active"
                    : "help-button-chapter"
                }
                onClick={() => {
                  setHelpChapter(2);
                  setHelpPage(0);
                }}
              >
                이미지
              </button>
            </div>
            <SubButton
              chapter={helpChapter}
              page={helpPage}
              setHelpPage={setHelpPage}
            />
            <div className="help-deco-line" />
            <ContentHelp chapter={helpChapter} page={helpPage} />
          </div>
        </div>
      )}
    </>
  );
}

export default HelpButton;
