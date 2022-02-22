const connection = require("../database");
const jwt = require("jsonwebtoken");

const controller = {};

controller.ListAll = async (req, res) => {};

controller.Save = async (req, res) => {
  const book = {
    ...req.body,
    fk_user: req.user.id,
  };

  console.log(book);

  try {
    if (book.pagesReaded === 0) {
      delete book.pagesReaded;
      await connection.query("insert into userbooks set ?", [book]);
      return res
        .status(200)
        .json({ status: true, statusText: "Book added to catalog" });
    }

    if (book.pagesReaded > 0) {
      const pages = book.pagesReaded;

      if (pages > book.pageCount) {
        return res.json({
          status: false,
          statusText: "This book not have that number of pages",
        });
      }

      delete book.pagesReaded;
      await connection.query("insert into userbooks set ?", [book]);
      const getBook = await connection.query(
        "select * from userbooks where title = ? && fk_user = ?",
        [book.title, req.user.id]
      );

      const advance = {
        fk_user: req.user.id,
        fk_book: getBook[0].id,
        pagesReaded: pages,
        commentary: "",
      };

      await connection.query("insert into userbooksadvance set ?", [advance]);
    }
    res.status(200).json({ status: true, statusText: "Book added to catalog" });
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      statusText: "Something wen't wrong, try again later",
    });
  }
};

controller.getBookAdvance = async (req, res) => {
  const { id } = req.params;

  try {
    const results = await connection.query(
      "select * from userbooksadvance where fk_user = ? && fk_book = ?",
      [req.user.id, id]
    );

    if (!results.length > 0) {
      return res.json({ status: false, bookAdvance: "Not advance" });
    }
    res.json({ status: true, bookAdvance: results[0] });
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      statusText: "Something wen't wrong, try again later",
    });
  }
};

controller.checkIfAlreadyInUserCatalog = async (req, res) => {
  const { title } = req.body;
  const { id } = req.user;

  try {
    const results = await connection.query(
      "select * from userbooks where title = ? && fk_user = ?",
      [title, id]
    );

    if (results.length > 0) {
      return res.json({
        status: true,
        statusText: "Already on catalog",
        book: results[0],
      });
    }
    res.json({
      status: false,
      statusText: "Not in catalog",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      statusText: "Something wen't wrong, try again later",
    });
  }
};

controller.removeBookFromCatalog = async (req, res) => {
  const { title } = req.body;
  const { id } = req.user;

  try {
    const book = await connection.query(
      "select * from userbooks where title = ? && fk_user = ?",
      [title, id]
    );
    await connection.query(
      "delete from userbooksadvance where fk_book = ? && fk_user = ?",
      [book[0].id, id]
    );
    await connection.query(
      "delete from userbooks where title = ? && fk_user = ?",
      [title, id]
    );

    res.json({
      status: true,
      statusText: "Removed from catalog",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      statusText: "Something wen't wrong, try again later",
    });
  }
};

controller.Update = async (req, res) => {};

controller.Delete = async (req, res) => {};

module.exports = controller;
