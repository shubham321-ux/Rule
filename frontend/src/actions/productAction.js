import axios from 'axios';
import { API_URL } from '../config/config.js';
import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,
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

//clear errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS })
}