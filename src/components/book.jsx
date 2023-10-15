import React from "react";
import { Link } from "react-router-dom";

export default function Book({ title, coverPath, id }) {
  return (
    <Link to={`/BookShow/${id}`}>
      <div className="book-container">
        <img src={coverPath} alt="coverImage" />
        <div className="bookTitle">
          <h3>{title}</h3>
        </div>
      </div>
    </Link>
  );
}
