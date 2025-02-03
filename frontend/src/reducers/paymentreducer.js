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

export const paymentReducer = (state = { payment: {} }, action) => {
    switch (action.type) {
        case PROCESS_PAYMENT_REQUEST:
        case CONFIRM_PAYMENT_REQUEST:
        case GET_PDF_ACCESS_REQUEST:
            return {
                ...state,
                loading: true
            };

        case PROCESS_PAYMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                paymentDetails: action.payload
            };

        case CONFIRM_PAYMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                paymentConfirmed: true,
                pdfUrl: action.payload.pdfUrl
            };

        case GET_PDF_ACCESS_SUCCESS:
            return {
                ...state,
                loading: false,
                pdfUrl: action.payload.pdfUrl
            };

        case PROCESS_PAYMENT_FAIL:
        case CONFIRM_PAYMENT_FAIL:
        case GET_PDF_ACCESS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case CLEAR_PAYMENT_ERRORS:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};
