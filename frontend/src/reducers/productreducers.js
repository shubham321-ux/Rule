import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    CREATE_PRODUCT_REQUEST,
    CREATE_PRODUCT_SUCCESS,
    CREATE_PRODUCT_FAIL,
    CREATE_PRODUCT_RESET,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    CREATE_REVIEW_FAIL,
    CREATE_REVIEW_SUCCESS,
    CREATE_REVIEW_REQUEST,
    CREATE_REVIEW_RESET,
    CLEAR_ERRORS
} from '../constants/productConstant.js';

export const productReducers = (state = { products: [] }, action) => {
    switch (action.type) {
        case ALL_PRODUCT_REQUEST:
            return {
                loading: true,
                products: [],
            };
        case ALL_PRODUCT_SUCCESS:
            return {
                loading: false,
                products: action.payload,
                productsCount: action.productsCount,
            };
        case ALL_PRODUCT_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        case UPDATE_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case UPDATE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                product: action.payload,
            };
        case UPDATE_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case DELETE_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                products: state.products.filter((product) => product._id !== action.payload),
            };
        case DELETE_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const productDetailReducers = (state = { product: [] }, action) => {
    switch (action.type) {
        case PRODUCT_DETAILS_REQUEST:
            return {
                loading: true,
                ...state,
            };
        case PRODUCT_DETAILS_SUCCESS:
            return {
                loading: false,
                product: action.payload,
            };
        case PRODUCT_DETAILS_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const createProductReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case CREATE_PRODUCT_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                product: action.payload.product,
            };
        case CREATE_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case CREATE_PRODUCT_RESET:
            return {
                ...state,
                success: false,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const createReviewReducer = (state = { review: {} }, action) => {
    switch (action.type) {
        case CREATE_REVIEW_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case CREATE_REVIEW_SUCCESS:
            return {
                loading: false,
                success: true,
                review: action.payload,
            };
        case CREATE_REVIEW_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CREATE_REVIEW_RESET:
            return {
                ...state,
                success: false,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};
