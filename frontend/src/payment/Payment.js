import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { processPayment, confirmPayment } from '../actions/paymenetAction';
import { newOrder } from '../actions/orderAction';
import PopupModal from '../components/PopupModal';
import { FaCreditCard, FaMobileAlt, FaUniversity } from 'react-icons/fa';
import { BsCheckCircleFill } from 'react-icons/bs';
import '../pages/css/Payment.css';

const Payment = ({ product, onSuccess }) => {
    const dispatch = useDispatch();
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [showStepOne, setShowStepOne] = useState(true);
    const [showStepTwo, setShowStepTwo] = useState(false);
    const [showStepThree, setShowStepThree] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [pdfData, setPdfData] = useState(null);
    const { loading } = useSelector(state => state.payment);

    const paymentMethods = [
        { id: 'card', label: 'Credit/Debit Card', icon: <FaCreditCard /> },
        { id: 'upi', label: 'UPI Payment', icon: <FaMobileAlt /> },
        { id: 'netbanking', label: 'Net Banking', icon: <FaUniversity /> }
    ];

    const handlePayment = async () => {
        try {
            const processResult = await dispatch(processPayment(product._id));
            if (processResult?.success) {
                const { orderId, amount } = processResult;
                const options = {
                    key: "rzp_test_woOuBFt9737Rqq",
                    amount: amount * 100,
                    currency: 'INR',
                    name: 'Product Payment',
                    description: product.name,
                    order_id: orderId,
                    handler: async function (response) {
                        const confirmResult = await dispatch(confirmPayment({
                            productId: product._id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                            paymentStatus: 'success'
                        }));

                        if (confirmResult?.success && confirmResult?.pdfUrl) {
                            setPdfData(confirmResult.pdfUrl);
                            setShowSuccess(true);
                            setShowStepThree(false);
                            
                            await dispatch(newOrder({
                                productId: product._id,
                                orderItems: [{
                                    name: product.name,
                                    price: product.price,
                                    product: product._id,
                                    quantity: 1
                                }],
                                itemsPrice: product.price,
                                totalPrice: product.price
                            }));
                        }
                    }
                };
                const razorpay = new window.Razorpay(options);
                razorpay.open();
            }
        } catch (error) {
            console.log('Payment failed:', error.message);
        }
    };

    return (
        <>
            <PopupModal show={showStepOne} onClose={() => setShowStepOne(false)}>
                <div className="step-content">
                    <div className="step-header">
                        <h2>Order Summary</h2>
                        <div className="step-indicator">Step 1 of 3</div>
                    </div>
                    <div className="product-info">
                        <div className="product-header">
                            <div className="product-image-payment">
                                <img src={product.images[0]?.url} alt={product.name} />
                            </div>
                            <div className="product-details">
                                <h3>{product.name}</h3>
                                <p className="product-description">category: {product.category}</p>
                                <p className="product-author">Author: {product.author}</p>
                            </div>
                        </div>
                        <div className="price-breakdown">
                            <div className="price-row total">
                                <span>Total Amount</span>
                                <span className="amount">₹{product.price}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setShowStepOne(false);
                            setShowStepTwo(true);
                        }}
                        className="next-button-pay"
                    >
                        Continue to Payment
                    </button>
                </div>
            </PopupModal>

            <PopupModal show={showStepTwo} onClose={() => setShowStepTwo(false)}>
                <div className="step-content">
                    <div className="step-header">
                        <h2>Select Payment Method</h2>
                        <div className="step-indicator">Step 2 of 3</div>
                    </div>
                    <div className="payment-methods">
                        {paymentMethods.map(method => (
                            <label key={method.id} className={`payment-option ${selectedMethod === method.id ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value={method.id}
                                    checked={selectedMethod === method.id}
                                    onChange={(e) => setSelectedMethod(e.target.value)}
                                />
                                <div className="payment-option-content">
                                    <span className="payment-icon">{method.icon}</span>
                                    <span className="payment-label">{method.label}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                    <div className="button-group">
                        <button
                            onClick={() => {
                                setShowStepTwo(false);
                                setShowStepOne(true);
                            }}
                            className="back-button-pay"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => {
                                setShowStepTwo(false);
                                setShowStepThree(true);
                            }}
                            className="next-button-pay"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </PopupModal>

            <PopupModal show={showStepThree} onClose={() => setShowStepThree(false)}>
                <div className="step-content">
                    <div className="step-header">
                        <h2>Confirm Payment</h2>
                        <div className="step-indicator">Step 3 of 3</div>
                    </div>
                    <div className="summary-details">
                        <div className="summary-item">
                            <span>Product</span>
                            <span>{product.name}</span>
                        </div>
                        <div className="summary-item">
                            <span>Payment Method</span>
                            <span>{selectedMethod.toUpperCase()}</span>
                        </div>
                        <div className="summary-item total">
                            <span>Total Amount</span>
                            <span>₹{product.price}</span>
                        </div>
                    </div>
                    <div className="button-group">
                        <button
                            onClick={() => {
                                setShowStepThree(false);
                                setShowStepTwo(true);
                            }}
                            className="back-button-pay"
                        >
                            Back
                        </button>
                        <button
                            onClick={handlePayment}
                            className="pay-button-pay"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : `Pay ₹${product.price}`}
                        </button>
                    </div>
                </div>
            </PopupModal>

            <PopupModal show={showSuccess} onClose={() => setShowSuccess(false)}>
                <div className="success-content">
                    <div className="success-icon">
                        <BsCheckCircleFill />
                    </div>
                    <h2>Payment Successful!</h2>
                    <p className="success-message">Your payment has been processed successfully.</p>
                    <div className="pdf-actions">
                        <a
                            href={pdfData}
                            download
                            className="download-button-pay"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Download Invoice
                        </a>
                        <button
                            onClick={() => window.open(pdfData, '_blank')}
                            className="view-button-pay"
                        >
                            View Invoice
                        </button>
                    </div>
                </div>
            </PopupModal>
        </>
    );
};

export default Payment;
