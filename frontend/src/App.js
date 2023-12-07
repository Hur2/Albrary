import React from "react";
import Menu from "./pages/Menu";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./pages/AuthContext"; // 로그인 정보 관리
import Home from "./pages/Home"; // 프론트 페이지
import Make from "./pages/MakeNew"; // 책 만들기 페이지
import Mine from "./pages/Mine"; // 나만의 책장 페이지
import BookShow from "./pages/BookShow"; // 책 열람 페이지
import Everyone from "./pages/Everyone"; // 모두의 책장 페이지
import Login from "./pages/Login"; // 로그인 페이지
import Signup from "./pages/Signup"; // 회원가입 페이지
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Menu />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/make" element={<Make />} />
            <Route path="/mine" element={<Mine />} />
            <Route path="/BookShow/:id" element={<BookShow />} />
            <Route path="/everyone" element={<Everyone />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
