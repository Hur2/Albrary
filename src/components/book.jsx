import React from "react";
import { Link } from "react-router-dom";

export default function Book({ id, title, author, coverPath }) {
  return (
    <Link className="book-link" to={`/BookShow/${id}`}>
      <div className="book-container">
        <img src={coverPath} alt="coverImage" />
        <div className="bookTitle">
          <h3>{title}</h3>
          <h4>{author}</h4>
        </div>
      </div>
    </Link>
  );
}
