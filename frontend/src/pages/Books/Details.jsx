import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getBooks } from "../../services/google.apis.books";
import { checkBookInCatalog } from "../../services/books";
import Showcase from "../../containers/Books/Details/Showcase";
import AddToCatalog from "../../containers/Books/Details/AddToCatalog";
import BookInCatalog from "../../containers/Books/Details/BookInCatalog";

const catalogData = {
  inCatalog: false,
  score: 0,
};

const Details = () => {
  const [book, setBook] = useState({});
  const [onUserCatalog, setOnUserCatalog] = useState(catalogData);
  const { state } = useLocation();
  const { title } = useParams();

  const getBookFromFetch = useCallback(async () => {
    const fetchedBooks = await getBooks(title);
    const exactBook = fetchedBooks.filter((book) => book.title === title);
    setBook(exactBook[0]);
  }, [title]);

  const checkBookInCatalogHandler = useCallback(async () => {
    const results = await checkBookInCatalog(book);

    if (results.status) {
      setOnUserCatalog({
        ...onUserCatalog,
        inCatalog: true,
        score: results.score,
      });
      return;
    }
    setOnUserCatalog({
      ...onUserCatalog,
      inCatalog: false,
      score: 0,
    });
  }, [book, onUserCatalog.inCatalog]);

  useEffect(() => {
    if (state !== null) {
      setBook(state);
      checkBookInCatalogHandler();
      return;
    }
    getBookFromFetch();
    checkBookInCatalogHandler();
  }, [state, getBookFromFetch, checkBookInCatalogHandler]);

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-center justify-content-lg-end  mb-2">
        {onUserCatalog.inCatalog ? (
          <BookInCatalog
            score={onUserCatalog.score}
            refresh={getBookFromFetch}
          />
        ) : (
          <AddToCatalog book={book} refresh={getBookFromFetch} />
        )}
      </div>
      <Showcase book={book} />
    </div>
  );
};

export default Details;
