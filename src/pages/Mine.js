import React, { useState, useEffect } from "react";

import Book from "../components/book";
import "../styles/Mine.css";

function Mine() {
  const [mineBookData, setMineBookData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("book_list.json");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setMineBookData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  if (!mineBookData) {
    //로딩
    return <div>Loading...</div>;
  }

  return (
    <div className="mine-container">
      {mineBookData.mineBook.map((book, index) => {
        return (
          <Book
            title={book.title}
            coverPath={book.coverPath}
            key={index}
            id={book.id}
          />
        );
      })}
    </div>
  );
}

export default Mine;
