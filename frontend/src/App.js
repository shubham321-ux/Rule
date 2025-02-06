import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useMemo } from "react";
import store from "./store";
import { useSelector } from "react-redux";
import { loadUser } from "./actions/userAction";
import { getCategories } from "./actions/categoryAction";
import { getProduct } from "./actions/productAction";

// Pages & Components
import Header from "./components/Header";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/LoginPage";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import CreateProduct from "./dashboard/Createproduct";
import Myorders from "./pages/Myorders";
import DashboardHome from "./dashboard/DashboardHome";
import FavoriteProducts from './components/FavoriteProducts';
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  // Dispatching actions on initial load
  useMemo(() => {
    store.dispatch(loadUser());
    store.dispatch(getProduct(1));
    console.log("User loaded and products fetched");
  }, []);

  useMemo(() => {
    store.dispatch(getCategories());
  }, []);

  const { isAuthenticated, user } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wraps all pages */}
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/password-reset/:token" element={<ResetPasswordForm />} />

          {/* Protected Routes */}
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
          <Route path="/myorders" element={<ProtectedRoute><Myorders /></ProtectedRoute>} />
          <Route path="/favorite-products" element={<ProtectedRoute><FavoriteProducts /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/create-product" element={<AdminProtectedRoute><CreateProduct /></AdminProtectedRoute>} />
          <Route path="/dashboard" element={<AdminProtectedRoute><DashboardHome /></AdminProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
