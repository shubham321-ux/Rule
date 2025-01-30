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
    LOAD_USER_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILED,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
} from "../constants/userConstant.js";

// userReducer
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
            return { loading: false, error: action.payload, user: null, isAuthenticated: false };

        case LOGOUT_SUCCESS:
            return { loading: false, user: null, isAuthenticated: false };

        case LOGOUT_FAILED:
            return { ...state, loading: false, error: action.payload };

        case FORGOT_PASSWORD_REQUEST:
            return { ...state, loading: true };

        case FORGOT_PASSWORD_SUCCESS:
            return { ...state, loading: false, success: action.payload.success, message: action.payload.message };

        case FORGOT_PASSWORD_FAIL:
            return { ...state, loading: false, error: action.payload };

        case RESET_PASSWORD_REQUEST:
            return { ...state, loading: true };

        case RESET_PASSWORD_SUCCESS:
            return { ...state, loading: false, success: action.payload.success, message: action.payload.message };

        case RESET_PASSWORD_FAIL:
            return { ...state, loading: false, error: action.payload };

        case CLEAR_ERRORS:
            return { ...state, error: null, message: null, success: null };

        default:
            return state;
    }
};
