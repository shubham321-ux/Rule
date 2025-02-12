import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { paymentReducer } from "./reducers/paymentreducer";
import { productReducers, productDetailReducers, createProductReducer, createReviewReducer } from "./reducers/productreducers";
import { cartReducer } from "./reducers/cartreducer";
import { userReducer } from "./reducers/userreducers";
import { categoryReducer } from "./reducers/categoryReducer";
import { newOrderReducer, myOrdersReducer, orderDetailsReducer, allOrdersReducer, orderReducer } from './reducers/orderreducers';
import { favoriteReducer } from './reducers/fevoritebooksReducer';

const rootReducer = combineReducers({
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

const persistConfig = {
    key: 'root',
    storage,
    whitelist: [
        'products',
        'productDetails',
        'user',
        'createProduct',
        'cart',
        'payment',
        'newOrder',
        'myOrders',
        'orderDetails',
        'allOrders',
        'order',
        'createReview',
        'category',
        'favorites'
    ],
    serialize: true,
    debug: process.env.NODE_ENV !== 'production'
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('persist:root');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

const initialState = loadState() || {};
const middleware = [thunk];

const store = createStore(
    persistedReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export const persistor = persistStore(store);
export default store;
