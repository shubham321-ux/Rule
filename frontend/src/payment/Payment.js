import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { processPayment, confirmPayment } from '../actions/paymenetAction';
import { newOrder } from '../actions/orderAction';
import PopupModal from '../components/PopupModal';
import { FaCreditCard, FaMobileAlt, FaUniversity } from 'react-icons/fa';
import { BsCheckCircleFill } from 'react-icons/bs';
import Loading from '../components/Loading';
import '../pages/css/Payment.css';

const Payment = ({ products, totalAmount, onSuccess, onClose }) => {
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
            const processResult = await dispatch(processPayment({
                products: products.map(item => ({
                    productId: item._id,
                    quantity: item.quantity
                })),
                totalAmount
            }));

            if (processResult?.success) {
                const { orderId, amount } = processResult;
                const options = {
                    key: "rzp_test_woOuBFt9737Rqq",
                    amount: amount * 100,
                    currency: 'INR',
                    name: 'Cart Payment',
                    description: `Payment for ${products.length} items`,
                    order_id: orderId,
                    handler: async function (response) {
                        const confirmResult = await dispatch(confirmPayment({
                            products: products.map(item => item._id),
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                            paymentStatus: 'success'
                        }));

                        if (confirmResult?.success) {
                            await dispatch(newOrder({
                                orderItems: products.map(item => ({
                                    name: item.name,
                                    price: item.price,
                                    product: item._id,
                                    quantity: item.quantity,
                                    image: item.image
                                })),
                                itemsPrice: totalAmount,
                                totalPrice: totalAmount
                            }));

                            if (confirmResult.pdfUrl) {
                                setPdfData(confirmResult.pdfUrl);
                            }
                            setShowSuccess(true);
                            setShowStepThree(false);
                            onSuccess();
                        }
                    }
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();
            }
        } catch (error) {
            console.error('Payment failed:', error);
        }
    };

    return (
        <>
            {loading && <Loading />}
            
            <PopupModal show={showStepOne} onClose={() => {
                setShowStepOne(false);
                onClose();
            }}>
                <div className="step-content">
                    <div className="step-header">
                        <h2>Order Summary</h2>
                        <div className="step-indicator">Step 1 of 3</div>
                    </div>
                    <div className="product-info">
                        {products.map(product => (
                            <div key={product._id} className="product-header">
                                <div className="product-image-payment">
                                    <img src={product.image} alt={product.name} />
                                </div>
                                <div className="product-details">
                                    <h3>{product.name}</h3>
                                    <p className="product-quantity">Quantity: {product.quantity}</p>
                                    <p className="product-price">₹{product.price * product.quantity}</p>
                                </div>
                            </div>
                        ))}
                        <div className="price-breakdown">
                            <div className="price-row total">
                                <span>Total Amount</span>
                                <span className="amount">₹{totalAmount}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => {
                        setShowStepOne(false);
                        setShowStepTwo(true);
                    }} className="next-button-pay">
                        Continue to Payment
                    </button>
                </div>
            </PopupModal>

            {/* Step 2 and 3 remain the same as your original code */}
            {/* ... */}

            <PopupModal show={showSuccess} onClose={() => {
                setShowSuccess(false);
                onClose();
            }}>
                <div className="success-content">
                    <div className="success-icon">
                        <BsCheckCircleFill />
                    </div>
                    <h2>Payment Successful!</h2>
                    <p className="success-message">Your payment has been processed successfully.</p>
                    {pdfData && (
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
                    )}
                </div>
            </PopupModal>
        </>
    );
};

export default Payment;
