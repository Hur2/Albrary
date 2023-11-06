import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/MakeContentBase.css";

function MakeBase({ setPhase, setProgress }) {
  const numberQuestion = 5;
  const [baseQuestion, setBaseQuestion] = useState([]);
  const [baseAnswer, setBaseAnswer] = useState(Array(numberQuestion).fill(""));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [baseDataLoading, setBaseDataLoading] = useState(0);

  // 데이터 갖고오기
  useEffect(() => {
    async function sendGetRequest() {
      try {
        const response = await axios.get("base_data.json");
        const data = response.data;

        if (data && data.baseQuestions) {
          setBaseQuestion(data.baseQuestions); // 배열에 JSON 데이터를 저장
          setBaseDataLoading(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (!baseDataLoading) {
      sendGetRequest();
    }
  }, [baseDataLoading]);

  // 폼 처리
  const handleAnswerChange = (event) => {
    const updatedAnswers = [...baseAnswer];
    updatedAnswers[currentQuestionIndex] = event.target.value;
    setBaseAnswer(updatedAnswers);
  };

  // 다음 버튼
  const handleNextQuestion = () => {
    if (currentQuestionIndex < baseQuestion.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setProgress(((currentQuestionIndex + 1) / numberQuestion) * 100);
      console.log("baseAnswer:", baseAnswer);
    } else {
      // 개발사항 :  GPT로 보내기
      setProgress(((currentQuestionIndex + 1) / numberQuestion) * 100);
      setPhase(2);
    }
  };

  if (!baseDataLoading) {
    return <div className="make-content-wrapper">loading...</div>;
  }

  return (
    <div className="make-content-wrapper">
      <div className="fade-in">
        {currentQuestionIndex < baseQuestion.length && (
          <div className="base-container">
            <div className="base-question">
              {baseQuestion[currentQuestionIndex]}
            </div>
            <div className="base-form">
              <input
                type="text"
                value={baseAnswer[currentQuestionIndex]}
                onChange={handleAnswerChange}
                className="base-answer"
              />
              <button className="base-button" onClick={handleNextQuestion}>
                다 썼어요!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { MakeBase };
