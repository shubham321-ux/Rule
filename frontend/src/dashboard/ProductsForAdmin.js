import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, deleteProduct, clearErrors, updateProduct } from '../actions/productAction';
import Loading from '../components/Loading';
import './css/ProductsForAdmin.css';

const ProductsForAdmin = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    author: '',
    images: [],
    productPDF: null
  });

  const { products, productsCount, error, loading } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(page));
  }, [dispatch, page, error]);

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
    const formDataToSend = new FormData();
    
    const data = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      author: formData.author
    };
    formDataToSend.append('data', JSON.stringify(data));

    if (formData.images.length > 0) {
      formData.images.forEach(image => {
        formDataToSend.append('images', image);
      });
    }

    if (formData.productPDF) {
      formDataToSend.append('productPDF', formData.productPDF);
    }

    dispatch(updateProduct(productToUpdate._id, formDataToSend));
    setIsUpdating(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      author: '',
      images: [],
      productPDF: null
    });
  };

  const startUpdating = (product) => {
    setIsUpdating(true);
    setProductToUpdate(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      author: product.author,
      images: [],
      productPDF: null
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      if (name === 'images') {
        setFormData(prev => ({
          ...prev,
          images: Array.from(files)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: files[0]
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (loading) return <Loading />;

  return (
    
 <>
      {isUpdating ? (
          <div className="products-list-container">
  <div className="create-product-wrapper">
    <div className="create-product-main-container">
      <div className="create-product-heading">
        <button
          className="create-product-back-btn"
          onClick={() => setIsUpdating(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2>Update Product</h2>
      </div>

      <form onSubmit={handleUpdateSubmit} className="create-product-form" encType="multipart/form-data">
        {Object.keys(formData).map(key => {
          if (key === 'images' || key === 'productPDF') {
            return (
              <div className="create-product-form-group" key={key}>
                <label className="create-product-label">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input
                  type="file"
                  id={key}
                  name={key}
                  multiple={key === 'images'}
                  accept={key === 'images' ? "image/*" : ".pdf"}
                  onChange={handleInputChange}
                  className="create-product-file-input"
                />
              </div>
            );
          }
          return (
            <div className="create-product-form-group" key={key}>
              <label className="create-product-label">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                type={key === 'price' ? 'number' : 'text'}
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleInputChange}
                required
                className="create-product-input"
              />
            </div>
          );
        })}
        <button type="submit" className="create-product-submit">Update Product</button>
      </form>
    </div>
  </div>
  </div>
)  : (
        <div className="products-list-container">
           <h2 className="create-product-heading">Products Management</h2>
          <table className="products-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Author</th>
                <th>Purchases</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(products) &&
                [...products].reverse().map((product) => (
                  <tr key={product._id}>
                    <td>#{product._id}</td>
                    <td>{product.name}</td>
                    <td>₹{product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.author}</td>
                    <td>{product.purchases ? product.purchases.length : 0}</td>
                    <td className="action-buttons">
                      <div className="btn-group">
                        <button onClick={() => startUpdating(product)} className="btn-edit">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 13.3335H14" stroke="#C8CAD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M11 2.33316C11.2652 2.06794 11.6249 1.91895 12 1.91895C12.1857 1.91895 12.3696 1.95553 12.5412 2.0266C12.7128 2.09767 12.8687 2.20184 13 2.33316C13.1313 2.46448 13.2355 2.62038 13.3066 2.79196C13.3776 2.96354 13.4142 3.14744 13.4142 3.33316C13.4142 3.51888 13.3776 3.70277 13.3066 3.87435C13.2355 4.04593 13.1313 4.20184 13 4.33316L4.66667 12.6665L2 13.3332L2.66667 10.6665L11 2.33316Z" stroke="#C8CAD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="btn-delete">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 4H3.33333H14" stroke="#C8CAD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5.3335 4.00004V2.66671C5.3335 2.31309 5.47397 1.97395 5.72402 1.7239C5.97407 1.47385 6.31321 1.33337 6.66683 1.33337H9.3335C9.68712 1.33337 10.0263 1.47385 10.2763 1.7239C10.5264 1.97395 10.6668 2.31309 10.6668 2.66671V4.00004M12.6668 4.00004V13.3334C12.6668 13.687 12.5264 14.0261 12.2763 14.2762C12.0263 14.5262 11.6871 14.6667 11.3335 14.6667H4.66683C4.31321 14.6667 3.97407 14.5262 3.72402 14.2762C3.47397 14.0261 3.3335 13.687 3.3335 13.3334V4.00004H12.6668Z" stroke="#C8CAD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6.6665 7.33337V11.3334" stroke="#C8CAD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9.3335 7.33337V11.3334" stroke="#C8CAD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
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
</>
  );
};

export default ProductsForAdmin;
