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
        const orderData = {
            orderItems: cartItems.map(item => ({
                name: item.name,
                price: item.price,
                product: item._id,
                quantity: item.quantity,
                image: item.image
            })),
            itemsPrice: calculateSubtotal(),
            totalPrice: calculateTotal()
        };
        setShowPayment(true);
    };

    const handlePaymentSuccess = () => {
        dispatch(clearCart());
        navigate('/orders');
    };

    const navigateToProduct = (productId) => {
        navigate(`/product/${productId}`);
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
                                {/* <th>Quantity</th> */}
                                {/* <th>Subtotal</th> */}
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
                                    {/* <td className="bookstore-cart-quantity-cell">
                                        <div className="bookstore-cart-quantity-controls">
                                            <button onClick={() => handleQuantityChange(item._id, Math.max(1, item.quantity - 1))}>
                                                -
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => handleQuantityChange(item._id, Math.min(item.stock, item.quantity + 1))}>
                                                +
                                            </button>
                                        </div>
                                    </td> */}
                                    {/* <td className="bookstore-cart-subtotal-cell">₹{item.price * item.quantity}</td> */}
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
