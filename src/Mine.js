import React from "react";
import Book from "./components/book";
import { dummy } from "./bookdummy";
import "./Mine.css";

function Mine() {
  return (
    <div>
      <div className="mine-container">
        {dummy.results.map((item) => {
          return <Book title={item.title} coverPath={item.coverPath} />;
        })}
      </div>
    </div>
  );
}

export default Mine;
