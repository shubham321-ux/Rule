import FavoriteBook from "../models/favoriteBooksModel.js";

// Create Favorite Book
export const createFavoriteBook = async (req, res) => {
  try {
    const { productId } = req.body;
    console.log("Product fev  ID:", productId);
    const favorite = await FavoriteBook.create({
      product: productId,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      favorite,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create favorite",
    });
  }
};

// Get User Favorite Books
export const getFavoriteBooks = async (req, res) => {
  try {
    const favorites = await FavoriteBook.find({ user: req.user._id }).populate("product");

    res.status(200).json({
      success: true,
      favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch favorites",
    });
  }
};

// Delete Favorite Book
export const deleteFavoriteBook = async (req, res) => {
    console.log("Delete Favorite Book called with ID:", req.params.id);
    try {
      const favorite = await FavoriteBook.findById(req.params.id);
  
      if (!favorite) {
        console.log("Favorite not found");
        return res.status(404).json({
          success: false,
          message: "Favorite book not found",
        });
      }
  
      if (favorite.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to delete this favorite",
        });
      }
  
      await FavoriteBook.deleteOne({ _id: req.params.id });
  
      res.status(200).json({
        success: true,
        message: "Favorite removed successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete favorite",
      });
    }
  };
  
  
