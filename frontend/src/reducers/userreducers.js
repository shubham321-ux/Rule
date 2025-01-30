import {
    LOGIN_FAIL,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    REGISTER_FAIL,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    CLEAR_ERRORS,
    LOAD_REGISTER_FAIL,
    LOAD_REGISTER_SUCCESS,
    LOAD_USER_REQUEST
} from "../constants/userConstant.js";

export const userReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            case LOAD_USER_REQUEST:
            return { loading: true, user: {}, isAuthenticated: false };
        case LOGIN_SUCCESS:
            case LOAD_REGISTER_SUCCESS:
            return { ...state, isAuthenticated: true, loading: false, user: action.payload };
        case LOGIN_FAIL:
            return { loading: false, error: action.payload, user: null, isAuthenticated: false };
        
        case REGISTER_REQUEST:
            return { loading: true, user: {}, isAuthenticated: false };
        case REGISTER_SUCCESS:
            return { ...state, isAuthenticated: true, loading: false, user: action.payload };
        case REGISTER_FAIL:
            return { loading: false, error: action.payload, user: null, isAuthenticated: false };
        case LOAD_REGISTER_FAIL:
            return{loading: false, error: action.payload, user: null, isAuthenticated: false }
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};
