import React from "react";
import "../../styles/Loading.css";
const Loading = ({ text }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-text">
        <div>{text}</div>
        <div>잠시만 기다려 주세요.</div>
      </div>
    </div>
  );
};
export default Loading;
