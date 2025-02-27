import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_CATEGORY_RESET } from "../constants/categoryConstant";
import { createCategory, deleteCategory, updateCategory, getCategories } from "../actions/categoryAction";
import "./css/Createproduct.css";

const CreateCategoryForm = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const { loading, error, categories } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (selectedCategoryId) {
      await dispatch(updateCategory(selectedCategoryId, name, description));
    } else {
      await dispatch(createCategory(name, description));
    }
    setName("");
    setDescription("");
    setSelectedCategoryId(null);
  };

  const handleEdit = (categoryId, categoryName, categoryDescription) => {
    setSelectedCategoryId(categoryId);
    setName(categoryName);
    setDescription(categoryDescription);
  };

  const handleDelete = (categoryId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (confirmDelete) {
      dispatch(deleteCategory(categoryId));
    }
  };

  return (
    <div className="products-list-container">
    <div className="create-product-wrapper">
      <div className="create-product-main-container">
        <h2 className="create-product-heading">
          {selectedCategoryId ? "Update Category" : "Create Category"}
        </h2>
  
        <form onSubmit={submitHandler} className="create-product-form">
          <div className="create-product-form-group">
            <label className="create-product-label">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter category name"
              className="create-product-input"
            />
          </div>
  
          <div className="create-product-form-group">
            <label className="create-product-label">Category Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Enter category description"
              className="create-product-textarea"
            ></textarea>
          </div>
  
          <button type="submit" className="create-product-submit">
            {selectedCategoryId ? "Update Category" : "Create Category"}
          </button>
        </form>
  
        <div className="existing-categories-section">
          <h2 className="create-product-heading">Existing Categories</h2>
          {categories && categories.length > 0 ? (
            <div className="categories-grid">
              {categories.map((category) => (
                <div key={category._id} className="category-card">
                  <div className="category-content">
                    <h3 className="category-title">{category.name}</h3>
                    <p className="category-description">{category.description}</p>
                  </div>
                  <button
                      onClick={() => handleDelete(category._id)}
                      className="delete-category-btn"
                    >
                      Delete
                    </button>
                  <div className="category-actions">
               
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-categories">No categories available</p>
          )}
        </div>
      </div>
    </div>
    </div> );
};

export default CreateCategoryForm;
