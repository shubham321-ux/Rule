import { createStore, combineReducers, applyMiddleware } from "redux"
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension"
import { productReducers } from "./reducers/productreducers";
import { productDetailReducers } from "./reducers/productreducers";
import {  userReducer } from "./reducers/userreducers";
const reducer = combineReducers({
    products: productReducers,
    productDetails: productDetailReducers ,
    user:  userReducer
})
let initialState = {}
const middleware = [thunk];
const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)
export default store;