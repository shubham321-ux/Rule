import axios from 'axios';
import { API_URL } from '../config/config.js';
import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_REQUEST,
    CREATE_PRODUCT_REQUEST,
    CREATE_PRODUCT_SUCCESS,
    CREATE_PRODUCT_FAIL,
    CREATE_PRODUCT_RESET,
    CREATE_REVIEW_REQUEST,
    CREATE_REVIEW_SUCCESS,
    CREATE_REVIEW_FAIL,
    UPDATE_PRODUCT_FAIL,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_REQUEST,
    DELETE_PRODUCT_FAIL,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_REQUEST,
    CLEAR_ERRORS
} from '../constants/productConstant.js'
import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_CART_QUANTITY,
    CLEAR_CART
} from '../constants/cartConstants';

// Get all products
export const getProduct = (page = 1, keyword = "", category = "", minPrice = "", maxPrice = "", selectedCategories = []) => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCT_REQUEST });
        const token = localStorage.getItem('token');

        const config = {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        let queryString = `${API_URL}api/v1/products?page=${page}`;
        if (keyword) queryString += `&keyword=${keyword}`;
        if (category) queryString += `&category=${category}`;
        if (minPrice !== "") queryString += `&minPrice=${minPrice}`;
        if (maxPrice !== "") queryString += `&maxPrice=${maxPrice}`;
        if (selectedCategories.length > 0) queryString += `&categories=${selectedCategories.join(',')}`;

        const { data } = await axios.get(queryString, config);

        dispatch({
            type: ALL_PRODUCT_SUCCESS,
            payload: data.products || [],
            productsCount: data.totalProducts || 0,
            totalpages: data.totalPages || 0,
            resultPerPage: data.resultPerPage || 0,
            currentPage: data.currentPage || 0,
        });
    } catch (error) {
        dispatch({ type: ALL_PRODUCT_FAIL, payload: error.response?.data?.message || error.message });
    }
};

// Get product details
export const getProductDetails = (id, filters) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        };

        let url = `${API_URL}api/v1/product/detail/${id}`;
        const queryParams = [];

        if (filters) {
            if (filters.priceRange) queryParams.push(`priceRange=${encodeURIComponent(filters.priceRange)}`);
            if (filters.minPrice) queryParams.push(`minPrice=${encodeURIComponent(filters.minPrice)}`);
            if (filters.maxPrice) queryParams.push(`maxPrice=${encodeURIComponent(filters.maxPrice)}`);
        }

        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
        }

        const { data } = await axios.get(url, config);
        dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data.product });
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response?.status === 401 ? "Please login first" : error.response?.data?.message || "Error fetching product details"
        });
    }
};

// Create product
export const createProduct = (productData) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_PRODUCT_REQUEST });
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        };

        const { data } = await axios.post(`${API_URL}api/v1/product/new`, productData, config);
        dispatch({ type: CREATE_PRODUCT_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: CREATE_PRODUCT_FAIL, payload: error.response?.data?.message });
    }
};

// Update product
export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PRODUCT_REQUEST });
        
        // Clear localStorage before update if needed
        localStorage.removeItem('persist:root');
        
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        };

        const { data } = await axios.put(
            `${API_URL}api/v1/product/update/${id}`, 
            productData, 
            config
        );

        dispatch({ 
            type: UPDATE_PRODUCT_SUCCESS, 
            payload: data.product 
        });

        return data;
    } catch (error) {
        dispatch({ 
            type: UPDATE_PRODUCT_FAIL, 
            payload: error.response?.data?.message || error.message 
        });
        throw error;
    }
};



// Delete product
export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_PRODUCT_REQUEST });
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        };

        await axios.delete(`${API_URL}api/v1/product/delete/${id}`, config);
        dispatch({ type: DELETE_PRODUCT_SUCCESS, payload: id });
    } catch (error) {
        dispatch({ type: DELETE_PRODUCT_FAIL, payload: error.response?.data?.message || error.message });
    }
};

// Create product review
export const createProductReviewAction = (reviewData) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_REVIEW_REQUEST });
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        };

        const { data } = await axios.put(`${API_URL}api/v1/product/review`, reviewData, config);
        dispatch({ type: CREATE_REVIEW_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: CREATE_REVIEW_FAIL, payload: error.response?.data?.message || error.message });
    }
};


//clear errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS })
}

export const addItemToCart = (product, quantity = 1) => (dispatch, getState) => {
    const cartItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0].url,
        stock: product.stock,
        quantity
    };

    dispatch({
        type: ADD_TO_CART,
        payload: cartItem
    });
};



// Remove item from cart
export const removeItemFromCart = (productId) => async (dispatch, getState) => {
    dispatch({
        type: REMOVE_FROM_CART,
        payload: productId
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// Update cart item quantity
export const updateCartQuantity = (productId, quantity) => async (dispatch, getState) => {
    dispatch({
        type: UPDATE_CART_QUANTITY,
        payload: { productId, quantity }
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// Clear cart
export const clearCart = () => async (dispatch) => {
    dispatch({ type: CLEAR_CART });
    localStorage.removeItem('cartItems');
};