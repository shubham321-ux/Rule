import { createStore, combineReducers, applyMiddleware } from "redux"
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension"
import { productReducers } from "./reducers/productreducers";
import { productDetailReducers } from "./reducers/productreducers";
const reducer = combineReducers({
    products: productReducers,
    productDetails: productDetailReducers 
})
let initialState = {}
const middleware = [thunk];
const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)
export default store;