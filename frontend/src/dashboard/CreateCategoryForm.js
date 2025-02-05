import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_CATEGORY_RESET } from "../constants/categoryConstant";
import { createCategory, deleteCategory, updateCategory, getCategories } from "../actions/categoryAction";

const CreateCategoryForm = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const { loading, error, categories } = useSelector((state) => state.category); // Access the correct state

  useEffect(() => {
    dispatch(getCategories()); // Fetch all categories when component mounts
  }, [dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (selectedCategoryId) {
      await dispatch(updateCategory(selectedCategoryId, name, description)); // Update the selected category
    } else {
      await dispatch(createCategory(name, description)); // Create a new category
    }
    setName("");
    setDescription("");
    setSelectedCategoryId(null); // Reset selected category after submit
  };

  const handleEdit = (categoryId, categoryName, categoryDescription) => {
    setSelectedCategoryId(categoryId);
    setName(categoryName);
    setDescription(categoryDescription);
  };

  const handleDelete = (categoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
  if (confirmDelete) {
      dispatch(deleteCategory(categoryId));
    }
  };

  return (
    <div>
      <h1>{selectedCategoryId ? "Update Category" : "Create Category"}</h1>

      {loading && <p>Loading...</p>}
      {/* {error && <p style={{ color: "red" }}>{error}</p>} */}

      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="name">Category Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Category Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit">{selectedCategoryId ? "Update Category" : "Create Category"}</button>
      </form>

      <h2>Existing Categories</h2>
      {categories && categories.length > 0 ? (
        <ul>
          {categories.map((category) => (
            <li key={category._id}>
              <p>{category.name} - {category.description}</p>
              <button onClick={() => handleEdit(category._id, category.name, category.description)}>Edit</button>
              <button onClick={() => handleDelete(category._id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No categories available</p>
      )}
    </div>
  );
};

export default CreateCategoryForm;
