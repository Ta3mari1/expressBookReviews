const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
users.push({ username: "testUser", password: "testPassword" });

// Check if username is valid
const isValid = (username) => {
  return username && username.trim().length > 0;
};

// Check if the user is authenticated
const authenticatedUser = (username, password) => {
  const user = users.find((user) => user.username === username && user.password === password);
  return !!user;
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    // Generate JWT Token
    const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });

    // Set the token in the session
    req.session.token = token;

    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params; // ISBN from the URL
  const { review } = req.query; // Review from the query
  const username = req.session.username; // Username from the session
  if (!username) {
    return res.status(401).json({ message: "Unauthorized. Please log in to post a review." });
  }

  if (!isbn || !review) {
    return res.status(400).json({ message: "ISBN and review are required." });
  }

  const book = books.find((b) => b.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }
  if (!book.reviews) {
    book.reviews = {}; // Initialize the reviews object if it doesn't exist
  }
  if (book.reviews[username]) {
    book.reviews[username] = review; // Update the existing review
    return res.status(200).json({ message: "Review updated successfully.", book });
  } else {
    book.reviews[username] = review; // Add a new review
    return res.status(201).json({ message: "Review added successfully.", book });
  }
}
);


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params; // Extract ISBN from the route parameters
  const username = req.session.username; // Extract the logged-in username from the session

  // Validate if the user is logged in
  if (!username) {
    return res.status(401).json({ message: "Unauthorized. Please log in to delete your review." });
  }

  // Find the book by ISBN
  const book = books.find((b) => b.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Check if the book has reviews
  if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: "You have not reviewed this book." });
  }

  // Delete the user's review
  delete book.reviews[username];

  return res.status(200).json({ message: "Review deleted successfully.", book });











});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
