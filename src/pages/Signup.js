import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Signup.css"; // 스타일 파일 경로에 맞게 조정하세요.

const Signup = () => {
  const [formData, setFormData] = useState({
    userProfileImage: "",
    userName: "",
    userId: "",
    userPassword: "",
    passwordConfirm: "",
  });

  const [selectedProfile, setSelectedProfile] = useState(null);

  const { userProfileImage, userName, userId, userPassword, passwordConfirm } =
    formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onImageSelect = (imageNumber) => {
    setFormData({ ...formData, userProfileImage: imageNumber });
    setSelectedProfile(imageNumber);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (selectedProfile === null) {
      alert("프로필 이미지를 선택해 주세요.");
      return;
    }

    if (userPassword !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8082/registration", {
        userName,
        userId,
        userPassword,
        userProfileImage,
        withCredentials:true
      });
      alert("회원가입에 성공했습니다.");
    } catch (error) {
      console.error("회원가입 요청 실패", error);
      // 에러 처리 로직 구현
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={onSubmit}>
        <div className="profile-container">
          {[0, 1, 2, 3, 4].map((number) => (
            <button
              className={`signup-button-profile ${
                selectedProfile === number ? "selected" : ""
              }`}
              type="button"
              key={number}
              onClick={() => onImageSelect(number)}
            >
              <img
                src={"img/icon_profile_" + number + ".png"}
                alt="icon-profile"
              />
            </button>
          ))}
        </div>
        <div>
          <input
            className="signup-input"
            type="text"
            name="userName"
            value={userName}
            onChange={onChange}
            placeholder="사용자 닉네임"
            required
          />
        </div>
        <div>
          <input
            className="signup-input"
            type="text"
            name="userId"
            value={userId}
            onChange={onChange}
            placeholder="아이디"
            required
          />
        </div>
        <div>
          <input
            className="signup-input"
            type="password"
            name="userPassword"
            value={userPassword}
            onChange={onChange}
            placeholder="비밀번호"
            required
          />
        </div>
        <div>
          <input
            className="signup-input"
            type="password"
            name="passwordConfirm"
            value={passwordConfirm}
            onChange={onChange}
            placeholder="비밀번호 확인"
            required
          />
        </div>
        <button className="signup-button-signup" type="submit">
          회원가입
        </button>
      </form>
      <Link to="/login" className="login-link">
        로그인
      </Link>
    </div>
  );
};

export default Signup;
