import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    CLEAR_CART,
  } from "../constants/cartConstant.js";
  import axios from "axios";
  import { API_URL } from "../config/config.js";
  
  // Get Cart Items
  export const getCartItems = () => (dispatch, getState) => {
    const { user } = getState().user;
    if (user) {
      // Use localStorage with unique key based on user ID
      const userCart = localStorage.getItem(`cart_${user._id}`);
      return userCart ? JSON.parse(userCart) : [];
    }
    return [];
  };
  
  // Add to Cart
  export const addToCart = (id) => async (dispatch, getState) => {
    const { data } = await axios.get(`${API_URL}api/v1/product/detail/${id}`);
    const { user } = getState().user;
  
    const product = {
      product: data.product._id,
      name: data.product.name,
      price: data.product.price,
      image: data.product.images[0]?.url,
      stock: data.product.stock,
      quantity: 1, // Initially adding one unit
    };
  
    dispatch({
      type: ADD_TO_CART,
      payload: product,
    });
  
    // Prepare config for any future POST, PUT, or other requests
    const config = {
      headers: {
        "Content-Type": "application/json",  // Content-Type for JSON data
      },
      withCredentials: true,  // Send cookies with the request (important for user session)
    };
  
    // Store updated cart items in localStorage based on user ID
    if (user) {
      const cartItems = getState().cart.cartItems;
      // Example of using axios to save the cart to the backend (if necessary)
      // await axios.post(`${API_URL}/api/v1/cart`, { cartItems }, config);
  
      localStorage.setItem(`cart_${user._id}`, JSON.stringify(cartItems));
    }
  };
  
  // Remove from Cart
  export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
      type: REMOVE_FROM_CART,
      payload: id, // Remove item with this ID
    });
  
    const { user } = getState().user;
  
    if (user) {
      const cartItems = getState().cart.cartItems;
      localStorage.setItem(`cart_${user._id}`, JSON.stringify(cartItems));
    }
  };
  
  // Clear Cart
  export const clearCart = () => (dispatch, getState) => {
    dispatch({ type: CLEAR_CART });
  
    const { user } = getState().user;
  
    // Clear localStorage only for the user cart
    if (user) {
      localStorage.removeItem(`cart_${user._id}`);
    }
  };
  