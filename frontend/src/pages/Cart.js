import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeItemFromCart, updateCartQuantity, clearCart } from '../actions/productAction';
import Payment from '../payment/Payment';
import "./css/Cart.css";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPayment, setShowPayment] = useState(false);
    const [showPopup, setShowPopup] = useState(false); // State for popup
    const { cartItems = [] } = useSelector(state => state.cart || { cartItems: [] });

    const handleQuantityChange = (productId, quantity) => {
        dispatch(updateCartQuantity(productId, quantity));
    };

    const handleRemoveItem = (productId) => {
        dispatch(removeItemFromCart(productId));
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        return subtotal;
    };

    const handleCheckout = () => {
        // Instead of proceeding with payment, show the popup
        setShowPopup(true);
    };

    const handlePaymentSuccess = () => {
        dispatch(clearCart());
        navigate('/orders');
    };

    const navigateToProduct = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleClosePopup = () => {
        setShowPopup(false); // Close the popup
    };

    return (
        <div className="bookstore-cart-wrapper">
            <h2 className="bookstore-cart-title">Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <div className="bookstore-cart-empty">
                    <p>Your cart is empty</p>
                </div>
            ) : (
                <div className="bookstore-cart-content">
                    <table className="bookstore-cart-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item._id} className="bookstore-cart-row">
                                    <td className="bookstore-cart-image-cell">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            onClick={() => navigateToProduct(item._id)}
                                            className="bookstore-cart-product-image"
                                        />
                                    </td>
                                    <td className="bookstore-cart-name-cell" onClick={() => navigateToProduct(item._id)}>
                                        {item.name}
                                    </td>
                                    <td className="bookstore-cart-price-cell">₹{item.price}</td>
                                    <td className="bookstore-cart-action-cell">
                                        <button onClick={() => handleRemoveItem(item._id)} className="bookstore-cart-remove-btn">
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="bookstore-cart-summary">
                        <div className="bookstore-cart-summary-content">
                            <h3>Order Summary</h3>
                            <div className="bookstore-cart-summary-row">
                                <span>Subtotal:</span>
                                <span>₹{calculateSubtotal()}</span>
                            </div>
                            <div className="bookstore-cart-summary-row">
                                <span>Shipping:</span>
                                <span>Free</span>
                            </div>
                            <div className="bookstore-cart-summary-row total">
                                <span>Total:</span>
                                <span>₹{calculateTotal()}</span>
                            </div>
                            <button
                                className="bookstore-cart-checkout-btn"
                                onClick={handleCheckout}
                                disabled={cartItems.length === 0}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Payment Not Available Now</h2>
                        <p>We are currently unable to process payments. Please try again later.</p>
                        <button onClick={handleClosePopup} className="go-back-btn">
                            Go Back
                        </button>
                    </div>
                </div>
            )}

            {showPayment && (
                <Payment
                    products={cartItems}
                    totalAmount={calculateTotal()}
                    onSuccess={handlePaymentSuccess}
                    onClose={() => setShowPayment(false)}
                />
            )}
        </div>
    );
};

export default Cart;
