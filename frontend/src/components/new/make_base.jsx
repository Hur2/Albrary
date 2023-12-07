import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "./loading";
import "../../styles/MakeContentBase.css";

function MakeBase({ setPhase, setProgress, setBaseResponseData }) {
  const [baseQuestion, setBaseQuestion] = useState([]);
  const [baseAnswer, setBaseAnswer] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [baseDataLoading, setBaseDataLoading] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);

  useEffect(() => {
    async function sendGetRequest() {
      try {
        const response = await axios.get("http://13.124.203.82:5000/initQuest");
        //const response = await axios.get("base_data.json");
        const data = response.data;

        if (data && data.questionData) {
          setBaseQuestion(data.questionData);
          setBaseAnswer(Array(data.questionData.length).fill(""));
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

  function createBaseData(baseQuestion, baseAnswer) {
    const data = baseQuestion.map((item, index) => ({
      baseQuestion: item.question,
      baseAnswer: baseAnswer[index],
    }));
    return data;
  }

  // 다음 버튼
  const handleNextQuestion = () => {
    if (currentQuestionIndex < baseQuestion.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setProgress(((currentQuestionIndex + 1) / baseQuestion.length) * 100);
    } else {
      setProgress(((currentQuestionIndex + 1) / baseQuestion.length) * 100);

      const jsonData = createBaseData(baseQuestion, baseAnswer);

      async function sendPostRequest() {
        try {
          setIsLoadingPost(true);
          const response = await axios.post(
            "http://13.124.203.82:5000/questionMaking",
            jsonData
          );
          setBaseResponseData(response);
          setPhase(2);
        } catch (error) {
          console.log(error);
        }
      }
      if (!isLoadingPost) {
        //실제용
        sendPostRequest();
        //더미용
        //setPhase(2);
      }
    }
  };

  if (!baseDataLoading) {
    return <Loading text="첫 질문을 만드는 중이에요." />;
  }

  if (isLoadingPost) {
    return <Loading text="질문을 만드는 중이에요." />;
  } else {
    return (
      <div className="make-content-wrapper">
        <div className="fade-in">
          {currentQuestionIndex < baseQuestion.length && (
            <div className="base-container">
              <div className="base-question">
                {baseQuestion[currentQuestionIndex].question}
              </div>
              <div className="base-form">
                <input
                  type="text"
                  value={baseAnswer[currentQuestionIndex]}
                  onChange={handleAnswerChange}
                  className="base-answer"
                />
                <button className="base-button" onClick={handleNextQuestion}>
                  <img src="img/make_button_input.png" alt="btn-input"></img>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export { MakeBase };
