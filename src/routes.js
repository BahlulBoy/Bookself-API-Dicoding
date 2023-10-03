const {
  savebook, showAllBooks, showDetailBook, editBook, deleteBook,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: savebook,
  },
  {
    method: 'GET',
    path: '/books',
    handler: showAllBooks,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: showDetailBook,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBook,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBook,
  },
];

module.exports = routes;
