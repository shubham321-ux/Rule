import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { myOrders } from "../actions/orderAction"; // Adjust path if necessary
import Header from "../components/Header";

const Myorders = () => {
  const dispatch = useDispatch();

  // Access the orders, loading, and error states from Redux
  useEffect(() => {
    dispatch(myOrders());
  }, [dispatch]);

  const { orders, loading, error } = useSelector((state) => state.myOrders);
  const [myallorders, setMyallorders] = useState([]);

 
  useMemo(() => {
    if (orders?.orders) {
      setMyallorders(orders.orders);
    }
  }, [orders]);

//   console.log(myallorders);

  return (
    <div>
      {/* <Header /> */}
      <h1>My Orders</h1>

     
      {loading && <p>Loading...</p>}

     
      {error && <p style={{ color: "red" }}>{`Error: ${error.message || error}`}</p>}


      {orders && orders.length === 0 && !loading && <p>No orders found.</p>}

      <div>
        {myallorders && myallorders.length > 0 ? (
          <ul>
            {myallorders.map((order) => {
              // Handle the case when `orderItems` is missing or empty
              if (!order.orderItems || order.orderItems.length === 0) {
                return (
                  <div key={order._id}>
                    <h5>{order._id}</h5>
                    <p>Order Status: {order.orderStatus || "No order status available"}</p>
                    <p>No items in this order</p>
                  </div>
                );
              }

              return (
                <div key={order._id}>
                  <h5>{order._id}</h5>
                  <p>Order Status: {order.orderStatus || "No order status available"}</p>

                  {/* Loop through order items */}
                  {order.orderItems.map((item) => {
                    if (!item.name || !item.quantity || !item.price) {
                      return (
                        <div key={item._id || "unknown-item"}>
                          <p>Product: {item.name || "No name available"}</p>
                          <p>Quantity: {item.quantity || "No quantity available"}</p>
                          <p>Price: {item.price || "No price available"}</p>
                        </div>
                      );
                    }

                    return (
                      <div key={item._id}>
                        <p>Product: {item.name}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: {item.price}</p>
                        <img
                        src={item.image} // Replace this with your PDF thumbnail image
                        alt="PDF Thumbnail"
                        style={{ width: 100, height: 100, cursor: "pointer" }}
                      />
                      </div>
                    );
                  })}

                  {/* If the order has a PDF associated with it */}
                  {order.pdf && order.pdf.url ? (
                    <div>
                      <h5>PDF Available:</h5>
                      {/* Display the PDF image or thumbnail */}

                      <button
                        onClick={() => window.open(order.pdf.url, "_blank")}
                        style={{
                          padding: "10px 20px",
                          backgroundColor: "#007BFF",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer",
                          marginLeft: "10px",
                        }}
                      >
                        View PDF
                      </button>
                    </div>
                  ):"pdf not available"}
                </div>
              );
            })}
          </ul>
        ) : (
          <p>No orders to display.</p>
        )}
      </div>
    </div>
  );
};

export default Myorders;
