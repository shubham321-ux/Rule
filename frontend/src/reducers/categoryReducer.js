import {
    CREATE_CATEGORY_REQUEST,
    CREATE_CATEGORY_SUCCESS,
    CREATE_CATEGORY_FAIL,
    GET_CATEGORIES_REQUEST,
    GET_CATEGORIES_SUCCESS,
    GET_CATEGORIES_FAIL,
    UPDATE_CATEGORY_REQUEST,
    UPDATE_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_FAIL,
    DELETE_CATEGORY_REQUEST,
    DELETE_CATEGORY_SUCCESS,
    DELETE_CATEGORY_FAIL,
    CLEAR_ERRORS
} from '../constants/categoryConstant.js';

const initialState = {
    categories: [],
    loading: false,
    error: null
};

export const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_CATEGORY_REQUEST:
        case GET_CATEGORIES_REQUEST:
        case UPDATE_CATEGORY_REQUEST:
        case DELETE_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true
            };

        case CREATE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: [...state.categories, action.payload],  // Add newly created category to list
            };

        case GET_CATEGORIES_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: action.payload,  // Replace current categories with the fetched ones
            };

        case UPDATE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: state.categories.map((category) =>
                    category._id === action.payload._id ? action.payload : category  // Update the updated category in the list
                ),
            };

        case DELETE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: state.categories.filter((category) => category._id !== action.payload)  // Remove deleted category from list
            };

        case CREATE_CATEGORY_FAIL:
        case GET_CATEGORIES_FAIL:
        case UPDATE_CATEGORY_FAIL:
        case DELETE_CATEGORY_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload  // Set error from action payload
            };

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null  // Clear errors
            };

        default:
            return state;
    }
};
