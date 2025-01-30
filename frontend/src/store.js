import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk"; // Correct import for redux-thunk
import { composeWithDevTools } from "redux-devtools-extension"; // Correct import for Redux DevTools

// Import your reducers
import { productReducers, productDetailReducers } from "./reducers/productreducers";
import { userReducer } from "./reducers/userreducers";

// Combine reducers
const reducer = combineReducers({
  products: productReducers,
  productDetails: productDetailReducers,
  user: userReducer,
});

// Set initial state (can be an empty object or customized based on your needs)
let initialState = {};

// Apply middleware (redux-thunk)
const middleware = [thunk];

// Create the store
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)) // Use Redux DevTools with middleware
);

export default store;
