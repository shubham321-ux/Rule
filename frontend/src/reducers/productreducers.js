import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,
    CLEAR_ERRORS
} from '../constants/productConstant.js'
// import ALL_PRODUCT_REQUEST from '../constants/productConstant.js'
// import ALL_PRODUCT_SUCCESS from '../constants/productConstant.js'
// import ALL_PRODUCT_FAIL from '../constants/productConstant.js'
// import CLEAR_ERRORS from '../constants/productConstant.js'

export const productReducers = (state = { products: [] }, action) => {
    switch (action.type) {
        case ALL_PRODUCT_REQUEST:
            return {
                loading: true,
                products: []
            }
        case ALL_PRODUCT_SUCCESS:
            return {
                loading: false,
                products: action.payload,
                productsCout: action.payload.productsCout
            }
        case ALL_PRODUCT_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}