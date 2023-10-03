const { nanoid } = require('nanoid');
const books = require('./books');

const savebook = (req, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id);
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku. Mohon isi nama buku',
  });
  response.code(404);
  return response;
};

const showAllBooks = (req, h) => {
  const { reading, finished, name } = req.query;
  let listFilterBook = books;
  if (reading !== undefined) {
    if (reading === '0') {
      listFilterBook = books.filter((book) => book.reading === false);
    } else {
      listFilterBook = books.filter((book) => book.reading === true);
    }
  }
  if (finished !== undefined) {
    if (finished === '0') {
      listFilterBook = books.filter((book) => book.finished === false);
    } else {
      listFilterBook = books.filter((book) => book.finished === true);
    }
  }
  if (name !== undefined) {
    listFilterBook = books.filter((book) => book.name.toLowerCase().includes(name));
  }
  const listBooks = listFilterBook.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));
  const response = h.response({
    status: 'success',
    data: {
      books: listBooks,
    },
  });
  response.code(200);
  return response;
};

const showDetailBook = (req, h) => {
  const { bookId } = req.params;
  const index = books.findIndex((b) => b.id === bookId);
  if (index !== -1) {
    const response = h.response({
      status: 'success',
      data: {
        book: books[index],
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBook = (req, h) => {
  const { bookId } = req.params;
  const {
    name, year, author, summary, publisher, readPage, pageCount, reading,
  } = req.payload;
  const index = books.findIndex((book) => book.id === bookId);
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  if (index !== -1) {
    const finished = books[index].readPage === books[index].pageCount;
    const updatedAt = new Date().toISOString();
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      readPage,
      pageCount,
      reading,
      updatedAt,
      finished,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBook = (req, h) => {
  const { bookId } = req.params;
  const index = books.findIndex((b) => b.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  savebook, showAllBooks, showDetailBook, editBook, deleteBook,
};
