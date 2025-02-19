import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { myOrders } from "../actions/orderAction";
import { getProductDetails } from "../actions/productAction";
import { FiDownload } from 'react-icons/fi';
import './css/Myorders.css';
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const Myorders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.myOrders);
  const { product } = useSelector((state) => state.productDetails);
  const [myallorders, setMyallorders] = useState([]);

  useEffect(() => {
    dispatch(myOrders());
  }, [dispatch]);

  useEffect(() => {
    if (orders?.orders) {
      orders.orders.forEach(order => {
        order.orderItems.forEach(item => {
          dispatch(getProductDetails(item.product));
        });
      });
    }
  }, [orders, dispatch]);

  useMemo(() => {
    if (orders?.orders) {
      setMyallorders(orders.orders);
    }
  }, [orders]);

  const navigateToProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="main-my-order-div">
      {loading && <Loading/>}
      {error && <p style={{ color: "red" }}>{`Error: ${error.message || error}`}</p>}
      {orders && orders.length === 0 && !loading && <p>No orders found.</p>}

      <div className="orders-container">
        {myallorders && myallorders.length > 0 && myallorders.map((order) => (
          <div  key={order._id} className="order-card">
            {order.orderItems && order.orderItems.map((item) => (
              <div key={item._id} className="order-item">
                <div className="image-container">
                  <img
                    src={item.image}
                    alt="Product Thumbnail"
                    className="myproduct-image"
                  />
                </div>

                <div className="content-container">
                  <div className="order-details-title">
                    <h3 className="main-heading my-order-heading">{item.name}</h3>
                    <p>Created: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p>Author: {product?.author || 'Loading...'}</p>

                  <div className="buttons-container">
                    <button className="read-button"
                     onClick={() => window.open(order.pdf?.url, "_blank")}>
                      Read Now
                    </button>
                    <button
                      className="my-order-download-button"
                      onClick={() => window.open(order.pdf?.url, "_blank")}>
                      <FiDownload className="download-icon" /> Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Myorders;
