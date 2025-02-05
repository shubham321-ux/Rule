import {
    ADD_TO_FAVORITES_REQUEST,
    ADD_TO_FAVORITES_SUCCESS,
    ADD_TO_FAVORITES_FAIL,
    GET_FAVORITES_REQUEST,
    GET_FAVORITES_SUCCESS,
    GET_FAVORITES_FAIL,
    REMOVE_FROM_FAVORITES_REQUEST,
    REMOVE_FROM_FAVORITES_SUCCESS,
    REMOVE_FROM_FAVORITES_FAIL,
    CLEAR_ERRORS
} from '../constants/fevoritebooksConstant';

export const favoriteReducer = (state = { favorites: [] }, action) => {
    switch (action.type) {
        case ADD_TO_FAVORITES_REQUEST:
        case GET_FAVORITES_REQUEST:
        case REMOVE_FROM_FAVORITES_REQUEST:
            return {
                ...state,
                loading: true
            };

        case ADD_TO_FAVORITES_SUCCESS:
            return {
                ...state,
                loading: false,
                favorites: [...state.favorites, action.payload]
            };

        case GET_FAVORITES_SUCCESS:
            return {
                ...state,
                loading: false,
                favorites: action.payload
            };

        case REMOVE_FROM_FAVORITES_SUCCESS:
            return {
                ...state,
                loading: false,
                favorites: state.favorites.filter(item => item._id !== action.payload)
            };

        case ADD_TO_FAVORITES_FAIL:
        case GET_FAVORITES_FAIL:
        case REMOVE_FROM_FAVORITES_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};
