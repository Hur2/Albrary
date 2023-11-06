import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/MakeContentText.css";

function MakeText({ setPhase, setProgress }) {
  const [questionData, setQuestionData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [questionDataLoading, setQuestionDataLoading] = useState(0);

  // 데이터 갖고오기
  useEffect(() => {
    async function sendGetRequest() {
      try {
        const response = await axios.get("Make_data.json");
        const data = response.data;

        if (data && data.questionData) {
          setQuestionData(data.questionData); // JSON 데이터를 저장
          setQuestionDataLoading(true); // 데이터 로딩 상태 업데이트
        }
      } catch (error) {
        console.log(error);
        // 에러가 발생했을 때 에러 처리 로직 추가 가능
      }
    }

    sendGetRequest(); // 무조건 데이터 요청을 보내도록 수정
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
      setProgress(100);
      setPhase(4);
    }

    setSelectedAnswer("");
  };

  setProgress((currentQuestionIndex / totalQuestions) * 100);

  return (
    <div className="make-content-wrapper">
      <div className="fade-in">
        <div className="text-question">
          {currentQuestion ? <p>{currentQuestion.question}</p> : null}
        </div>
        <div className="text-options">
          {currentQuestion &&
            currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(option)}
                className="text-button"
              >
                {option}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

export { MakeText };
