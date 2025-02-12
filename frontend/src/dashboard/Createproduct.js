import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../actions/productAction";
import { getCategories } from "../actions/categoryAction";
import Header from "../components/Header";

const CreateProduct = () => {
  const dispatch = useDispatch();

  // Get categories from Redux store
  const { categories, loading, error } = useSelector((state) => state.category);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    author: "", // Fixed: Added the 'author' field to formData state
  });

  const [images, setImages] = useState([]);
  const [productPDF, setProductPDF] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);

  // Dispatch the getCategories action on mount to fetch categories
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Handle changes in form fields
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image selection and preview
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

  // Handle product manual PDF upload
  const handlePdfChange = (e) => {
    setProductPDF(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = new FormData();

    // Add form fields to FormData
    Object.keys(formData).forEach((key) => {
      productData.append(key, formData[key]);
    });

    // Add images to FormData
    images.forEach((image) => {
      productData.append("images", image);
    });

    // Add PDF to FormData if provided
    if (productPDF) {
      productData.append("productPDF", productPDF);
    }

    try {
      console.log("Product Data:", productData);
      // Dispatch createProduct action
      await dispatch(createProduct(productData));

      // Reset form and inputs after successful submission
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        author: "", // Fixed: Added author reset in the form reset
      });
      setImages([]);
      setPreviewImages([]);
      setProductPDF(null);

      // Reset file inputs
      document.getElementById("imageInput").value = "";
      document.getElementById("pdfInput").value = "";
      window.location.reload();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="create-product-container">
      <Header />
      <h2>Create New Product</h2>
      {loading && <p>Loading Categories...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <form
        onSubmit={handleSubmit}
        className="product-form"
        encType="multipart/form-data"
      >
        {/* Product Name */}
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Author of Book */}
        <div className="form-group">
          <label>Author of Book:</label>
          <input
            type="text"
            name="author" // Fixed: Corrected to 'author'
            value={formData.author}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Product Description */}
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Product Price */}
        <div className="form-group">
          <label>Price:</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "5px" }}>₹</span>{" "}
            {/* Display the rupee symbol */}
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              style={{ width: "100%" }}
            />
          </div>
        </div>
        {/* Product Category (Dropdown) */}
        <div className="form-group">
          <label>Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            {categories &&
              categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        {/* Product Images */}
        <div className="form-group">
          <label>Images:</label>
          <input
            id="imageInput"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="image-preview">
            {previewImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`preview-${index}`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  margin: "5px",
                }}
              />
            ))}
          </div>
        </div>

        {/* Product Manual (PDF) */}
        <div className="form-group">
          <label>Product Manual (PDF):</label>
          <input
            id="pdfInput"
            type="file"
            accept=".pdf"
            onChange={handlePdfChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
