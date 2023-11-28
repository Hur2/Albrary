import React, { useState, useEffect } from "react";

export function Intro({ onComplete }) {
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
      onComplete(2);
    }, 3500);

    return () => {
      clearTimeout(timeOut);
    };
  }, [onComplete]);

  return (
    <div className={`fade-in ${nowFadeState ? "fade-out" : ""}`}>
      <div className="make-container">
        <div className="intro-text">
          거의 다 만들었어요! 이제 그림을 만들어 볼까요?
        </div>
      </div>
    </div>
  );
}
