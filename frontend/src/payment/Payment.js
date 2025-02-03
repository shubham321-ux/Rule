import React, { useState, useEffect } from 'react';
import '../css/Payment.css';
import { useDispatch, useSelector } from 'react-redux';
import { processPayment, confirmPayment } from '../actions/paymenetAction';
import { newOrder } from '../actions/orderAction';

const Payment = ({ product, onSuccess }) => {
    const dispatch = useDispatch();
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [showDownload, setShowDownload] = useState(false);
    const [pdfData, setPdfData] = useState(null);
    const { loading } = useSelector(state => state.payment);
    const paymentStatus = useSelector(state => state.payment);
   const [afterpaymentdata, setAfterpaymentdata] = useState();
    useEffect(() => {
        if (paymentStatus.success && paymentStatus.pdfUrl) {
            setPdfData(paymentStatus.pdfUrl);
            setShowDownload(true);
        }
    }, [paymentStatus]);

    const handlePayment = async () => {
        try {
            const processResult = await dispatch(processPayment(product._id));
            
            if (processResult?.payload?.success) {
                const confirmResult = await dispatch(confirmPayment(product._id));
                
                if (confirmResult?.payload?.success && confirmResult?.payload?.pdfUrl) {
                    setPdfData(confirmResult.payload.pdfUrl);
                    setShowDownload(true);
                    
                    const orderResult = await dispatch(newOrder({
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

                    if (orderResult?.payload?.success) {
                        onSuccess(confirmResult.payload.pdfUrl);
                    }
                }
            }
        } catch (error) {
            console.log('Payment failed:', error.message);
            alert(error.message);
        }
    };

    return (
        <div className="payment-modal">
            <div className="payment-container">
                {!showDownload ? (
                    <>
                        <h2>Purchase Details</h2>
                        <div className="product-info">
                            <p>Product: {product.name}</p>
                            <p className="price">Amount: ₹{product.price}</p>
                            <p className="tax">Tax (18%): ₹{(product.price * 0.18).toFixed(2)}</p>
                            <p className="total">Total: ₹{(product.price * 1.18).toFixed(2)}</p>
                        </div>
                        <div className="payment-methods">
                            <h3>Select Payment Method</h3>
                            <div className="method-options">
                                <label>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="card"
                                        checked={selectedMethod === 'card'}
                                        onChange={(e) => setSelectedMethod(e.target.value)}
                                    />
                                    Credit/Debit Card
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="upi"
                                        checked={selectedMethod === 'upi'}
                                        onChange={(e) => setSelectedMethod(e.target.value)}
                                    />
                                    UPI
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="netbanking"
                                        checked={selectedMethod === 'netbanking'}
                                        onChange={(e) => setSelectedMethod(e.target.value)}
                                    />
                                    Net Banking
                                </label>
                            </div>
                        </div>
                        <button
                            onClick={handlePayment}
                            className="pay-button"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : `Pay ₹${(product.price * 1.18).toFixed(2)}`}
                        </button>
                    </>
                ) : (
                    <div className="success-container">
                        <h2>Payment Successful!</h2>
                        <p>Your purchase was completed successfully.</p>
                        {pdfData && (
                            <div className="pdf-actions">
                                <a
                                    href={pdfData}
                                    download
                                    className="download-button"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Download PDF
                                </a>
                                <button 
                                    className="view-button"
                                    onClick={() => window.open(pdfData, '_blank')}
                                >
                                    View PDF
                                </button>
                            </div>
                        )}
                        <div className="order-details">
                            <h3>Order Summary</h3>
                            <p>Product: {product.name}</p>
                            <p>Amount Paid: ₹{(product.price * 1.18).toFixed(2)}</p>
                            <p>Order Status: Confirmed</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payment;
