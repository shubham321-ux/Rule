import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, deleteOrder, updateOrder } from '../actions/orderAction';
import { getUserDetailsForadmin } from '../actions/userAction';
import Loading from '../components/Loading';
import './css/Alladminorders.css';

const Alladminorders = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showUserDetails, setShowUserDetails] = useState(false);

    const { loading, orders, totalAmount } = useSelector((state) => state.allOrders);
    const { error, isDeleted, isUpdated } = useSelector((state) => state.order);
    const { selectedUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getAllOrders(page));
    }, [dispatch, page, isDeleted, isUpdated]);

    const handleUserClick = (userId) => {
      const token = localStorage.getItem('token');
      if (token) {
          // setSelectedUserId(userId);
          setShowUserDetails(true);
          dispatch(getUserDetailsForadmin(userId));
      }
  };
  

    const handleBackClick = () => {
        setShowUserDetails(false);
        setSelectedUserId(null);
    };

    const handleStatusUpdate = async (orderId, status) => {
        try {
            const orderData = { status };
            await dispatch(updateOrder(orderId, orderData));
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await dispatch(deleteOrder(orderId));
            } catch (error) {
                console.error('Error deleting order:', error);
            }
        }
    };

    if (loading) return <Loading />;

    return (
      < div className="products-list-container" >
        <div className="orders-admin-container">
            {showUserDetails ? (
                <div className="user-details-overlay">
                    <div className="user-details-content">
                        <div className="update-header">
                            <button className="back-button" onClick={handleBackClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <h2>User Details</h2>
                        </div>
                        <div className="user-info">
                            <div className="info-row">
                                <label>Name:</label>
                                <span>{selectedUser.name}</span>
                            </div>
                            <div className="info-row">
                                <label>Email:</label>
                                <span>{selectedUser.email}</span>
                            </div>
                            <div className="info-row">
                                <label>Role:</label>
                                <span>{selectedUser.role}</span>
                            </div>
                            <div className="info-row">
                                <label>Joined:</label>
                                <span>{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="orders-list-container">
                    <h2>Orders Management</h2>
                    {orders && orders.length > 0 ? (
                        <>
                            <div className="total-amount">
                                <h3>Total Revenue: ₹{totalAmount}</h3>
                            </div>
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Total Amount</th>
                                        <th>Status</th>
                                        <th>Order Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>#{order._id}</td>
                                            <td>
                                                <button
                                                    className="user-link"
                                                    onClick={() => handleUserClick(order.user)}
                                                    type="button"
                                                >
                                                    #{order.user}
                                                </button>
                                            </td>
                                            <td>
                                                {order.orderItems.map((item, index) => (
                                                    <div key={index} className="order-item">
                                                        {item.name} x {item.quantity}
                                                    </div>
                                                ))}
                                            </td>
                                            <td>₹{order.totalPrice}</td>
                                            <td>
                                                <select
                                                    value={order.orderStatus}
                                                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                    className={`status-select ${order.orderStatus.toLowerCase()}`}
                                                >
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                </select>
                                            </td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="action-buttons">
                                                <div className="btn-group">
                                                    <button
                                                        onClick={() => handleDeleteOrder(order._id)}
                                                        className="btn-delete"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path d="M2 4H3.33333H14" stroke="#C8CAD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M5.3335 4.00004V2.66671C5.3335 2.31309 5.47397 1.97395 5.72402 1.7239C5.97407 1.47385 6.31321 1.33337 6.66683 1.33337H9.3335C9.68712 1.33337 10.0263 1.47385 10.2763 1.7239C10.5264 1.97395 10.6668 2.31309 10.6668 2.66671V4.00004M12.6668 4.00004V13.3334C12.6668 13.687 12.5264 14.0261 12.2763 14.2762C12.0263 14.5262 11.6871 14.6667 11.3335 14.6667H4.66683C4.31321 14.6667 3.97407 14.5262 3.72402 14.2762C3.47397 14.0261 3.3335 13.687 3.3335 13.3334V4.00004H12.6668Z" stroke="#C8CAD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <div className="no-orders">
                            <h2>No Orders Found</h2>
                            <p>There are currently no orders in the system.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
        </div>
    );
};

export default Alladminorders;
