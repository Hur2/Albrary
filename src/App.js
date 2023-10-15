import React from "react";
import Menu from "./pages/Menu";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home"; // 프론트 페이지
import Make from "./pages/Make"; // 책 만들기 페이지
import Mine from "./pages/Mine"; // 나만의 책장 페이지
import BookShow from "./pages/BookShow";
import Everyone from "./pages/Everyone"; // 모두의 책장 페이지

import "./App.css";

function App() {
  return (
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/make" element={<Make />} />
        <Route path="/mine" element={<Mine />} />
        <Route path="/BookShow/:id" element={<BookShow />} />
        <Route path="/everyone" element={<Everyone />} />
      </Routes>
    </Router>
  );
}

export default App;
