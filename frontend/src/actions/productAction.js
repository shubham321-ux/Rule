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
    CLEAR_ERRORS
} from '../constants/productConstant.js'

//get all products
export const getProduct = (page = 1, keyword = "") => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCT_REQUEST });

        // Configuration to send cookies along with the request for authentication
        const config = {
            withCredentials: true,  // Ensure cookies (authentication token) are sent along with the request
        };

        // Making the request to fetch products, passing the page and keyword parameters
        const { data } = await axios.get(
            `${API_URL}api/v1/products?page=${page}&keyword=${keyword}`,
            config // Add the config with credentials here
        );

        // Dispatch success action with the fetched data and products count
        dispatch({
            type: ALL_PRODUCT_SUCCESS,
            payload: data.products || [], 
            productsCount: data.productsCount || 0
        });
    } catch (error) {
        // Dispatch failure action with error message if the API request fails
        const errorMessage = error.response ? error.response.data.message : error.message;
        dispatch({ type: ALL_PRODUCT_FAIL, payload: errorMessage });
    }
};



//get product details
export const getProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });

        const config = {
            withCredentials: true, // Ensure cookies (authentication token) are sent along with the request
        };

        const { data } = await axios.get(`${API_URL}api/v1/product/detail/${id}`, config);

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product,
        });
    } catch (error) {
        const errorMessage =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: errorMessage,
        });
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

// actions/productAction.js


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