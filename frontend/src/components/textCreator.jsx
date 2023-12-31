import { useState, useEffect } from "react";
import { Intro, IntroQuestion } from "./textCreator_sentence";

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
    }, 9000);
  }, []);

  return (
    <div className="text-wrapper">
      {textPhase === 1 ? <Intro /> : null}
      {textPhase === 2 && baseComplete === 0 ? (
        <MakeBaseText onComplete={setBaseComplete} />
      ) : null}
      {textPhase === 2 && baseComplete === 1 ? (
        <IntroQuestion onComplete={setBaseComplete} />
      ) : null}
      {textPhase === 2 && baseComplete === 2 ? (
        <MakeText onPhaseChange={onPhaseChange} />
      ) : null}
    </div>
  );
}

function MakeBaseText({ onComplete }) {
  // 기초 질문 생성
  const [baseQuestions, setBaseQuestions] = useState([]);

  //fetch로 JSON 갖고오기
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("base_data.json");
        if (!response.ok) {
          throw new Error("Failed to fetch base data");
        }

        const data = await response.json();
        setBaseQuestions(data.baseQuestions);
      } catch (error) {
        console.error("Error fetching base data:", error);
      }
    }

    fetchData();
  }, []);

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
        <div className="text-title">1단계 : 이야기 구상하기</div>
        <form onSubmit={handleSubmit}>
          {baseQuestions.map((question, index) => (
            <div key={index}>
              <label className="baseQuestion_q">{question}</label>
              <div></div>
              <input
                type="text"
                value={baseAnswers[index]}
                onChange={(event) => handleAnswerChange(index, event)}
                className="baseQuestion_a"
              />
            </div>
          ))}
          <button className="button-normal" type="submit">
            제출하기
          </button>
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
    const nextQuestionIndex = currentQuestionIndex + 1;

    if (nextQuestionIndex < totalQuestions) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      onPhaseChange(3);
    }

    setSelectedAnswer("");
  };

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="fade-in">
      <div className="make-container">
        <div className="text-title">2단계 : 글짓기</div>
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
                className="button-normal"
              >
                {option}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
