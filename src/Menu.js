import React from "react";
import logo from "./logo_aibrary.png";
import menu_line from "./menu_line.png";
import menu_polygon from "./menu_polygon.png";
import { Link, useLocation } from "react-router-dom";

import "./App.css";

function Menu(props) {
  return (
    <div className="header">
      <div class="menu-background">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" width="250" />
          </Link>
        </div>
        <MenuText />
      </div>
    </div>
  );
}

function MenuText() {
  const location = useLocation();

  return (
    <div className="menu">
      <div className="menu-item">
        <Link
          to="/Make"
          className={location.pathname !== "/Make" ? "gray-text" : ""}
        >
          책 만들기
        </Link>
        {location.pathname === "/Make" && (
          <img className="menu-polygon" src={menu_polygon} alt="menu polygon" />
        )}
      </div>
      <img className="menu-line" src={menu_line} alt="menu line" />
      <div className="menu-item">
        <Link
          to="/Mine"
          className={location.pathname !== "/Mine" ? "gray-text" : ""}
        >
          나만의 책장
        </Link>
        {location.pathname === "/Mine" && (
          <img className="menu-polygon" src={menu_polygon} alt="menu polygon" />
        )}
      </div>
      <img className="menu-line" src={menu_line} alt="menu line" />
      <div className="menu-item">
        <Link
          to="/Everyone"
          className={location.pathname !== "/Everyone" ? "gray-text" : ""}
        >
          모두의 책장
        </Link>
        {location.pathname === "/Everyone" && (
          <img className="menu-polygon" src={menu_polygon} alt="menu polygon" />
        )}
      </div>
    </div>
  );
}

export default Menu;
