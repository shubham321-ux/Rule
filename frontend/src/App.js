import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import store from "./store";
import { useSelector } from "react-redux";
import { loadUser } from "./actions/userAction";
import { getCategories } from "./actions/categoryAction";
import { getProduct } from "./actions/productAction";
import { getFavorites } from "./actions/favoritebooksAction";
import Loading from "./components/Loading";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/LoginPage";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import CreateProduct from "./dashboard/Createproduct";
import CreateCategoryForm from "./dashboard/CreateCategoryForm";
import Myorders from "./pages/Myorders";
import DashboardHome from "./dashboard/DashboardHome";
import FavoriteProducts from "./components/FavoriteProducts";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";
import DashboardFirst from "./dashboard/DashboardFirst";
import ProductsForAdmin from "./dashboard/ProductsForAdmin";
import Alladminorders from "./dashboard/Alladminorders";
import UsersManagement from "./dashboard/UsersManagement";
import EditProfile from "./pages/EditProfile";
function App() {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    const loadAppData = async () => {
      try {
        await Promise.all([
          store.dispatch(loadUser()),
          store.dispatch(getProduct(1)),
          store.dispatch(getCategories()),
          store.dispatch(getFavorites())
        ]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAppData();
  }, []);

  if (loading) return <Loading />;

  return (
    <BrowserRouter>
      <Routes>
        {/* Main Layout Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPasswordForm />} />
          <Route path="password-reset/:token" element={<ResetPasswordForm />} />
          <Route path="about" element={<About />} />
          <Route path="products" element={<Products />} />
          <Route path="product/:id" element={<ProductDetails />} />
         
          {/* Protected Routes */}
          <Route path="profile" element={<ProtectedRoute><EditProfile/></ProtectedRoute>} />
          <Route path="myorders" element={
            <ProtectedRoute>
              <Myorders />
            </ProtectedRoute>
          } />
          <Route path="favorite-products" element={
            <ProtectedRoute>
              <FavoriteProducts />
            </ProtectedRoute>
          } />
        </Route>

        {/* Separate Dashboard Routes */}
        <Route path="/dashboard" element={
          <AdminProtectedRoute>
            <DashboardHome />
          </AdminProtectedRoute>
        }>
          <Route index element={<ProductsForAdmin />} />
          <Route path="create-product" element={<CreateProduct />} />
          <Route path="create-category" element={<CreateCategoryForm />} />
          <Route path="products-forAdmin" element={<ProductsForAdmin />} />
          <Route path="allorders" element={<Alladminorders />} />
          <Route path="allusers" element={<UsersManagement/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
