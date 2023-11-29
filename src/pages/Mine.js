import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import Book from "../components/book";
import Loading from "../components/new/loading";
import LoadingLogin from "../components/new/loading_login";
import axios from "axios";
import "../styles/MineEveryone.css";

function Mine() {
  const [mineBookData, setMineBookData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  const { authData } = useContext(AuthContext);
  const { Id, isLogin } = authData;

  useEffect(() => {
    async function sendGetRequest() {
      try {
        //실제

        const response = await axios.get(
          "http://13.124.203.82:8082/books/mine_book_list"
          ,{withCredentials:true});

        //더미
        //const response = await axios.get("book_list.json");

        setMineBookData(response.data);
        setDataLoading(true);
      } catch (error) {
        console.log(error);
      }
    }
    if (isLogin && !dataLoading) {
      sendGetRequest();
    }
  }, [Id, isLogin, dataLoading]);

  if (!isLogin) {
    return <LoadingLogin />;
  }

  if (!dataLoading) {
    //로딩
    return <Loading text="책 목록을 가져오는 중이에요." />;
  }

  return (
    <div className="mine-container">
      <div className="other-books">
        {mineBookData.mineBook.map((book, index) => (
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
