import Category from "../models/categoryModel.js";

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    console.log(req.body);

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
      res.status(400).json({ message: "Category already exists" });
      return;
    }

    const category = await Category.create({ name, description });

    if (category) {
      res.status(201).json({
        message: "Category created successfully",
        category,
      });
    } else {
      res.status(400).json({ message: "Invalid category data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    category.name = name || category.name;
    category.description = description || category.description;

    const updatedCategory = await category.save();

    res.json({
      message: "Category updated successfully",
      updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
  
      const category = await Category.findById(id);
  
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      // Delete the category
      await Category.deleteOne({ _id: id });
  
      return res.json({
        message: "Category deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

export { createCategory, getCategories, updateCategory, deleteCategory };
