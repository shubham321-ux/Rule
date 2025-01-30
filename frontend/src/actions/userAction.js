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
    CLEAR_ERRORS
} from "../constants/userConstant.js";
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
                "Content-Type": "multipart/form-data"
            }
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

