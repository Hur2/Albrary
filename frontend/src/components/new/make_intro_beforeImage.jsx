import { useState, useEffect } from "react";

function MakeIntroBeforeImage({ setPhase, setProgress }) {
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
      setPhase(5);
    }, 3500);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  setProgress(100); // 간혹 요청이 setProgress보다 먼저 가 이 컴포넌트로 넘어온 경우 progress가 100%가 안되는 상황 방지

  return (
    <div className={`fade-in ${nowFadeState ? "fade-out" : ""}`}>
      <div className="intro-text">
        거의 다 만들었어요! 이제 동화책을 만들어볼까요?
      </div>
    </div>
  );
}

export { MakeIntroBeforeImage };
