import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../actions/productAction";
import { getCategories } from "../actions/categoryAction";
import Header from "../components/Header";
import Loading from "../components/Loading";
import "./css/Createproduct.css";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    author: "",
  });

  const [images, setImages] = useState([]);
  const [productPDF, setProductPDF] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setPreviewImages([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPreviewImages((old) => [...old, reader.result]);
          setImages((old) => [...old, file]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setPreviewImages(previewImages.filter((_, i) => i !== index));
    setImages(images.filter((_, i) => i !== index));
  };

  const handlePdfChange = (e) => {
    setProductPDF(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = new FormData();

    Object.keys(formData).forEach((key) => {
      productData.append(key, formData[key]);
    });

    images.forEach((image) => {
      productData.append("images", image);
    });

    if (productPDF) {
      productData.append("productPDF", productPDF);
    }

    try {
      await dispatch(createProduct(productData));

      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        author: "",
      });
      setImages([]);
      setPreviewImages([]);
      setProductPDF(null);

      document.getElementById("imageInput").value = "";
      document.getElementById("pdfInput").value = "";
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="products-list-container">
        <div className="create-product-wrapper">
          <div className="create-product-main-container">
            <h2 className="create-product-heading">Create New Product</h2>
            {error && <p className="create-product-error">Error: {error}</p>}
            
            <form onSubmit={handleSubmit} className="create-product-form" encType="multipart/form-data">
              <div className="create-product-form-group">
                <label className="create-product-label">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter product name"
                  className="create-product-input"
                />
              </div>

              <div className="create-product-form-group">
                <label className="create-product-label">Author:</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter author name"
                  className="create-product-input"
                />
              </div>

              <div className="create-product-form-group">
                <label className="create-product-label">Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter product description"
                  className="create-product-textarea"
                />
              </div>

              <div className="create-product-form-group">
                <label className="create-product-label">Price:</label>
                <div className="create-product-price-container">
                  <span className="create-product-currency">₹</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter price"
                    className="create-product-input"
                  />
                </div>
              </div>

              <div className="create-product-form-group">
                <label className="create-product-label">Category:</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="create-product-select"
                >
                  <option value="">Select Category</option>
                  {categories?.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="create-product-form-group">
                <label className="create-product-label">Images:</label>
                <input
                  id="imageInput"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="create-product-file-input"
                />
                <div className="create-product-preview-container">
                  {previewImages.map((image, index) => (
                    <div key={index} className="create-product-image-wrapper">
                      <img
                        src={image}
                        alt={`preview-${index}`}
                        className="create-product-preview-image"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="create-product-remove-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="create-product-form-group">
                <label className="create-product-label">Product Manual (PDF):</label>
                <input
                  id="pdfInput"
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfChange}
                  required
                  className="create-product-file-input"
                />
              </div>

              <button type="submit" className="create-product-submit">
                Create Product
              </button>
            </form>
          </div>
        </div>
      </div>)}
    </>
  );
};

export default CreateProduct;
