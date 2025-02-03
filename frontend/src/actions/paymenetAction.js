import axios from 'axios';
import { API_URL } from '../config/config.js';
import {
    PROCESS_PAYMENT_REQUEST,
    PROCESS_PAYMENT_SUCCESS,
    PROCESS_PAYMENT_FAIL,
    CONFIRM_PAYMENT_REQUEST,
    CONFIRM_PAYMENT_SUCCESS,
    CONFIRM_PAYMENT_FAIL,
    GET_PDF_ACCESS_REQUEST,
    GET_PDF_ACCESS_SUCCESS,
    GET_PDF_ACCESS_FAIL,
    CLEAR_PAYMENT_ERRORS
} from '../constants/paymentConstant.js';

export const processPayment = (productId) => async (dispatch) => {
    try {
        dispatch({ type: PROCESS_PAYMENT_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        };

        const { data } = await axios.post(
            `${API_URL}api/v1/payment/process`,
            { productId },
            config
        );

        dispatch({ type: PROCESS_PAYMENT_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PROCESS_PAYMENT_FAIL,
            payload: error.response.data.message
        });
    }
};

export const confirmPayment = (productId) => async (dispatch) => {
    try {
        dispatch({ type: CONFIRM_PAYMENT_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        };

        const { data } = await axios.post(
            `${API_URL}api/v1/payment/confirm`,
            { productId },
            config
        );

        dispatch({ type: CONFIRM_PAYMENT_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: CONFIRM_PAYMENT_FAIL,
            payload: error.response.data.message
        });
    }
};

export const getPdfAccess = (productId) => async (dispatch) => {
    try {
        dispatch({ type: GET_PDF_ACCESS_REQUEST });

        const config = {
            withCredentials: true
        };

        const { data } = await axios.get(
            `${API_URL}api/v1/pdf/access/${productId}`,
            config
        );

        dispatch({ type: GET_PDF_ACCESS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: GET_PDF_ACCESS_FAIL,
            payload: error.response.data.message
        });
    }
};

export const clearPaymentErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_PAYMENT_ERRORS });
};
