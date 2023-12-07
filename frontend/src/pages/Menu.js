import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";

function Menu() {
  const { authData, logout: contextLogout } = useContext(AuthContext);
  const { isLogin, userProfileImage, userName } = authData;
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const logout = () => {
    contextLogout();
    navigate("/");
  };

  const profileImageSrc = "/img/icon_profile_" + userProfileImage + ".png";

  return (
    <div className="header">
      <div class="menu-background">
        <div className="logo">
          <Link to="/">
            <img src="/img/logo_aibrary.png" alt="logo" width="250" />
          </Link>
        </div>
        <MenuText />
        <div className="menu-login-button">
          {isLogin ? (
            <div>
              <img
                className="menu-icon-profile"
                src={profileImageSrc}
                alt="Profile"
                onClick={handleModal}
              />
              {showModal && (
                <LoginModal onClose={closeModal}>
                  <p>{userName}</p>
                  <button className="menu-loginmodal-logout" onClick={logout}>
                    로그아웃
                  </button>
                </LoginModal>
              )}
            </div>
          ) : (
            <button className="menu-login-before">
              <Link className="menu-login-before-link" to="/login">
                로그인 후 이용해주세요.
              </Link>
            </button>
          )}
        </div>
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
          <img
            className="menu-polygon"
            src="/img/menu_polygon.png"
            alt="menu polygon"
            draggable="false"
          />
        )}
      </div>
      <img className="menu-line" src="/img/menu_line.png" alt="menu line" />
      <div className="menu-item">
        <Link
          to="/Mine"
          className={location.pathname !== "/Mine" ? "gray-text" : ""}
        >
          나만의 책장
        </Link>
        {location.pathname === "/Mine" && (
          <img
            className="menu-polygon"
            src="/img/menu_polygon.png"
            alt="menu polygon"
          />
        )}
      </div>
      <img className="menu-line" src="/img/menu_line.png" alt="menu line" />
      <div className="menu-item">
        <Link
          to="/Everyone"
          className={location.pathname !== "/Everyone" ? "gray-text" : ""}
        >
          모두의 책장
        </Link>
        {location.pathname === "/Everyone" && (
          <img
            className="menu-polygon"
            src="/img/menu_polygon.png"
            alt="menu polygon"
          />
        )}
      </div>
    </div>
  );
}

export default Menu;
