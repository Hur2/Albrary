import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MakeFinish({ setPhase, setProgress }) {
  const [nowFadeState, setFadeState] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFadeState(1);
    }, 3000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setPhase(7);
      navigate("/Mine");
    }, 5000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <div className={`fade-in ${nowFadeState ? "fade-out" : ""}`}>
      <div className="intro-text">
        만드느라 수고했어요! 만들어진 책은 책장에서 확인하세요
      </div>
    </div>
  );
}

export { MakeFinish };
