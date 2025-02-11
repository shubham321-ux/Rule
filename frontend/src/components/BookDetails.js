import React from 'react';
import './css/BookDetails.css';
import bookong from "../assest/bookpng.png"
const BookDetails = () => {
  const books = [
    {
      id: 1,
      image: bookong,
      title: 'The Art of Programming',
      author: 'John Smith',
      description: 'A comprehensive guide to modern programming practices and principles, covering essential topics for both beginners and advanced developers.'
    },
    {
      id: 2,
      image: bookong,
      title: 'Data Structures Explained',
      author: 'Sarah Johnson',
      description: 'Deep dive into the world of data structures with practical examples and real-world applications.'
    },
    {
      id: 3,
      image: bookong,
      title: 'Web Development Mastery',
      author: 'Mike Wilson',
      description: 'Master the latest web technologies and frameworks with hands-on projects and expert guidance.'
    }
  ];

  return (
    <div className="book-details-container">
      {books.map((book) => (
        <div key={book.id} className="book-detail-card">
          <div className="book-header">
            <div className="book-image-icon">
              <img src={book.image} alt={book.title} />
            </div>
            <div className="book-info">
            <p className="book-author">{book.author}</p>
              <h3 className="book-title">{book.title}</h3>
             
            </div>
          </div>
          <div className="book-description normal-para">
            <p>{book.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookDetails;
