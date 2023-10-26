import React, { useState, useEffect } from "react";
import "../styles/Home.css";

function Make() {
  const [intro2, setIntro2] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntro2(1);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div className="front-container">
        <h1>아이와 함께 동화책을 만들어보세요!</h1>
        {intro2 === 1 ? <h2>설명문테스트</h2> : null}
      </div>
    </>
  );
}

export default Make;
