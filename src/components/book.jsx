import React from "react";

export default function Book({ title, coverPath }) {
  return (
    <div className="book-container">
      <img src={coverPath} alt="coverImage" />
      <div className="bookTitle">
        <h3>{title}</h3>
      </div>
    </div>
  );
}
