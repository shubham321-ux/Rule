import {
    LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS,
    REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAIL,
    LOAD_REGISTER_FAIL, LOAD_REGISTER_SUCCESS, LOAD_USER_REQUEST,
    LOGOUT_SUCCESS, LOGOUT_FAILED,
    FORGOT_PASSWORD_FAIL, FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL, RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS,
    GET_USER_FAIL, GET_USER_REQUEST, GET_USER_SUCCESS,
    CLEAR_ERRORS
} from "../constants/userConstant.js";
import { CLEAR_CART } from "../constants/cartConstant.js";
import axios from "axios";
import { API_URL } from '../config/config.js';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_URL;

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Add request interceptor
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// Login action
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST });
        const { data } = await axios.post(`${API_URL}api/v1/login/user`, 
            { email, password },
            { withCredentials: true }
        );
        localStorage.setItem('token', data.token);
        dispatch({ type: LOGIN_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: LOGIN_FAIL, payload: error.response?.data?.message });
    }
};

// Register action
export const register = (formData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_REQUEST });
        const { data } = await axios.post(`${API_URL}api/v1/register/user`, 
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            }
        );
        localStorage.setItem('token', data.token);
        dispatch({ type: REGISTER_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: REGISTER_FAIL, payload: error.response?.data?.message });
    }
};

// Load user
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST });
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_URL}api/v1/me`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        dispatch({ type: LOAD_REGISTER_SUCCESS, payload: data });
    } catch (error) {
        localStorage.removeItem('token');
        dispatch({ type: LOAD_REGISTER_FAIL, payload: 'Please login to continue' });
    }
};

// Logout action
export const logout = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        await axios.get(`${API_URL}api/v1/logout/user`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        localStorage.removeItem('token');
        localStorage.removeItem('cartItems');
        dispatch({ type: LOGOUT_SUCCESS });
        dispatch({ type: CLEAR_CART });
    } catch (error) {
        dispatch({ type: LOGOUT_FAILED, payload: error.response?.data?.message });
    }
};

// Forgot Password action
export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST });
        const { data } = await axios.post(`${API_URL}api/v1/password/forgot`, 
            { email },
            { withCredentials: true }
        );
        dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: FORGOT_PASSWORD_FAIL, payload: error.response?.data?.message });
    }
};

// Reset Password action
export const resetPassword = (token, password) => async (dispatch) => {
    try {
        dispatch({ type: RESET_PASSWORD_REQUEST });
        const { data } = await axios.put(`${API_URL}api/v1/password/reset/${token}`, 
            { password },
            { withCredentials: true }
        );
        dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: RESET_PASSWORD_FAIL, payload: error.response?.data?.message });
    }
};

// Get user details
export const getUserDetails = () => async (dispatch) => {
    try {
        dispatch({ type: GET_USER_REQUEST });
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_URL}api/v1/user/details`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        dispatch({ type: GET_USER_SUCCESS, payload: data.user });
    } catch (error) {
        dispatch({ type: GET_USER_FAIL, payload: error.response?.data?.message });
    }
};
