import { useState, useEffect } from "react";

function MakeIntroBeforeText({ setPhase }) {
  const [nowFadeState, setFadeState] = useState(0);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFadeState(1);
    }, 2500);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setPhase(3);
    }, 3500);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <div className={`fade-in ${nowFadeState ? "fade-out" : ""}`}>
      <div className="intro-text">
        좋아요! 이제 제가 드리는 질문에 답을 해주세요
      </div>
    </div>
  );
}

export { MakeIntroBeforeText };
