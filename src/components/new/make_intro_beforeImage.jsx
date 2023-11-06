import { useState, useEffect } from "react";

function MakeIntroBeforeImage({ setPhase }) {
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

  return (
    <div className={`fade-in ${nowFadeState ? "fade-out" : ""}`}>
      <div className="intro-text">
        거의 다 만들었어요! 이제 그림을 그려볼까요?
      </div>
    </div>
  );
}

export { MakeIntroBeforeImage };
