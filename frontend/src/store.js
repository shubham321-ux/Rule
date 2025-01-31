import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

// Import reducers
import { productReducers, productDetailReducers, createProductReducer } from "./reducers/productreducers";
import { cartReducer } from "./reducers/cartreducer";
import { userReducer } from "./reducers/userreducers";

const reducer = combineReducers({
  products: productReducers,
  productDetails: productDetailReducers,
  user: userReducer,
  createProduct: createProductReducer,
  cart: cartReducer,
});

// Load user from localStorage
const loadUser = () => {
  try {
    const serializedUser = localStorage.getItem('user');
    if (serializedUser === null) return undefined;
    return JSON.parse(serializedUser);
  } catch (err) {
    return undefined;
  }
};

// Load cart items based on user
const loadCartItems = (user) => {
  if (user) {
    const cartItems = localStorage.getItem(`cart_${user._id}`);
    return cartItems ? JSON.parse(cartItems) : [];
  }
  return [];
};

const user = loadUser();
const initialState = {
  user: { user },
  cart: {
    cartItems: loadCartItems(user)
  }
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

// Persist state on store updates
store.subscribe(() => {
  const currentUser = store.getState().user.user;
  const cartItems = store.getState().cart.cartItems;
  
  if (currentUser) {
    localStorage.setItem('user', JSON.stringify(currentUser));
    localStorage.setItem(`cart_${currentUser._id}`, JSON.stringify(cartItems));
  }
});

export default store;
