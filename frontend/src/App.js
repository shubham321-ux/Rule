import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import store from "./store";
import { useSelector } from "react-redux";
import { loadUser } from "./actions/userAction";
import { getCategories } from "./actions/categoryAction";
import { getProduct } from "./actions/productAction";
import Loading from "./components/Loading";

// Lazy load your components and pages
const Header = React.lazy(() => import("./components/Header"));
const Home = React.lazy(() => import("./pages/Home"));
const Products = React.lazy(() => import("./pages/Products"));
const ProductDetails = React.lazy(() => import("./pages/ProductDetails"));
const Login = React.lazy(() => import("./pages/LoginPage"));
const ForgotPasswordForm = React.lazy(() => import("./components/ForgotPasswordForm"));
const ResetPasswordForm = React.lazy(() => import("./components/ResetPasswordForm"));
const AdminProtectedRoute = React.lazy(() => import("./components/AdminProtectedRoute"));
const CreateProduct = React.lazy(() => import("./dashboard/Createproduct"));
const Myorders = React.lazy(() => import("./pages/Myorders"));
const DashboardHome = React.lazy(() => import("./dashboard/DashboardHome"));
const FavoriteProducts = React.lazy(() => import("./components/FavoriteProducts"));
const ProtectedRoute = React.lazy(() => import("./components/ProtectedRoute"));
const Layout = React.lazy(() => import("./components/Layout"));
const About = React.lazy(() => import("./pages/About"));

function App() {
  const [loading, setLoading] = useState(true);

  // Dispatching actions on initial load
  useEffect(() => {
    const loadAppData = async () => {
      try {
        // Start fetching data
        await store.dispatch(loadUser());  // Load user data
        await store.dispatch(getProduct(1));  // Fetch the first page of products
        await store.dispatch(getCategories());  // Get categories data
        setLoading(false);  // After all data is fetched, set loading to false
        console.log("User loaded and products fetched");
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false); // Even if there's an error, stop the loading state
      }
    };
    
    loadAppData();
  }, []);  // Empty dependency array ensures this runs only once

  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (loading) {
    return <Loading />;  // Show loading spinner while data is being fetched
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Layout wraps all pages */}
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/password-reset/:token" element={<ResetPasswordForm />} />
            <Route path="/about" element={<About />} />
            
            {/* Protected Routes */}
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
            <Route path="/myorders" element={<ProtectedRoute><Myorders /></ProtectedRoute>} />
            <Route path="/favorite-products" element={<ProtectedRoute><FavoriteProducts /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/create-product" element={<AdminProtectedRoute><CreateProduct /></AdminProtectedRoute>} />
            <Route path="/dashboard" element={<AdminProtectedRoute><DashboardHome /></AdminProtectedRoute>} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
