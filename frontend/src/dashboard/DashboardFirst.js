import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders } from '../actions/orderAction';
import Loading from '../components/Loading';
import axios from 'axios';
// import './DashboardFirst.css';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3002';

const DashboardFirst = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const { loading, orders, totalAmount, error } = useSelector((state) => state.allOrders);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        await dispatch(getAllOrders(currentPage));
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [dispatch, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewDetails = (orderId) => {
    window.location.href = `/order/${orderId}`;
  };

  return (
    <div className="dashboard-main">
      <h1>Dashboard Overview</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Amount</h3>
          <p>₹{totalAmount?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{orders?.length || 0}</p>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="error-container">
          <p className="error">{error}</p>
          <button 
            className="retry-button"
            onClick={() => dispatch(getAllOrders(currentPage))}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="orders-table">
          <h2>Recent Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status ${order.orderStatus.toLowerCase()}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>₹{order.totalPrice.toFixed(2)}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => handleViewDetails(order._id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders?.pagination?.totalPages > 1 && (
            <div className="pagination">
              {[...Array(orders.pagination.totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardFirst;
