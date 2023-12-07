import React from "react";
import { Link } from "react-router-dom";
import "../../styles/LoadingLogin.css";

const LoadingLogin = () => {
  return (
    <div className="loading-container">
      <div>로그인이 필요한 서비스입니다.</div>
      <button className="loading-login-button">
        <Link to="/login" className="loading-login-link">
          로그인
        </Link>
      </button>
    </div>
  );
};
export default LoadingLogin;
