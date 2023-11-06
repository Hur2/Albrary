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

  const handleButtonClick = () => {
    // 뒤로가기 버튼
  };

  const [isVisibleTab, setIsVisibleTab] = useState(0); // 원 효과 이후 tab이 보이게 관리

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsVisibleTab(1);
    }, 1000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  if (isVisibleTab) {
    return (
      <div className="fade-in">
        <div className="make-tab">
          <TabTitleCircle number={1} />
          <span className="tab-title-line-dot">•••••</span>
          <TabTitleCircle number={2} />
          <span className="tab-title-line-dot">•••••</span>
          <TabTitleCircle number={3} />
          <div className="tab-title-text">{tabTitle[phase]}</div>

          <TabProgress />

          <div className="tab-progress-bar">
            <div
              className="tab-progress"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="tab-buttonESC" onClick={handleButtonClick}>
            <img src="img/make_button_back.png" alt="backbutton" />
          </div>
        </div>
        <div className="tab-line" />
      </div>
    );
  } else return null;
}

function TabTitleCircle({ number }) {
  return (
    <div className="tab-title-circle">
      <div className="tab-title-number">{number}</div>
    </div>
  );
}

function TabProgress() {}

export { MakeTab };
