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

//get all products
export const getProduct = (page = 1, keyword = "", category = "", minPrice = "", maxPrice = "", selectedCategories = []) => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCT_REQUEST });

        const config = {
            withCredentials: true,
        };

        // Build query string with all filters
        let queryString = `${API_URL}api/v1/products?page=${page}`;
        
        if (keyword) {
            queryString += `&keyword=${keyword}`;
        }
        
        if (category) {
            queryString += `&category=${category}`;
        }
        
        if (minPrice !== "") {
            queryString += `&minPrice=${minPrice}`;
        }
        
        if (maxPrice !== "") {
            queryString += `&maxPrice=${maxPrice}`;
        }
        
        if (selectedCategories.length > 0) {
            queryString += `&categories=${selectedCategories.join(',')}`;
        }

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
        const errorMessage = error.response ? error.response.data.message : error.message;
        dispatch({ type: ALL_PRODUCT_FAIL, payload: errorMessage });
    }
};






//get product details
export const getProductDetails = (id, filters) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });

        // Config that matches your backend cookie-based auth
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true // This ensures cookies are sent with the request
        };

        let url = `${API_URL}api/v1/product/detail/${id}`;
        const queryParams = [];

        if (filters) {
            if (filters.priceRange) {
                queryParams.push(`priceRange=${encodeURIComponent(filters.priceRange)}`);
            }
            if (filters.minPrice) {
                queryParams.push(`minPrice=${encodeURIComponent(filters.minPrice)}`);
            }
            if (filters.maxPrice) {
                queryParams.push(`maxPrice=${encodeURIComponent(filters.maxPrice)}`);
            }
        }

        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
        }

        const { data } = await axios.get(url, config);

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product,
        });
    } catch (error) {
        if (error.response?.status === 401) {
            dispatch({
                type: PRODUCT_DETAILS_FAIL,
                payload: "Please login first",
            });
        } else {
            dispatch({
                type: PRODUCT_DETAILS_FAIL,
                payload: error.response?.data?.message || "Error fetching product details",
            });
        }
    }
};






//create product
export const createProduct = (productData) => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCT_REQUEST });
        dispatch({ type: CREATE_PRODUCT_REQUEST });
        const config = {
           
            withCredentials: true,  // Ensure cookies (like JWT) are sent with the request
        };

        const { data } = await axios.post(`${API_URL}api/v1/product/new`, productData,config);
        dispatch({ type: ALL_PRODUCT_SUCCESS, payload: data || [], productsCount: data.productsCount || 0 });
        dispatch({ type: CREATE_PRODUCT_SUCCESS, payload: data });
        
    } catch (error) {
        dispatch({ type: ALL_PRODUCT_FAIL, payload: error.response.data.message });
        dispatch({ type: CREATE_PRODUCT_FAIL, payload: error.response.data.message });
    }
};

// Update product
export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PRODUCT_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true, // Ensure cookies are sent along with the request
        };

        const { data } = await axios.put(`${API_URL}api/v1/product/update/${id}`, productData, config);

        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message;
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: errorMessage,
        });
    }
};

// Delete product
export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_PRODUCT_REQUEST });

        const config = {
            withCredentials: true, // Ensure cookies are sent along with the request
        };

        await axios.delete(`${API_URL}api/v1/product/delete/${id}`, config);

        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: id,
        });
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message;
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: errorMessage,
        });
    }
};



// Action for creating a product review
export const createProductReviewAction = (reviewData) => async (dispatch, getState) => {
    try {
        dispatch({ type: CREATE_REVIEW_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",  // Correct Content-Type for JSON data
            },
            withCredentials: true,  // Send cookies with the request
        };

        // Send the review data via PUT request to the backend
        const { data } = await axios.put(`${API_URL}api/v1/product/review`, reviewData, config);

        dispatch({
            type: CREATE_REVIEW_SUCCESS,
            payload: data,  // Payload: response data (the added review)
        });

        dispatch({ type: CLEAR_ERRORS });
        
    } catch (error) {
        dispatch({
            type: CREATE_REVIEW_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

//clear errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS })
}