import React, { useState, useEffect } from "react";
import Loading from "../components/new/loading";
import Book from "../components/book";
import axios from "axios";
import "../styles/MineEveryone.css";

function Mine() {
  const [everyBookData, setEveryBookData] = useState(null);
  const [dataLoading, setDataLoading] = useState(0);

  useEffect(() => {
    async function sendGetRequest() {
      try {
        //실제

        const response = await axios.get(
          "http://13.124.203.82:8082/books/book_list"
        ,{withCredentials:true});

        //더미
        //const response = await axios.get("book_list.json");

        setEveryBookData(response.data);
        setDataLoading(1);
      } catch (error) {
        console.log(error);
      }
    }
    if (!dataLoading) {
      sendGetRequest();
    }
  }, [dataLoading]);

  if (!dataLoading) {
    //로딩
    return <Loading text="책 목록을 가져오는 중이에요." />;
  }

  const rankingBooks = everyBookData.mineBook.slice(0, 3);
  const otherBooks = everyBookData.mineBook.slice(3);

  return (
    <div className="everyone-container">
      <div className="ranking-books">
        {rankingBooks.map((book, index) => {
          let trophyImage = "";
          switch (index) {
            case 0:
              trophyImage = "img/list_gold.png";
              break;
            case 1:
              trophyImage = "img/list_silver.png";
              break;
            case 2:
              trophyImage = "img/list_bronze.png";
              break;
            default:
              trophyImage = "";
          }

          return (
            <div className="book-with-trophy" key={book.id}>
              <img className="list-trophy" src={trophyImage} alt="trophy" />
              <Book
                title={book.title}
                coverPath={book.cover_image}
                author={book.author}
                id={book.id}
              />
            </div>
          );
        })}
      </div>

      <div className="other-books">
        {otherBooks.map((book, index) => (
          <Book
            title={book.title}
            coverPath={book.cover_image}
            author={book.author}
            key={book.id}
            id={book.id}
          />
        ))}
      </div>
    </div>
  );
}

export default Mine;
