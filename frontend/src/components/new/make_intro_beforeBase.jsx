import { useState, useEffect } from "react";

function MakeIntroBeforeBase({ setPhase }) {
  const [isStart, setIsStart] = useState(0);
  const [nowFadeState, setFadeState] = useState(0);
  const [nowPhase, setNowPhase] = useState(0);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsStart(1);
    }, 1000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFadeState(1);
    }, 3500);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFadeState(0);
      setNowPhase(1);
    }, 5000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFadeState(1);
    }, 7500);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setPhase(1);
    }, 9000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  if (isStart === 1) {
    return (
      <div className={`fade-in ${nowFadeState ? "fade-out" : ""}`}>
        <div className="intro-text">
          {nowPhase === 0
            ? "지금부터 책을 만들어 볼까요?"
            : "우선 기본적인 정보를 입력해주세요"}
        </div>
      </div>
    );
  } else return;
}

export { MakeIntroBeforeBase };
