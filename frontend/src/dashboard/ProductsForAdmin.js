import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, deleteProduct, clearErrors, updateProduct } from '../actions/productAction';
import { Link } from 'react-router-dom';

const ProductsForAdmin = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [images, setImages] = useState([]);
  const [productPDF, setProductPDF] = useState(null);
  const [oldImages, setOldImages] = useState([]);

  const { products, productsCount, error, loading } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(page, keyword));
  }, [dispatch, page, keyword, error]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    
    // Add the form data as a JSON string
    const data = {
        name,
        description,
        price,
        category,
        author
    };
    formData.append('data', JSON.stringify(data));

    // Add files
    if (images.length > 0) {
        images.forEach(image => {
            formData.append('images', image);
        });
    }

    if (productPDF) {
        formData.append('productPDF', productPDF);
    }

    dispatch(updateProduct(productToUpdate._id, formData));
    setName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setAuthor('');
    setImages([]);
    setProductPDF(null);
};


  const startUpdating = (product) => {
    setIsUpdating(true);
    setProductToUpdate(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setCategory(product.category);
    setAuthor(product.author);
    setOldImages(product.images || []);
    setImages([]);
    setProductPDF(null);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handlePDFChange = (e) => {
    setProductPDF(e.target.files[0]);
  };

  return (
    <div className="products-admin-container">
      <h1>Products Management</h1>

      {isUpdating && productToUpdate ? (
        <div className="update-form-container">
          <h2>Update Product</h2>
          <form onSubmit={handleUpdateSubmit} encType="multipart/form-data">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Author</label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="images">Images</label>
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className="old-images">
                {oldImages.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
                    alt={`Product ${index + 1}`}
                    className="preview-image"
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="productPDF">Product PDF</label>
              <input
                type="file"
                id="productPDF"
                accept=".pdf"
                onChange={handlePDFChange}
              />
              {productToUpdate.productPDF && (
                <p className="current-pdf">
                  Current PDF: {productToUpdate.productPDF.filename}
                </p>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-update">Update Product</button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => setIsUpdating(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="products-list-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="search-input"
            />
          </div>

          <table className="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Author</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(products) &&
                products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>₹{product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.author}</td>
                    <td className="action-buttons">
                      <button 
                        onClick={() => startUpdating(product)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {productsCount > 10 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page === 1}
                className="btn-page"
              >
                Previous
              </button>
              <span className="page-info">Page {page}</span>
              <button 
                onClick={() => handlePageChange(page + 1)} 
                disabled={page * 10 >= productsCount}
                className="btn-page"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsForAdmin;
