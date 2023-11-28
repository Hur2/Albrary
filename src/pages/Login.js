import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    userId: "",
    userPassword: "",
  });

  const { login } = useContext(AuthContext);
  const { userId, userPassword } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    //더미
    const isLogin = "True";
    const Id = "4";
    const userName = "seung";
    const userProfileImage = "2";
    login({ userProfileImage, Id, userName, isLogin: true });
    navigate("/");

    /*

    try {
      const response = await axios.post("http://localhost:8082/auth/login", {
        userId,
        userPassword,
      },{withCredentials:true});
      console.log(response);
      const isLogin = response.data.isLogin;

      if (isLogin === "True") {
        const { Id, userName, userProfileImage } = response.data.userInfo[0];

        login({ userProfileImage, Id, userName, isLogin: true });
        navigate("/");
      } else {
        alert(isLogin);
      }
    } catch (error) {
      console.error("로그인 요청 실패", error);
    }
    */
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={onSubmit}>
        <div>
          <input
            className="login-input"
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={onChange}
            placeholder="아이디"
            required
          />
        </div>
        <div>
          <input
            className="login-input"
            type="password"
            id="userPassword"
            name="userPassword"
            value={formData.userPassword}
            onChange={onChange}
            placeholder="비밀번호"
            required
          />
        </div>
        <button className="login-button-login" type="submit">
          로그인
        </button>
      </form>
      <Link to="/signup" className="signup-link">
        회원가입
      </Link>
    </div>
  );
};

export default Login;
