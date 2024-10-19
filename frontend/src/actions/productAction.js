import axios from 'axios';
import { API_URL } from '../config/config.js';
import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_REQUEST,
    CLEAR_ERRORS
} from '../constants/productConstant.js'

//get all products
export const getProduct = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCT_REQUEST })
        const { data } = await axios.get(`${API_URL}api/v1/products`)
        dispatch({type: ALL_PRODUCT_SUCCESS, payload: data})
    }
    catch (error) {
        dispatch({ type: ALL_PRODUCT_FAIL,payload: error.response.data.message })
    }
}

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

//clear errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS })
}