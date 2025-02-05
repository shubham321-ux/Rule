import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { processPayment, confirmPayment } from '../actions/paymenetAction';
import { newOrder } from '../actions/orderAction';
import PopupModal from '../components/PopupModal';
import '../components/css/Payment.css';

const Payment = ({ product, onSuccess }) => {
    const dispatch = useDispatch();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [showStepOne, setShowStepOne] = useState(true);
    const [showStepTwo, setShowStepTwo] = useState(false);
    const [showStepThree, setShowStepThree] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [pdfData, setPdfData] = useState(null);
    const { loading } = useSelector(state => state.payment);

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
                                taxPrice: product.price * 0.18,
                                totalPrice: product.price * 1.18
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
                    <h2>Order Summary</h2>
                    <div className="product-info">
                        <p>Product: {product.name}</p>
                        <p>Price: ₹{product.price}</p>
                        <p>Tax (18%): ₹{(product.price * 0.18).toFixed(2)}</p>
                        <p>Total: ₹{(product.price * 1.18).toFixed(2)}</p>
                    </div>
                    <button 
                        onClick={() => {
                            setShowStepOne(false);
                            setShowStepTwo(true);
                        }} 
                        className="next-button"
                    >
                        Continue to Payment
                    </button>
                </div>
            </PopupModal>

            <PopupModal show={showStepTwo} onClose={() => setShowStepTwo(false)}>
                <div className="step-content">
                    <h2>Select Payment Method</h2>
                    <div className="payment-methods">
                        {['card', 'upi', 'netbanking'].map(method => (
                            <label key={method} className="payment-option">
                                <input
                                    type="radio"
                                    name="payment"
                                    value={method}
                                    checked={selectedMethod === method}
                                    onChange={(e) => setSelectedMethod(e.target.value)}
                                />
                                <span>{method.toUpperCase()}</span>
                            </label>
                        ))}
                    </div>
                    <div className="button-group">
                        <button 
                            onClick={() => {
                                setShowStepTwo(false);
                                setShowStepOne(true);
                            }} 
                            className="back-button"
                        >
                            Back
                        </button>
                        <button 
                            onClick={() => {
                                setShowStepTwo(false);
                                setShowStepThree(true);
                            }} 
                            className="next-button"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </PopupModal>

            <PopupModal show={showStepThree} onClose={() => setShowStepThree(false)}>
                <div className="step-content">
                    <h2>Confirm Payment</h2>
                    <div className="summary-details">
                        <p>Product: {product.name}</p>
                        <p>Payment Method: {selectedMethod.toUpperCase()}</p>
                        <p>Total Amount: ₹{(product.price * 1.18).toFixed(2)}</p>
                    </div>
                    <div className="button-group">
                        <button 
                            onClick={() => {
                                setShowStepThree(false);
                                setShowStepTwo(true);
                            }} 
                            className="back-button"
                        >
                            Back
                        </button>
                        <button 
                            onClick={handlePayment} 
                            className="pay-button" 
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : `Pay ₹${(product.price * 1.18).toFixed(2)}`}
                        </button>
                    </div>
                </div>
            </PopupModal>

            <PopupModal show={showSuccess} onClose={() => setShowSuccess(false)}>
                <div className="success-content">
                    <h2>Payment Successful!</h2>
                    <div className="pdf-actions">
                        <a 
                            href={pdfData} 
                            download 
                            className="download-button"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Download Invoice
                        </a>
                        <button 
                            onClick={() => window.open(pdfData, '_blank')} 
                            className="view-button"
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
