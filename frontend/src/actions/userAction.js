import {
    LOGIN_FAIL,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    CLEAR_ERRORS
} from "../constants/userConstant.js";
import axios from "axios";
import { API_URL } from '../config/config.js';

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const { data } = await axios.post(`${API_URL}api/v1/login/user`, { email, password }, config);
        dispatch({ type: LOGIN_SUCCESS, payload: data });
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message;
        dispatch({ type: LOGIN_FAIL, payload: errorMessage });
    }
};

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


