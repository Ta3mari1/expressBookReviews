const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const userName = req.query.username;
  const Password = req.query.password;
  let newUser = { username: userName, password: Password };
  const register = users.find((user) => user.username === userName)
  if (register) {
    res.status(404).json({ message: "please login already signed up" });
  } else {
    users.push(newUser);
    res.send("registred succesfuly")
  }
});

// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//   const booksList = JSON.stringify(books, null, 2);
//   res.send(booksList);
// });



public_users.get("/", async (req, res) => {

  const bookList = JSON.stringify(books, null, 2);
  try {
    res.send(bookList);
  } catch {
    res.status(404).json({ message: "something went wrong " });
  }

})

// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//   const findIsbn = req.params.isbn;
//   const isbn = books[findIsbn];

//   if (isbn) {
//     res.json(isbn);
//   } else {
//     res.status(404).json({ message: "Book not found" });
//   }


// });

public_users.get('/isbn/:isbn', async (req, res) => {

  try {
    const findIsbn = req.params.isbn;
    const isbn = books[findIsbn];

    if (isbn) {
      res.json(isbn);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//   const findAuthor = req.params.author;
//   const author = books[findAuthor];
//   if (author) {
//     res.json(author)
//   } else {
//     res.status(404).json({ message: "auhtor not found" })
//   }

// });

public_users.get('/author/author', async (req, res) => {

  try {
    const findAuthor = req.params.author;
    const author = books[findAuthor];
    if (author) {
      res.json(author)
    } else {
      res.status(404).json({ message: "auhtor not found" })
    }
  } catch {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})


// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//   const findTitle = req.params.title;
//   const title = books[findTitle];
//   if (title) {
//     res.json(title);
//   }
//   else {
//     res.status(404).json({ message: "title not found" })
//   }
// });


public_users.get('/title/:title', async (req, res) => {

  try {
    const findTitle = req.params.title;
    const title = books[findTitle];
    if (title) {
      res.json(title);
    }
    else {
      res.status(404).json({ message: "title not found" })
    }
  } catch {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})








//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const findIsbn = req.params.isbn;
  const isbn = books[findIsbn];

  if (isbn) {
    res.json({ reviews: books.isbn });
  } else {
    res.status(404).json({ message: "Book not found" });
  }



});

module.exports.general = public_users;
