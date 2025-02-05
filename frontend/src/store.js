import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { paymentReducer } from "./reducers/paymentreducer";
import { productReducers, productDetailReducers, createProductReducer, createReviewReducer } from "./reducers/productreducers";
import { cartReducer } from "./reducers/cartreducer";
import { userReducer } from "./reducers/userreducers";
import { categoryReducer } from "./reducers/categoryReducer";
import { newOrderReducer, myOrdersReducer, orderDetailsReducer, allOrdersReducer, orderReducer } from './reducers/orderreducers';
import { favoriteReducer } from './reducers/fevoritebooksReducer';

const reducer = combineReducers({
    products: productReducers,
    productDetails: productDetailReducers,
    user: userReducer,
    createProduct: createProductReducer,
    cart: cartReducer,
    payment: paymentReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    allOrders: allOrdersReducer,
    order: orderReducer,
    createReview: createReviewReducer,
    category: categoryReducer,
    favorites: favoriteReducer
});

const loadUser = () => {
    try {
        const serializedUser = localStorage.getItem('user');
        if (serializedUser === null) return undefined;
        return JSON.parse(serializedUser);
    } catch (err) {
        return undefined;
    }
};

const loadCartItems = (user) => {
    if (user) {
        const cartItems = localStorage.getItem(`cart_${user._id}`);
        return cartItems ? JSON.parse(cartItems) : [];
    }
    return [];
};

const loadFavorites = (user) => {
    if (user) {
        const favorites = localStorage.getItem(`favorites_${user._id}`);
        return favorites ? JSON.parse(favorites) : [];
    }
    return [];
};

const user = loadUser();
const initialState = {
    user: { user },
    cart: {
        cartItems: loadCartItems(user)
    },
    favorites: {
        favorites: loadFavorites(user)
    }
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

store.subscribe(() => {
    const currentUser = store.getState().user.user;
    const cartItems = store.getState().cart.cartItems;
    const favorites = store.getState().favorites.favorites;

    if (currentUser) {
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem(`cart_${currentUser._id}`, JSON.stringify(cartItems));
        localStorage.setItem(`favorites_${currentUser._id}`, JSON.stringify(favorites));
    }
});

export default store;
