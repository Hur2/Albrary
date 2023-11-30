import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function MakePortal() {
  const navigate = useNavigate();

  return (
    <div className="front-portal">
      <div className="front-portal-container">
        <div className="front-portal-title">책 만들기</div>
        <div className="front-portal-info">책을 만들어보세요.</div>
        <button
          className="front-portal-button-make"
          onClick={() => navigate("/Make")}
        >
          바로가기
        </button>
      </div>

      <div className="front-deco-line" />

      <div className="front-portal-container">
        <div className="front-portal-title">나만의 책장</div>
        <div className="front-portal-info">내가 만든 책을 감상해요.</div>
        <button
          className="front-portal-button-mine"
          onClick={() => navigate("/Mine")}
        >
          바로가기
        </button>
      </div>

      <div className="front-deco-line" />

      <div className="front-portal-container">
        <div className="front-portal-title">모두의 책장</div>
        <div className="front-portal-info">모두가 만든 책을 함께 봐요.</div>
        <button
          className="front-portal-button-every"
          onClick={() => navigate("/Everyone")}
        >
          바로가기
        </button>
      </div>
    </div>
  );
}

function MakeFooter() {
  return (
    <div className="front-footer">
      <div>
        2023 제2회 캡스톤 경진대회 | 소프트웨어학부 이승우 오재환 이용현
      </div>
      <div>웹 내 이미지 출처 : flaticon.com</div>
    </div>
  );
}
function Make() {
  const [intro2, setIntro2] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntro2(1);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div className="front-container">
        <div className="front-title">아이와 함께 동화책을 만들어보세요!</div>
        {intro2 === 1 ? <MakePortal /> : null}
      </div>
      <MakeFooter />
    </>
  );
}

export default Make;
