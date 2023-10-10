import React, { useState, useEffect } from "react";
import { questionData, storyData } from "./Make_data";

export default function TextCreator({ onPhaseChange }) {
  const [textPhase, setTextPhase] = useState(0);
  const [baseComplete, setBaseComplete] = useState(0); // 기본 질문이 다 완료되면 1로 바꿔, MakeText 호출

  //texthase 내 페이즈
  useEffect(() => {
    setTimeout(() => {
      setTextPhase(1);
    }, 1000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setTextPhase(2);
    }, 5000);
  }, []);

  return (
    <div className="text-wrapper">
      {textPhase === 1 ? <Intro /> : null}
      {textPhase === 2 && baseComplete === 0 ? (
        <MakeBaseText onComplete={setBaseComplete} />
      ) : null}
      {textPhase === 2 && baseComplete === 1 ? (
        <MakeText onPhaseChange={onPhaseChange} />
      ) : null}
    </div>
  );
}

function Intro() {
  const [nowFadeState, setFadeState] = useState(0);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFadeState(1);
    }, 2500);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <div className={`fade-in ${nowFadeState ? "fade-out" : ""}`}>
      <div className="make-container">
        <div className="intro-text">지금부터 책을 만들어 볼까요?</div>
      </div>
    </div>
  );
}

function MakeBaseText({ onComplete }) {
  // 기초 질문 생성

  const baseQuestions = [
    "주인공의 이름은?",
    "주인공의 성별은?",
    "주인공의 나이는?",
    "주인공이 가장 좋아하는 것은?",
    "주인공이 가장 싫어하는 것은?",
  ];

  const [baseAnswers, setBaseAnswers] = useState(
    Array(baseQuestions.length).fill("")
  );

  const handleAnswerChange = (index, event) => {
    const newAnswers = [...baseAnswers];
    newAnswers[index] = event.target.value;
    setBaseAnswers(newAnswers);
  };

  const handleSubmit = () => {
    //답변 처리

    console.log("기본답변:", baseAnswers);

    onComplete(1); // base 질문 답 완료
  };

  return (
    <div className="fade-in">
      <div className="make-container">
        <form onSubmit={handleSubmit}>
          {baseQuestions.map((question, index) => (
            <div key={index}>
              <label>{question}</label>
              <input
                type="text"
                value={baseAnswers[index]}
                onChange={(event) => handleAnswerChange(index, event)}
              />
            </div>
          ))}
          <button type="submit">제출하기</button>
        </form>
      </div>
    </div>
  );
}

function MakeText({ onPhaseChange }) {
  // 스토리 생성
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const currentQuestion = questionData[currentQuestionIndex];

  const totalQuestions = questionData.length; // 총 질문 개수

  const handleAnswerClick = (answer) => {
    // 다음 질문으로 이동
    // 개발 사항 : answer 을 GPT API 에 전달
    const nextQuestionIndex = currentQuestionIndex + 1;

    if (nextQuestionIndex < questionData.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      /* 질문 종료 -> 그림 선택 페이즈로 넘어가기*/
      onPhaseChange(3);
    }

    setSelectedAnswer("");
  };

  // 진행도 계산
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="fade-in">
      <div className="make-container">
        <div className="text-title">
          <h1>1단계 . 글짓기</h1>
        </div>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="story-container">{storyData}</div>
        <div className="question">
          <p>{currentQuestion.question}</p>
        </div>
        <div className="options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(option)}
              className={selectedAnswer === option ? "selected" : ""}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
