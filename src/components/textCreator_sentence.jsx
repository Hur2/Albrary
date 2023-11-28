import React, { useState, useEffect } from "react";

export function Intro() {
  const [nowFadeState, setFadeState] = useState(0);
  const [nowPhase, setNowPhase] = useState(0);

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
      setFadeState(0);
      setNowPhase(1);
    }, 4000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFadeState(1);
    }, 6500);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <div className={`fade-in ${nowFadeState ? "fade-out" : ""}`}>
      <div className="intro-text">
        {nowPhase === 0
          ? "지금부터 책을 만들어 볼까요?"
          : "우선 기본적인 정보를 입력해주세요"}
      </div>
    </div>
  );
}

export function IntroQuestion({ onComplete }) {
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
      <div className="intro-text">
        좋아요! 이제 제가 드리는 질문에 답을 해주세요
      </div>
    </div>
  );
}
