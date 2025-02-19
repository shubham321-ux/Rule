import axios from "axios";
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
} from "../constants/categoryConstant";
import { API_URL } from "../config/config";

export const createCategory = (name, description) => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_CATEGORY_REQUEST });

    const token = localStorage.getItem('token');

        const config = {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
      

    const { data } = await axios.post(
      `${API_URL}api/v1/create-category`,
      { name, description },
      config
    );
    // alert(data.message)

    dispatch({
      type: CREATE_CATEGORY_SUCCESS,
      payload: data.category
    });
  } catch (error) {
    dispatch({
      type: CREATE_CATEGORY_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    });
  }
};

export const getCategories = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_CATEGORIES_REQUEST });


    const token = localStorage.getItem('token');

    const config = {
        withCredentials: true,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
      

    const { data } = await axios.get(`${API_URL}api/v1/getAll-categories`, config);
    // alert(data.message)
    dispatch({
      type: GET_CATEGORIES_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GET_CATEGORIES_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    });
  }
};

export const updateCategory = (id, name, description) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_CATEGORY_REQUEST });



    const token = localStorage.getItem('token');

    const config = {
        withCredentials: true,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
      

    const { data } = await axios.put(
    `${API_URL}api/v1/update-category/${id}`,
      { name, description },
      config
    );
    // alert(data.message)
    dispatch({
      type: UPDATE_CATEGORY_SUCCESS,
      payload: data.updatedCategory
    });
  } catch (error) {
    dispatch({
      type: UPDATE_CATEGORY_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    });
  }
};

export const deleteCategory = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_CATEGORY_REQUEST });



    const token = localStorage.getItem('token');

    const config = {
        withCredentials: true,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
      

   const{data}= await axios.delete(`${API_URL}api/v1/delete-category/${id}`, config);
   console.log(data.message)
    dispatch({
      type: DELETE_CATEGORY_SUCCESS,
      payload: id
    });
  } catch (error) {
    dispatch({
      type: DELETE_CATEGORY_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    });
  }
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
