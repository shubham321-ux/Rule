import logo from './logo.svg';
import './App.css';
import Header from "./components/Header"
import Home from "./pages/Home"
import {BrowserRouter, browserRouter,Route,Routes} from "react-router-dom"
import Products from "./pages/Products"
import ProductDetails from "./pages/ProductDetails"
import Login from './pages/LoginPage';
import { loadUser } from './actions/userAction';
import { useEffect } from 'react';
import store from './store';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
 
  useEffect(()=>
  {
    store.dispatch(loadUser())
  },[])
  const{isAuthenticated,user}=useSelector((state)=>state.user)
  console.log(isAuthenticated)
  return (<>
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/products" element={
      <ProtectedRoute><Products/></ProtectedRoute>}/>
    <Route path="/product/:id" element={<ProductDetails/>}/>
    <Route path="/Login" element={<Login/>}/>

  </Routes>
  </BrowserRouter>
  </>
    
  );
}

export default App;
