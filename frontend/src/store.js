import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk"; 
import { composeWithDevTools } from "redux-devtools-extension"; 

// Import your reducers
import { productReducers, productDetailReducers,createProductReducer } from "./reducers/productreducers";
import { userReducer } from "./reducers/userreducers";

// Combine reducers
const reducer = combineReducers({
  products: productReducers,
  productDetails: productDetailReducers,
  user: userReducer,
  createProduct: createProductReducer,
});

// Set initial state (can be an empty object or customized based on your needs)
let initialState = {};

// Apply middleware (redux-thunk)
const middleware = [thunk];

// Create the store
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)) 
);

export default store;
