import axios from 'axios';
import { API_URL } from '../config/config.js';
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
} from '../constants/fevoritebooksConstant.js';

// Add to favorites
export const addToFavorites = (productId) => async (dispatch) => {
    try {
        dispatch({ type: ADD_TO_FAVORITES_REQUEST });

        const token = localStorage.getItem('token');

        const config = {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const { data } = await axios.post(
            `${API_URL}api/v1/favorite/new`,
            { productId },
            config
        );

        dispatch({
            type: ADD_TO_FAVORITES_SUCCESS,
            payload: data.favorite,
        });
    } catch (error) {
        dispatch({
            type: ADD_TO_FAVORITES_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// Get favorites
export const getFavorites = () => async (dispatch) => {
    try {
        dispatch({ type: GET_FAVORITES_REQUEST });

        const token = localStorage.getItem('token');

        const config = {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const { data } = await axios.get(
            `${API_URL}api/v1/favorites/me`,
            config
        );

        dispatch({
            type: GET_FAVORITES_SUCCESS,
            payload: data.favorites,
        });
    } catch (error) {
        dispatch({
            type: GET_FAVORITES_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// Remove from favorites
export const removeFromFavorites = (id) => async (dispatch) => {
    try {
        dispatch({ type: REMOVE_FROM_FAVORITES_REQUEST });

        const token = localStorage.getItem('token');

        const config = {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        await axios.delete(`${API_URL}api/v1/favorite/${id}`, config);

        dispatch({
            type: REMOVE_FROM_FAVORITES_SUCCESS,
            payload: id,
        });
    } catch (error) {
        dispatch({
            type: REMOVE_FROM_FAVORITES_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
