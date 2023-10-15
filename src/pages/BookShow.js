import React from "react";
import { useParams } from "react-router-dom";

function BookShow() {
  const { id } = useParams();

  return (
    <>
      <div>
        <h1>책예시</h1>
        <h2>bookId : {id}</h2>
      </div>
    </>
  );
}

export default BookShow;
