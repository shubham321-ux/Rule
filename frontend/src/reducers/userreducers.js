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
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    UPDATE_USER_ROLE_REQUEST,
    UPDATE_USER_ROLE_SUCCESS,
    UPDATE_USER_ROLE_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,


} from "../constants/userConstant.js";

const initialState = {
    loading: false,
    users: [],
    totalUsers: 0,
    resultsPerPage: 10,
    error: null,
    isUpdated: false,
    isDeleted: false,
    user: {},
    selectedUser: null
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        case LOAD_USER_REQUEST:
        case GET_USER_REQUEST:
        case USER_DETAILS_REQUEST:
        case ALL_USERS_REQUEST:
            return {
                ...state,
                loading: true
            };

        case LOGIN_SUCCESS:
        case LOAD_REGISTER_SUCCESS:
        case GET_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload
            };

        case ALL_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                users: action.payload.users,
                totalUsers: action.payload.totalUsers,
                resultsPerPage: action.payload.resultsPerPage
            };

        case USER_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                selectedUser: action.payload,
                success: true
            };

        case UPDATE_USER_ROLE_REQUEST:
            return {
                ...state,
                loading: true
            };

        case UPDATE_USER_ROLE_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: true,
                message: "User role updated successfully"
            };

        case DELETE_USER_REQUEST:
            return {
                ...state,
                loading: true
            };

        case DELETE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: true,
                message: "User deleted successfully"
            };

        case LOGIN_FAIL:
        case GET_USER_FAIL:
        case USER_DETAILS_FAIL:
        case ALL_USERS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                user: null,
                isAuthenticated: false
            };

        case UPDATE_USER_ROLE_FAIL:
        case DELETE_USER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case REGISTER_REQUEST:
            return {
                ...state,
                loading: true,
                isAuthenticated: false
            };

        case REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload
            };

        case REGISTER_FAIL:
        case LOAD_REGISTER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                user: null,
                isAuthenticated: false
            };

        case LOGOUT_SUCCESS:
            return {
                loading: false,
                user: null,
                isAuthenticated: false
            };

        case LOGOUT_FAILED:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case FORGOT_PASSWORD_REQUEST:
        case RESET_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true
            };

        case FORGOT_PASSWORD_SUCCESS:
        case RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.success,
                message: action.payload.message
            };

        case FORGOT_PASSWORD_FAIL:
        case RESET_PASSWORD_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
                message: null,
                success: null,
                isUpdated: false,
                isDeleted: false
            };

        default:
            return state;
    }
};

