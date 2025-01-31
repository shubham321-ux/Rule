import {
    LOGIN_FAIL,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOAD_REGISTER_FAIL,
    LOAD_REGISTER_SUCCESS,
    LOAD_USER_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILED,
    FORGOT_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,

    CLEAR_ERRORS
} from "../constants/userConstant.js";
import { CLEAR_CART } from "../constants/cartConstanat.js";
import axios from "axios";
import { API_URL } from '../config/config.js';

//login action
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true,
        };
        const { data } = await axios.post(`${API_URL}api/v1/login/user`, { email, password }, config);
        dispatch({ type: LOGIN_SUCCESS, payload: data });
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message;
        dispatch({ type: LOGIN_FAIL, payload: errorMessage });
    }
};


//register action 
export const register = (formData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",  // Important for file uploads
            },
            withCredentials: true,  // Ensure cookies (like JWT) are sent with the request
        };

        const { data } = await axios.post(`${API_URL}api/v1/register/user`, formData, config);
        dispatch({ type: REGISTER_SUCCESS, payload: data });
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message;
        dispatch({ type: REGISTER_FAIL, payload: errorMessage });
    }
};

//load user
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST });

        // Make sure to include cookies with the request
        const config = {
            withCredentials: true,  // This ensures cookies are sent along with the request
        };

        // Making the request to /api/v1/me to fetch user data
        const { data } = await axios.get(`${API_URL}api/v1/me`, config);

        // Dispatch success action with user data
        dispatch({ type: LOAD_REGISTER_SUCCESS, payload: data });
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message;
        dispatch({ type: LOAD_REGISTER_FAIL, payload: errorMessage });
    }
};


//logout action
export const logout = () => async (dispatch) => {
    try {
        // Logout from backend
        await axios.get(`${API_URL}api/v1/logout/user`, { withCredentials: true });
        
        // Clear user data
        dispatch({ type: LOGOUT_SUCCESS });
        
        // Clear cart data
        dispatch({ type: CLEAR_CART });
        
        // Clear all localStorage data
        localStorage.removeItem('user');
        localStorage.removeItem('cartItems');
        
        // Clear user-specific cart if exists
        const userId = JSON.parse(localStorage.getItem('user'))?._id;
        if (userId) {
            localStorage.removeItem(`cart_${userId}`);
        }

    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message;
        dispatch({ type: LOGOUT_FAILED, payload: errorMessage });
    }
};



// Forgot Password action
export const forgotPassword = (email) => async (dispatch) => {
    try {
      dispatch({ type: FORGOT_PASSWORD_REQUEST });
  
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      const { data } = await axios.post(`${API_URL}api/v1/password/forgot`, { email }, config);
  
      dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data });
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : error.message;
      dispatch({ type: FORGOT_PASSWORD_FAIL, payload: errorMessage });
    }
  };

  // Reset Password action
export const resetPassword = (token, password) => async (dispatch) => {
    try {
      dispatch({ type: RESET_PASSWORD_REQUEST });
  
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      const { data } = await axios.put(`${API_URL}api/v1/password/reset/${token}`, { password }, config);
  
      dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data });
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : error.message;
      dispatch({ type: RESET_PASSWORD_FAIL, payload: errorMessage });
    }
  };


