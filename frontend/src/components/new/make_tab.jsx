import { useState, useEffect } from "react";

import "../../styles/tab.css";

function MakeTab({ phase, progress }) {
  var tabTitle = {
    0: "1단계 : 이야기 구상하기",
    1: "1단계 : 이야기 구상하기",
    2: "2단계 : 책 짓기",
    3: "2단계 : 책 짓기",
    4: "3단계 : 그림 그리기",
    5: "3단계 : 그림 그리기",
  };

  return (
    <div className="fade-in">
      <div className="make-tab">
        <TabIcon phase={phase} />
        <div className="tab-title-text">{tabTitle[phase]}</div>
        <div className="tab-progress-bar">
          <div className="tab-progress" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="tab-line" />
    </div>
  );
}

function TabIcon({ phase }) {
  const [srcBase, setSrcBase] = useState(null);
  const [srcText, setSrcText] = useState(null);
  const [srcDraw, setSrcDraw] = useState(null);
  const [lineProgress, setLineProgress] = useState(0);

  useEffect(() => {
    if (phase <= 1) {
      setSrcBase("img/tab_icon_base.png");
    } else {
      setSrcBase("img/tab_icon_check.png");
    }

    if (phase <= 3) {
      setSrcText("img/tab_icon_text.png");
    } else {
      setSrcText("img/tab_icon_check.png");
    }

    if (phase <= 5) {
      setSrcDraw("img/tab_icon_image.png");
    } else {
      setSrcDraw("img/tab_icon_check.png");
    }

    if (phase === 2) {
      setLineProgress(50);
    }

    if (phase === 4) {
      setLineProgress(100);
    }
  }, [phase]);

  return (
    <div className="tab-icon-container">
      <div
        className="line-progress"
        style={{ width: `${lineProgress}%` }}
      ></div>
      <div className="line-wrapper"></div>
      <div className="icon-wrapper">
        <img className="icon-base" src={srcBase} alt="icon-base" />
        <img className="icon-text" src={srcText} alt="icon-text" />
        <img className="icon-draw" src={srcDraw} alt="icon-draw" />
      </div>
    </div>
  );
}

export { MakeTab };
