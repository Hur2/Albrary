import React, { useEffect, useRef } from 'react';
import "../styles/LoginModal.css"

const LoginModal = ({ children, onClose }) => {
  const modalRef = useRef();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="login-modal" ref={modalRef}>
      {children}
    </div>
  );
};

export default LoginModal;