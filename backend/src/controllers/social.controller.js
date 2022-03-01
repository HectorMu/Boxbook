const connection = require("../database");

const controller = {};

controller.ListAll = async (req, res) => {
  try {
    const users = await connection.query("select * from users");
    res.json(users);
  } catch (error) {
    res
      .status(200)
      .json({ status: false, statusText: "Something wen't wrong." });
  }
};

controller.ListCatalog = async (req, res) => {
  try {
    const catalog = await connection.query(
      "select * from userbooks where fk_user = ?",
      [req.params.id]
    );
    res.json(catalog);
  } catch (error) {
    res
      .status(200)
      .json({ status: false, statusText: "Something wen't wrong." });
  }
};

controller.ListSameLocation = async (req, res) => {
  try {
    const FindCurrentUser = await connection.query(
      "select * from users where id = ?",
      [req.user.id]
    );
    const AllUsers = await connection.query(
      "select * from users where id != ?",
      req.user.id
    );

    const filterOnLocation = AllUsers.filter(
      (user) =>
        user.country === FindCurrentUser[0].country &&
        user.city === FindCurrentUser[0].city
    );

    const users = filterOnLocation.map(
      ({ id, username, fullname, email, booksReaded }) => ({
        id,
        username,
        fullname,
        email,
        booksReaded,
      })
    );
    res.json(users);
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json({ status: false, statusText: "Something wen't wrong." });
  }
};
controller.ListOne = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await connection.query("select * from users where id = ?", [
      id,
    ]);
    const FindedUser = results[0];

    const { fullname, username, email, booksReaded, country, city } =
      FindedUser;

    res.json({
      fullname,
      username,
      email,
      country,
      city,
      booksReaded,
    });
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json({ status: false, statusText: "Something wen't wrong." });
  }
};

controller.Contact = async (req, res) => {
  const { id } = req.user;
  const { contactId, message } = req.body;

  console.log(contactId);
  const friendship = {
    user_first_id: id,
    user_second_id: contactId,
    message,
    status: "Pending",
  };
  try {
    await connection.query("insert into friendship set ?", friendship);
    res.json({
      status: true,
      statusText: "Message sended, wait for your response!",
    });
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json({ status: false, statusText: "Something wen't wrong." });
  }
};

controller.GetFrienship = async (req, res) => {
  const { currentId } = req.body;
  try {
    const results = await connection.query(
      "select * from friendship where user_first_id = ? && user_second_id = ?",
      [req.user.id, currentId]
    );
    console.log(results);
    const friendship = results[0];
    res.json(friendship);
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json({ status: false, statusText: "Something wen't wrong." });
  }
};

controller.getUserCommentary = async (req, res) => {
  try {
    const results = await connection.query(
      "select * from userscatalogcommentaries where fk_visitor = ? && fk_usercatalog = ?",
      [req.user.id, req.params.user_catalog]
    );

    if (!results.length > 0) {
      return res
        .status(200)
        .json({ status: false, statusText: "No commentaries" });
    }
    const commentary = results[0];
    res.json(commentary);
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json({ status: false, statusText: "Something wen't wrong." });
  }
};

controller.getCommentaries = async (req, res) => {
  try {
    const commentaries = await connection.query(
      " SELECT  * FROM view_catalogcommentaries WHERE fk_usercatalog = ? && fk_visitor != ?",
      [req.params.user_catalog, req.user.id]
    );
    res.json(commentaries);
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json({ status: false, statusText: "Something wen't wrong." });
  }
};

controller.SaveCatalogCommentary = async (req, res) => {
  const commentary = {
    fk_visitor: req.user.id,
    fk_usercatalog: req.params.user_catalog,
    ...req.body,
  };
  try {
    await connection.query("insert into userscatalogcommentaries set ?", [
      commentary,
    ]);
    res.json({ status: true, statusText: "Commentary added" });
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json({ status: false, statusText: "Something wen't wrong." });
  }
};

controller.RemoveCommentary = async (req, res) => {
  try {
    await connection.query(
      "delete from userscatalogcommentaries where id = ?",
      [req.params.id]
    );
    res.json({ status: true, statusText: "Commentary removed" });
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json({ status: false, statusText: "Something wen't wrong." });
  }
};

controller.Save = async (req, res) => {};

controller.Update = async (req, res) => {};

controller.Delete = async (req, res) => {};

module.exports = controller;
