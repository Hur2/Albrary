import { useState, useContext } from "react";
import { AuthContext } from "../../pages/AuthContext";
import LoadingLogin from "./loading_login";
import "../../styles/MakeFront.css";

function MakeFront({ setIsMaking }) {
  const [frontPhase, setFrontPhase] = useState(0);

  const { authData } = useContext(AuthContext);
  const { isLogin } = authData;

  if (!isLogin) {
    return <LoadingLogin />;
  } else {
    if (frontPhase === 0) {
      return (
        <div className="make-front-container">
          <div className="content">
            <div className="title">동화책 만들기</div>
            <div className="intro">
              AI와 함께 동화책을 만들어 볼 수도 있고, 직접 만들어 볼 수도
              있어요.
            </div>
            <button onClick={() => setFrontPhase(1)}>시작하기</button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="make-front-container">
          <div className="fade-in">
            <div className="content-select">
              <button className="left-button" onClick={() => setIsMaking(1)}>
                <div className="button-title">AI에 도움받기</div>
                <div className="button-intro">
                  내용과 배경을 AI가 만들어줘요
                </div>
                <div className="button-intro">
                  AI가 만든 부분도 수정이 가능해요
                </div>
              </button>
              <button className="right-button" onClick={() => setIsMaking(2)}>
                <div className="button-title">AI에 도움받지않기</div>
                <div className="button-intro">
                  AI 도움 없이 직접 동화책을 만들어요
                </div>
                <div className="button-intro">
                  빠르게 책을 만들어 볼 수 있어요
                </div>
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
}

export { MakeFront };
