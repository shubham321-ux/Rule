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
    CLEAR_ERRORS
} from '../constants/productConstant.js'

//get all products
export const getProduct = (page = 1, keyword = "") => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCT_REQUEST });
        const { data } = await axios.get(`${API_URL}api/v1/products?page=${page}&keyword=${keyword}`);
        dispatch({ type: ALL_PRODUCT_SUCCESS, payload: data || [], productsCount: data.productsCount || 0 });
    } catch (error) {
        dispatch({ type: ALL_PRODUCT_FAIL, payload: error.response.data.message });
    }
};


//get product details
export const getProductDetails = (id) => async (dispatch) => {
    console.log("action id ",id)
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST })
        const { data } = await axios.get(`${API_URL}api/v1/product/detail/${id}`)
        // console.log("action data ",data)
        dispatch({type: PRODUCT_DETAILS_SUCCESS, payload: data.product})
    }
    catch (error) {
        dispatch({ type: PRODUCT_DETAILS_FAIL,payload: error.response.data.message })
    }
}


//create product
export const createProduct = (productData) => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCT_REQUEST });
        dispatch({ type: CREATE_PRODUCT_REQUEST });
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",  // Important for file uploads
            },
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


//clear errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS })
}