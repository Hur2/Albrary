import React, { useState, useEffect } from "react";

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
  const [questionData, setQuestionData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  useEffect(() => {
    async function fetchQuestionData() {
      try {
        const response = await fetch("Make_data.json");
        if (!response.ok) {
          throw new Error("Failed to fetch question data");
        }
        const data = await response.json();
        setQuestionData(data.questionData);
      } catch (error) {
        console.error("Error fetching question data:", error);
      }
    }

    fetchQuestionData();
  }, []);

  const currentQuestion = questionData && questionData[currentQuestionIndex];

  const totalQuestions = questionData ? questionData.length : 0;

  const handleAnswerClick = (answer) => {
    // 다음 질문으로 이동
    // 개발 사항: answer을 GPT API에 전달
    const nextQuestionIndex = currentQuestionIndex + 1;

    if (nextQuestionIndex < totalQuestions) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      // 질문 종료 -> 그림 선택 페이즈로 넘어가기
      onPhaseChange(3);
    }

    setSelectedAnswer("");
  };

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
        <div className="question">
          {currentQuestion ? <p>{currentQuestion.question}</p> : null}
        </div>
        <div className="options">
          {currentQuestion &&
            currentQuestion.options.map((option, index) => (
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
