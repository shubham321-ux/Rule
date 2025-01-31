import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    CLEAR_CART,
  } from "../constants/cartConstanat.js";
  import axios from "axios";
  import { API_URL } from "../config/config.js";
  // Cart Actions
export const getCartItems = () => (dispatch, getState) => {
    const { user } = getState().user;
    if (user) {
      const userCart = localStorage.getItem(`cart_${user._id}`);
      return userCart ? JSON.parse(userCart) : [];
    }
    return [];
  };
  
  export const addToCart = (id) => async (dispatch, getState) => {
    const { data } = await axios.get(`${API_URL}api/v1/product/detail/${id}`);
    const { user } = getState().user;
  
    dispatch({
      type: ADD_TO_CART,
      payload: {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0]?.url,
        stock: data.product.stock,
        quantity: 1,
      },
    });
  
    // Store cart items with user ID
    if (user) {
      localStorage.setItem(
        `cart_${user._id}`, 
        JSON.stringify(getState().cart.cartItems)
      );
    }
  };
  
  // Add this new action for logout
  export const clearCart = () => (dispatch) => {
    dispatch({ type: CLEAR_CART });
    localStorage.removeItem('cartItems');
  };
  