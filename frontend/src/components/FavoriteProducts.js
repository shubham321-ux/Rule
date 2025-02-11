import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFavorites, removeFromFavorites } from "../actions/favoritebooksAction";
import { FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./css/FavoriteProducts.css";

const FavoriteProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { favorites, loading } = useSelector((state) => state.favorites);
  const [removingItems, setRemovingItems] = useState(new Set());

  useEffect(() => {
    dispatch(getFavorites());
  }, [dispatch]);

  const handleRemoveFavorite = async (productId) => {
    setRemovingItems((prev) => new Set(prev).add(productId));
    setTimeout(async () => {
      await dispatch(removeFromFavorites(productId));
      dispatch(getFavorites());
    }, 300);
  };

  const handleDownloadPdf = (pdfUrl, productName) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.target = "_blank";
    link.download = `${productName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="favorite-products">
      {loading ? (
        <div>Loading...</div>
      ) : !favorites || favorites.length === 0 ? (
        <div>No favorite products found</div>
      ) : (
        <div className="favorites-list">
          {favorites.map((favorite, index) => {
            const productImages = favorite.product?.images || [];
            const imageUrl = productImages[0]?.url || '/default-image.jpg';

            return (
              <div
                style={index === 0 ? { borderTop: "1px solid #E2E2E2" } : {}}
                key={favorite._id}
                className={`favorite-item ${
                  removingItems.has(favorite._id) ? "removing" : ""
                }`}
                onClick={() => handleProductClick(favorite.product?._id)}
              >
                <div className="product-image-fev">
                  <img
                    src={imageUrl}
                    alt={favorite.product?.name || 'Product Image'}
                  />
                </div>

                <div className="product-info-fev">
                  <div className="info-container">
                    <div className="product-name-fev-div">
                      <h3 className="product-name-fev main-heading">
                        {favorite.product?.name || 'Untitled Product'}
                      </h3>
                      <p className="created-date-fev">
                        Added on: {new Date(favorite.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="author-name-fev">
                      Author: {favorite.product?.author || 'Unknown'}
                    </span>
                    <span className="product-price-fev">
                      ₹{favorite.product?.price || 0}
                    </span>
                  </div>
                </div>

                <div className="action-buttons">
                  {favorite.product?.paymentPaid && favorite.product?.productPDF?.url && (
                    <button
                      className="download-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadPdf(
                          favorite.product.productPDF.url,
                          favorite.product.name
                        );
                      }}
                    >
                      <FaDownload /> Download PDF
                    </button>
                  )}
                  <button
                    className="remove-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite(favorite._id);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoriteProducts;