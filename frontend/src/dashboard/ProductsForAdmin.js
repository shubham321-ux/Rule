import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, deleteProduct, clearErrors, updateProduct } from '../actions/productAction';
import { Link } from 'react-router-dom';
import { CLEAR_ERRORS } from '../constants/productConstant';

const ProductsForAdmin = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [images, setImages] = useState([]);
  const [productPDF, setProductPDF] = useState(null);

  const { products, productsCount, error } = useSelector((state) => state.products);

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
    formData.set('name', name);
    formData.set('description', description);
    formData.set('price', price);
    formData.set('stock', stock);

    const uploadedImages = images.map((image) => {
      const imageData = {
        url: image.url,
        public_id: image.public_id,
      };
      return imageData;
    });

    uploadedImages.forEach((image) => {
      formData.append('images', JSON.stringify(image));
    });

    if (productPDF) {
      formData.append('productPDF', productPDF);
    }

    dispatch(updateProduct(productToUpdate._id, formData));
    setIsUpdating(false);
  };

  const startUpdating = (product) => {
    setIsUpdating(true);
    setProductToUpdate(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setStock(product.stock);
    setImages(product.images || []);
    setProductPDF(product.productPDF || null);
  };

  return (
    <div>
      <h1>Products List for Admin</h1>

      {isUpdating && productToUpdate && (
        <div>
          <h2>Update Product</h2>
          <form onSubmit={handleUpdateSubmit}>
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="images">Images</label>
              <input
                type="file"
                id="images"
                multiple
                onChange={(e) => setImages(Array.from(e.target.files))}
              />
            </div>

            <div>
              <label htmlFor="productPDF">Product PDF</label>
              <input
                type="file"
                id="productPDF"
                onChange={(e) => setProductPDF(e.target.files[0])}
              />
            </div>

            <button type="submit">Update Product</button>
          </form>
        </div>
      )}

      {!isUpdating && (
        <div>
          <div>
            <input
              type="text"
              placeholder="Search by product name"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button onClick={() => setPage(1)}>Search</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(products) &&
                products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button onClick={() => startUpdating(product)}>Update</button>
                      <button onClick={() => handleDelete(product._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div>
            {productsCount > 10 && (
              <div>
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                  Prev
                </button>
                <span>{`Page ${page}`}</span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page * 10 >= productsCount}>
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsForAdmin;
