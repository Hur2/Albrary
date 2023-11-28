import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "./loading";
import "../../styles/MakeContentText.css";

function MakeText({
  setPhase,
  setProgress,
  baseResponseData,
  setStoryResponseData,
}) {
  const [questionData, setQuestionData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [isLoadingPost, setIsLoadingPost] = useState(0);

  //데이터 갖고오기(실제)

  useEffect(() => {
    if (baseResponseData) {
      setQuestionData(baseResponseData.data.questionData);
      setProgress(0);
    }
  }, [baseResponseData]);

  /*
  // 더미 데이터 갖고오기
  useEffect(() => {
    async function sendGetRequest() {
      try {
        const response = await axios.get("Make_data.json");
        const data = response.data;
        setProgress(0);
        if (data && data.questionData) {
          setQuestionData(data.questionData); // JSON 데이터를 저장
        }
      } catch (error) {
        console.log(error);
      }
    }

    sendGetRequest(); // 무조건 데이터 요청을 보내도록 수정
  }, []);
*/

  const currentQuestion = questionData && questionData[currentQuestionIndex];

  const totalQuestions = questionData ? questionData.length : 0;

  function createTextData(question, selectedAnswer) {
    const data = question.map((question, index) => ({
      question: question,
      option: selectedAnswer[index],
    }));
    return data;
  }

  const handleAnswerClick = (answer) => {
    // 다음 질문으로 이동
    setProgress(((currentQuestionIndex + 1) / totalQuestions) * 100);
    const newSelectedAnswer = [...selectedAnswer];
    newSelectedAnswer.push(answer);
    setSelectedAnswer(newSelectedAnswer);

    const nextQuestionIndex = currentQuestionIndex + 1;

    if (nextQuestionIndex < totalQuestions) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      // 질문 종료 -> 그림 선택 페이즈로 넘어가기

      //실제
      async function sendPostRequest() {
        try {
          setIsLoadingPost(1);
          const response = await axios.post(
            "http://127.0.0.1:5000/storyMaking",
            jsonData
          );
          setStoryResponseData(response);
          setPhase(4);
        } catch (error) {
          console.log(error);
        }
      }
      /*
      //더미
      async function sendPostRequest() {
        try {
          setIsLoadingPost(1);
          const response = await axios.get("boork.json");
          console.log(response);
          setStoryResponseData(response);
          setPhase(4);
        } catch (error) {
          console.log(error);
        }
      }
      if (isLoadingPost === 0) {
        sendPostRequest();
      }
*/
      const jsonData = createTextData(questionData, newSelectedAnswer);

      if (isLoadingPost === 0) {
        sendPostRequest();
      }
    }
  };

  if (isLoadingPost) {
    return <Loading text="스토리와 배경을 만드는 중이에요." />;
  } else {
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
}
export { MakeText };
